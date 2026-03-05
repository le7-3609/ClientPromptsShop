# GitHub Copilot / Agent Onboarding

Purpose
- Short, practical instructions for an automated coding agent seeing this repository for the first time.

Quick summary
- This repository is a Single Page Application (SPA) built with Angular (v21) and TypeScript. It is a client UI for "ClientPromptsShop" (catalog, categories, orders, admin area). The app boots in `src/main.ts` and uses a component-based architecture under `src/app` with routing defined in `src/app/app.routes.ts` and providers configured in `src/app/app.config.ts`.

Tech stack
- Angular 21 (standalone components / bootstrapApplication)
- TypeScript (tsconfig strict mode enabled, TypeScript ~5.9)
- PrimeNG + primeuix theme (Lara), Chart.js, Tailwind present in devDependencies
- RxJS, zone.js
- Testing: Karma + Jasmine
- Build: Angular build (`@angular/build`) and Angular CLI scripts defined in `package.json`

How the app runs (quick commands)
- Install dependencies: use `npm ci` (preferred) or `npm install`.
- Start dev server: `npm start` (configured to use Angular dev-server). The project serve configuration uses port `5000` (see `angular.json`).
- Build production: `npm run build` (uses Angular build/production settings).
- Run tests: `npm test`.

Environment notes
- File replacements: `angular.json` replaces `src/environments/environment.ts` with `src/environments/environment.development.ts` for development builds.
- `environment.development.ts` contains `apiUrl` (default: `https://localhost:44371/api`) and a `googleClientId` placeholder — when running against a backend, ensure the API endpoint and TLS are available or update `proxy.conf.json` to route calls appropriately.

Project structure (high-level)
- `angular.json`, `package.json`, `tsconfig*.json` — project and build config.
- `public/` — static assets included in builds.
- `src/main.ts` — app bootstrap.
- `src/app/` — application source: `app.ts`, `app.routes.ts`, `app.config.ts`, `components/`, `services/`, `models/`, `auth/`, `admin/`.
- `src/environments/` — environment-specific settings.

Coding guidelines & conventions
- Follow TypeScript `strict` settings; do not relax compiler options without strong justification.
- Use Angular schematics for scaffolding: `ng generate component <name>` to keep style and file structure consistent (the CLI is configured to default SCSS).
- Styles: use SCSS (component `.scss` alongside `.ts` + `.html`). PrimeNG + primeuix are used for UI; prefer those components for consistent UX.
- File naming and exports: components use PascalCase class names and kebab-case file names; keep exports consistent to avoid ambiguous imports.
- DI and providers: register application-wide providers in `src/app/app.config.ts`. Use `provideRouter(routes)` for routing providers.
- Tests: write unit tests with Jasmine/Karma alongside components (`*.spec.ts`). Run `npm test` locally.

Project-specific quirks
- Components in this repo are implemented as `standalone: true` Angular components (not NgModules). Follow that pattern when adding new components.
- Templates and styles in existing components use `templateUrl` and `styleUrl` (singular) consistently — mirror the same keys and filename conventions to match the codebase.

Existing tools & resources
- `package.json` scripts: `start`, `build`, `watch`, `test`.
- Prettier config exists in `package.json` — follow it (print width 100, single quotes true, HTML parser = angular).
- No ESLint config committed (check workspace for `.eslintrc` if needed). TypeScript strictness enforces many lint-like checks.

Practical tips to avoid failures
- Use the repo-local CLI: run scripts via `npm run` or `npx ng` to ensure the version matches devDependencies. Do not rely on a global `ng` unless its version is known compatible.
- Node: use an LTS Node version compatible with Angular 21 (Node 18–20 recommended). If CI fails with native bindings, try Node 18.
- Avoid running `ng build` with production config until dependencies are installed and `apiUrl` / environment values are set.
- The dev server expects HTTPS backend at `https://localhost:44371/api` (see environment.development). If the backend uses a self-signed cert, use `proxy.conf.json` or configure the OS/browser accordingly.
- Large generated caches exist (`.angular/cache`) — ignore these during analysis and do not commit build artifacts.

How to implement a small feature (checklist)
1. Create component: `npm run ng generate component components/<feature-name>` (this ensures correct file layout and scss setup).
2. Add route: edit `src/app/app.routes.ts` and add a route entry. For admin areas prefer lazy-loading `admin.routes` pattern.
3. Add service if needed under `src/app/services/` and register via constructor injection or `app.config.ts` if app-wide.
4. Add unit test: `*.spec.ts` next to component and run `npm test`.
5. Run `npm start` to test the feature in the browser (http://localhost:5000 by default).

When to ask a human
- If a backend API contract is required (endpoints, authentication), ask for the API spec or Postman collection.
- If a secret (Google client ID, API key) is needed, do not hardcode; request secure storage or guidance.

Useful file landmarks
- app bootstrap: `src/main.ts`
- routing: `src/app/app.routes.ts`
- app-level providers/config: `src/app/app.config.ts`
- environment replacements: `angular.json` -> `src/environments/*`

Short etiquette
- Make minimal, reversible changes in a commit; add tests for behavior you change; prefer using Angular CLI to scaffold code.

If you get build/test failures
- Re-run with the local CLI: `npm ci && npm start` or `npm test` and capture error output.
- Typical fixes: install missing deps, pin Node LTS, check `environment.*` values, ensure `proxy.conf.json` is present for API calls.

End of onboarding notes — update this file if project configuration changes.
