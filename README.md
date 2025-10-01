# QuickCV Monorepo

![QuickCV Demo](.github/preview.gif)

A privacy-first CV builder that lets you create professional résumés and deploy them as live portfolio websites. Built entirely client-side with no accounts or databases. Just authenticate with your Vercel API key, craft your CV through an intuitive wizard, and publish instantly. Manage and update your résumé anytime with live PDF preview and one-click deployment.

## Repository structure

| Package | Description |
| --- | --- |
| `packages/app` | Vite + React application where users compose CVs, manage projects, and export PDFs. Uses TanStack Router/Query, React Hook Form, Slate-based rich text editors, Tailwind CSS, and Radix UI. |
| `packages/templates` | Headless template showcase with Vite. Provides résumé templates, Tailwind utilities, screenshot generation, and helper scripts for authoring new templates. |
| `packages/shared-schema` | Zod-powered data contracts that define the CV domain models and validation helpers shared across packages. |
| `packages/shared-utils` | TypeScript utility layer that coordinates common helpers and re-exports shared schema types. |
| `packages/web` | Astro front-end for the public marketing site. |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

Install all dependencies once prerequisites are available:

```bash
pnpm install
```

## Development workflows

### Run the résumé builder

```bash
pnpm dev:app
```

This starts the Vite development server for `packages/app` on [http://localhost:3000](http://localhost:3000).

### Explore résumé templates

```bash
pnpm dev:templates
```

The templates playground runs on Vite and hot-reloads while you tweak layouts, Tailwind styles, or
animation settings.

### Generate template artifacts

From within the templates workspace you can scaffold and document templates:

```bash
pnpm --filter @quickcv/templates create-template      # Interactive template scaffold
pnpm --filter @quickcv/templates generate-screenshots # Capture marketing screenshots
```

### Type checking, linting, and formatting

The application relies on Biome for linting/formatting and the TypeScript compiler for type safety.
Common commands (all runnable with `pnpm --filter <package> <script>`):

- `pnpm --filter app check` - Biome lint + format checks for the React app
- `pnpm --filter app typecheck` - Type-only build for the app
- `pnpm --filter @quickcv/templates test` - Vitest unit/browser tests for templates
- `pnpm --filter @quickcv/shared-utils test` - Vitest suite for shared utilities

You can run all package scripts together with `pnpm -r <script>` (e.g., `pnpm -r test`).

### Building for production

```bash
pnpm build
```

The root build script fans out to each workspace, invoking their `build` tasks. This produces the
production-ready Vite bundles and TypeScript declarations where applicable.

## Additional resources

- Résumé data schemas live in `packages/shared-schema/src` and can be imported from
  `@quickcv/shared-schema`.
- Reusable helpers are exported from `@quickcv/shared-utils`.
- Astro marketing pages reside under `packages/web` with a standard `npm run dev` workflow if you
  prefer working in that project directly.

## Contributing

1. Fork and clone the repository.
2. Install dependencies with `pnpm install`.
3. Create a branch for your feature or fix.
4. Run the appropriate `pnpm` scripts (tests, lint, type-check) before opening a pull request.
5. Submit your PR with a summary of the changes and any notes for reviewers.

Happy résumé building!

