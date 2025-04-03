import React from 'react';
import { Settings } from 'lucide-react';

interface ConfigPanelProps {
  onConfigChange: (config: SudokuConfig) => void;
}

export interface SudokuConfig {
  problemsPerPage: number;
  totalPages: number;
  solutionsPerPage: number;
  pageSize: 'A4' | 'Letter';
  difficulty: 'easy' | 'medium' | 'hard';
}

export function ConfigPanel({ onConfigChange }: ConfigPanelProps) {
  const [config, setConfig] = React.useState<SudokuConfig>({
    problemsPerPage: 4,
    totalPages: 1,
    solutionsPerPage: 4,
    pageSize: 'A4',
    difficulty: 'medium',
  });

  const handleChange = (key: keyof SudokuConfig, value: string | number) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Problems per page (2-20)
          </label>
          <input
            type="number"
            min="2"
            max="20"
            value={config.problemsPerPage}
            onChange={(e) => handleChange('problemsPerPage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total pages
          </label>
          <input
            type="number"
            min="1"
            value={config.totalPages}
            onChange={(e) => handleChange('totalPages', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Solutions per page (2-20)
          </label>
          <input
            type="number"
            min="2"
            max="20"
            value={config.solutionsPerPage}
            onChange={(e) => handleChange('solutionsPerPage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Page size
          </label>
          <select
            value={config.pageSize}
            onChange={(e) => handleChange('pageSize', e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
}