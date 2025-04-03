import React from 'react';
import { Download, Play } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { ConfigPanel, type SudokuConfig } from './components/ConfigPanel';
import { SudokuGrid } from './components/SudokuGrid';
import { generateSudoku, generatePDF } from './lib/utils';

function App() {
  const [config, setConfig] = React.useState<SudokuConfig>({
    problemsPerPage: 4,
    totalPages: 1,
    solutionsPerPage: 4,
    pageSize: 'A4',
    difficulty: 'medium',
  });

  const [grids, setGrids] = React.useState<{ puzzle: number[][], solution: number[][] }[]>([]);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [pdfPreview, setPdfPreview] = React.useState<string | null>(null);

  const handleGenerate = () => {
    const totalPuzzles = config.problemsPerPage * config.totalPages;
    const newGrids = Array(totalPuzzles)
      .fill(null)
      .map(() => generateSudoku(config.difficulty));

    setGrids(newGrids);
    setIsGenerated(true);

    // Generate PDF preview
    const pdfDataUrl = generatePDF(newGrids, {
      problemsPerPage: config.problemsPerPage,
      solutionsPerPage: config.solutionsPerPage,
      pageSize: config.pageSize,
    });
    setPdfPreview(pdfDataUrl);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPreview!;
    link.download = 'sudoku-puzzles.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ava Sudoku</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ConfigPanel onConfigChange={setConfig} />

            <div className="space-y-4">
              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5" />
                Generate & Preview
              </button>

              {isGenerated && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            <div className="w-full aspect-[1/1.414] bg-white">
              {pdfPreview ? (
                <iframe
                  src={pdfPreview}
                  className="w-full h-full border-0 rounded-lg"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  Click "Generate & Preview" to see the PDF
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Sudoku PDF Generator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;