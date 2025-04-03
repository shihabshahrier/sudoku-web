import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isValid(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3), startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board: number[][]): boolean {
  let row = 0, col = 0, isEmpty = false;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard'): { puzzle: number[][], solution: number[][] } {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes
  for (let box = 0; box < 9; box += 3) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let num;
        do {
          num = getRandomInt(1, 9);
        } while (!isValid(board, box + i, box + j, num));
        board[box + i][box + j] = num;
      }
    }
  }

  // Solve the rest of the board
  solveSudoku(board);

  // Create a copy of the solved board
  const solution = board.map(row => [...row]);

  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 45,
    hard: 55
  }[difficulty];

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = getRandomInt(0, 8);
    const col = getRandomInt(0, 8);
    if (board[row][col] !== 0) {
      const temp = board[row][col];
      board[row][col] = 0;

      // Check if the puzzle still has a unique solution
      const tempBoard = board.map(row => [...row]);
      let solutionCount = 0;
      const countSolutions = (board: number[][]): boolean => {
        if (solutionCount > 1) return false;

        let row = 0, col = 0, isEmpty = false;
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
              row = i;
              col = j;
              isEmpty = true;
              break;
            }
          }
          if (isEmpty) break;
        }

        if (!isEmpty) {
          solutionCount++;
          return true;
        }

        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (!countSolutions(board)) return false;
            board[row][col] = 0;
          }
        }

        return true;
      };

      countSolutions(tempBoard);

      if (solutionCount !== 1) {
        board[row][col] = temp;
      } else {
        removed++;
      }
    }
  }

  return { puzzle: board, solution };
}

function calculateOptimalLayout(totalPuzzles: number, pageWidth: number, pageHeight: number, margin: number) {
  const aspectRatio = 1; // Sudoku grids are square
  const minSpacing = 5; // Minimum spacing between grids in mm

  let bestLayout = {
    cols: 1,
    rows: totalPuzzles,
    gridSize: 0,
    spacing: minSpacing
  };

  const availableWidth = pageWidth - (2 * margin);
  const availableHeight = pageHeight - (2 * margin);

  // Try different numbers of columns
  for (let cols = 1; cols <= Math.ceil(Math.sqrt(totalPuzzles)); cols++) {
    const rows = Math.ceil(totalPuzzles / cols);

    // Calculate maximum possible grid size for this layout
    const maxGridWidth = (availableWidth - (minSpacing * (cols - 1))) / cols;
    const maxGridHeight = (availableHeight - (minSpacing * (rows - 1))) / rows;
    const gridSize = Math.min(maxGridWidth, maxGridHeight);

    // Calculate actual spacing to distribute remaining space
    const totalGridWidth = gridSize * cols;
    const totalGridHeight = gridSize * rows;
    const horizontalSpacing = cols > 1 ? (availableWidth - totalGridWidth) / (cols - 1) : minSpacing;
    const verticalSpacing = rows > 1 ? (availableHeight - totalGridHeight) / (rows - 1) : minSpacing;
    const spacing = Math.min(horizontalSpacing, verticalSpacing);

    // Update best layout if this one uses space more efficiently
    if (gridSize > bestLayout.gridSize && spacing >= minSpacing) {
      bestLayout = { cols, rows, gridSize, spacing };
    }
  }

  return bestLayout;
}

export function generatePDF(grids: { puzzle: number[][], solution: number[][] }[], config: {
  problemsPerPage: number,
  solutionsPerPage: number,
  pageSize: 'A4' | 'Letter'
}): string {
  const doc = new jsPDF({
    format: config.pageSize.toLowerCase(),
    unit: 'mm'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // Calculate optimal layouts for problems and solutions
  const problemLayout = calculateOptimalLayout(
    config.problemsPerPage,
    pageWidth,
    pageHeight,
    margin
  );

  const solutionLayout = calculateOptimalLayout(
    config.solutionsPerPage,
    pageWidth,
    pageHeight,
    margin
  );

  // Function to draw a single Sudoku grid
  const drawGrid = (grid: number[][], x: number, y: number, size: number) => {
    const cellSize = size / 9;

    // Draw the cells
    doc.setFontSize(Math.max(8, Math.min(12, cellSize * 0.8)));
    doc.setLineWidth(0.1);

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellX = x + (j * cellSize);
        const cellY = y + (i * cellSize);

        // Thicker lines for 3x3 boxes
        if (i % 3 === 0) doc.setLineWidth(0.5);
        else doc.setLineWidth(0.1);
        doc.line(cellX, cellY, cellX + cellSize, cellY);

        if (j % 3 === 0) doc.setLineWidth(0.5);
        else doc.setLineWidth(0.1);
        doc.line(cellX, cellY, cellX, cellY + cellSize);

        // Draw number if cell is not empty
        if (cell !== 0) {
          doc.text(
            cell.toString(),
            cellX + (cellSize / 2),
            cellY + (cellSize / 2) + (cellSize * 0.1),
            { align: 'center', baseline: 'middle' }
          );
        }
      });
    });

    // Draw the final borders
    doc.setLineWidth(0.5);
    doc.line(x + size, y, x + size, y + size);
    doc.line(x, y + size, x + size, y + size);
  };

  // Draw problems
  let currentPage = 0;
  grids.forEach((grid, index) => {
    if (index > 0 && index % config.problemsPerPage === 0) {
      doc.addPage();
      currentPage++;
    }

    const pageIndex = index % config.problemsPerPage;
    const col = pageIndex % problemLayout.cols;
    const row = Math.floor(pageIndex / problemLayout.cols);

    const x = margin + col * (problemLayout.gridSize + problemLayout.spacing);
    const y = margin + row * (problemLayout.gridSize + problemLayout.spacing);

    // Add problem number
    doc.setFontSize(8);
    doc.text(`Problem ${index + 1}`, x, y - 2);

    drawGrid(grid.puzzle, x, y, problemLayout.gridSize);
  });

  // Add solutions pages
  if (config.solutionsPerPage > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Solutions', margin, margin - 2);

    grids.forEach((grid, index) => {
      if (index > 0 && index % config.solutionsPerPage === 0) {
        doc.addPage();
      }

      const pageIndex = index % config.solutionsPerPage;
      const col = pageIndex % solutionLayout.cols;
      const row = Math.floor(pageIndex / solutionLayout.cols);

      const x = margin + col * (solutionLayout.gridSize + solutionLayout.spacing);
      const y = margin + row * (solutionLayout.gridSize + solutionLayout.spacing);

      // Add solution number
      doc.setFontSize(8);
      doc.text(`Solution ${index + 1}`, x, y - 2);

      drawGrid(grid.solution, x, y, solutionLayout.gridSize);
    });
  }

  return doc.output('datauristring');
}