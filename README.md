# operate-prototype
Interactive prototype for the Operate equipment experience

This React + TypeScript + Vite UX prototype explores equipment troubleshooting on desktop and mobile. It uses local mock data only, with no backend, API integration, or authentication. GitHub is the source of truth for the project.

## Requirements

- Node.js 22.12 or newer supported LTS version (Node.js 24 LTS recommended)
- npm

## Install and run

From the cloned repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173/. If that port is in use, Vite prints an alternative port.

## Build

```sh
npm run build
```

This checks TypeScript and generates the production build in `dist/`. To preview that build locally:

```sh
npm run preview
```

## Project structure

- `src/App.tsx`: prototype view state and navigation.
- `src/components/`: reusable components and prototype views.
- `src/data/`: local equipment, points, trends, notes, and document mock data.
- `src/assets/`: bundled representative equipment image and its source/license notes.
- `src/styles.css`: desktop and responsive styles.
- `docs/operate-requirements.md`: FigJam-derived requirements, future concepts, and unresolved decisions.

See [Operate requirements](docs/operate-requirements.md) for the design source and scope. Some destinations remain prototype stubs, document selection does not fetch files, and related equipment reuses the available AHU mock content. Session changes are not persisted to a backend.

The current equipment tabs are Operate, Points, Trends, and Associated Documents. Overview includes the upper equipment/field-information cards, compact Key Points, an inline Point Trend, Related Equipment, and an always-open Notes composer. See [Implemented Prototype Updates](docs/operate-requirements.md#implemented-prototype-updates) for the approved November 2, 2026 changes and local-only behavior.

## Repository hygiene

Commit source, documentation, configuration, and `package-lock.json`. Dependencies, generated builds, caches, editor state, and environment/credential files are ignored. Do not commit secrets. No environment variables or external asset downloads are required to run the prototype.
