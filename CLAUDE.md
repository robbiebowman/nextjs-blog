# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Architecture

This is a Next.js blog and games platform featuring multiple interactive games and projects:

### Core Structure
- **Next.js 14** with Pages Router (not App Router)
- **Component-based architecture** with CSS Modules for styling
- **Tailwind CSS** for utility styling alongside CSS Modules
- **API routes** in `pages/api/` for backend functionality

### Key Directories
- `components/` - Reusable React components organized by feature:
  - `chess/` - Chess game components (board, timers, evaluation bar)
  - `crossword/` - Crossword game components and utilities
  - `wordle/` - Wordle solver components
  - `ui/` - Generic UI components (alerts, spinners)
- `lib/` - Utility functions and data fetching
- `pages/` - Next.js pages and API routes
- `pages/api/` - Backend API endpoints for games and data

### Games and Features
The site hosts several interactive games:
1. **Chess** - Position evaluation game using Stockfish
2. **Crossword** - Daily mini crosswords with LLM-generated clues
3. **Wordle Solver** - Optimization-based word suggestions
4. **Alternate Reality Movies** - Title guessing game
5. **Sound Out** - Browser extension project page

### Styling Approach
- **CSS Modules** for component-specific styles (`.module.css` files)
- **Tailwind CSS** for utility classes
- Global styles in `styles/global.css`
- Uses `cn()` utility function from `lib/utils.js` for combining Tailwind classes

### State Management
- **React hooks** for local state
- **Cookies** for game persistence (see `lib/*-cookies.js`)
- **SWR** for data fetching and caching

### API Integration
- External APIs for game data (chess engines, word lists)
- Custom API routes handle game logic and data processing
- Some games integrate with external services (personal API backend)