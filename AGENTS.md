# Repository Guidelines

## Project Structure & Module Organization
- `pages/` holds Next.js Pages Router routes; `pages/api/` contains API endpoints.
- `components/` is organized by feature (for example `components/chess/`, `components/crossword/`, `components/wordle/`, plus shared UI in `components/ui/`).
- `lib/` provides shared utilities, data fetching, and cookie helpers.
- `styles/` contains global styles and CSS Modules; `public/` stores static assets; `posts/` holds markdown content.

## Build, Test, and Development Commands
- `npm run dev` starts the local Next.js dev server.
- `npm run build` creates the production build output.
- `npm start` runs the production server from the build output.

## Coding Style & Naming Conventions
- Use 2-space indentation and keep changes consistent with surrounding files.
- Favor single quotes in JS and double quotes in JSX attributes.
- React components use PascalCase; functions and variables use camelCase.
- Prefer CSS Modules (`*.module.css`) for component styles and Tailwind utility classes where helpful.
- When composing Tailwind class strings, use the `cn()` helper from `lib/utils.js`.

## Testing Guidelines
- There are no automated tests or test scripts configured right now.
- If adding tests, co-locate them with the feature and name files like `*.test.js`, then document the new command in `package.json`.

## Commit & Pull Request Guidelines
- Commit messages in this repo are short, imperative, and capitalized (for example: "Add sound out page", "Fix android input").
- PRs should explain the change, link related issues, and include screenshots or recordings for UI-facing updates.
- Call out any API changes or new environment variables in the PR description.

## Configuration & Security
- Store secrets in `.env.local` and avoid committing credentials or local overrides.
- If a change impacts deployment behavior, document the new variables or runtime assumptions.