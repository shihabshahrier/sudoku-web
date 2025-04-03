import React from 'react';
import { cn } from '../lib/utils';

interface SudokuGridProps {
  grid: number[][];
  className?: string;
}

export function SudokuGrid({ grid, className }: SudokuGridProps) {
  return (
    <div className={cn("grid grid-cols-9 gap-0.5 bg-gray-300 p-0.5 rounded-lg", className)}>
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={cn(
              "aspect-square flex items-center justify-center bg-white dark:bg-gray-800",
              "text-lg font-medium text-gray-900 dark:text-gray-100",
              j % 3 === 2 && "border-r-2 border-gray-300",
              i % 3 === 2 && "border-b-2 border-gray-300"
            )}
          >
            {cell !== 0 && cell}
          </div>
        ))
      )}
    </div>
  );
}