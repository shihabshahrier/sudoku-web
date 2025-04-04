# Ava Sudoku PDF Generator

A modern web application for generating Sudoku puzzles and creating printable PDFs with both puzzles and solutions.

![Ava Sudoku](public/sudoku.png)

## Features

- **Generate Sudoku Puzzles**: Create Sudoku puzzles with three difficulty levels (easy, medium, hard)
- **Customizable PDF Output**: Configure the number of puzzles per page, total pages, and solutions
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Instant Preview**: See your generated PDF before downloading
- **Unique Solutions**: Ensures each puzzle has exactly one valid solution

## Technologies Used

- **React**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **jsPDF**: For PDF generation
- **Vite**: For fast development and building

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sudoku-web.git
   cd sudoku-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage

1. Configure your Sudoku settings:
   - Select difficulty level (easy, medium, hard)
   - Choose number of puzzles per page
   - Set total number of pages
   - Configure solutions per page
   - Select page size (A4 or Letter)

2. Click "Generate & Preview" to create your Sudoku puzzles

3. Review the preview of your PDF

4. Click "Download PDF" to save the file to your device

## How It Works

The application uses a sophisticated algorithm to generate valid Sudoku puzzles with unique solutions:

1. **Puzzle Generation**: Creates a solved Sudoku board and then removes numbers based on the selected difficulty
2. **Solution Validation**: Ensures each puzzle has exactly one valid solution
3. **PDF Creation**: Generates a PDF with both puzzles and solutions, optimized for printing

