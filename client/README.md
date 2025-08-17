# E-Storya Frontend

A React-based frontend for the E-Storya booth game application.

## What Was Fixed

The frontend UI was missing some configuration files that are required for proper operation:

1. **Added `tailwind.config.js`** - Required for Tailwind CSS v4 configuration
2. **Added `postcss.config.js`** - Required for PostCSS processing with Tailwind
3. **Fixed CSS imports** - Updated to use correct Tailwind CSS v4 syntax
4. **Fixed font path** - Corrected the relative path to the custom font

## Features

- **Student ID Input** - Beautiful form to enter student number
- **Game Mechanics** - Instructions screen with animations
- **Stacking Game** - Interactive canvas-based stacking game
- **Results Display** - Score and leaderboard with animations
- **Responsive Design** - Works on both mobile and desktop
- **Custom Font** - Uses Cweyons font for consistent branding

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

- React 19.1.0
- Vite 7.0.4
- Tailwind CSS 4.1.11
- Framer Motion 12.23.12

## Project Structure

```
src/
├── components/          # UI components
│   ├── StudentIdInput.jsx
│   ├── NameInput.jsx
│   ├── Mechanics.jsx
│   ├── StackGame.jsx
│   ├── Results.jsx
│   ├── ApprovalWaiting.jsx
│   └── WelcomeMessage.jsx
├── assets/             # Static assets
│   └── font/          # Custom fonts
├── App.jsx            # Main app component
├── Game.jsx           # Game state management
├── Admin.jsx          # Admin interface
├── config.js          # Configuration
└── index.css          # Global styles
```

The frontend is now fully functional and ready to use!
