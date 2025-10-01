# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level Commands
- `pnpm dev` - Start all packages in development mode
- `pnpm build` - Build all packages
- `pnpm dev:templates` - Start only the templates package in dev mode
- `pnpm dev:app` - Start only the app package in dev mode

### Package-Specific Commands

#### App Package (`packages/app/`)
- `pnpm dev` - Start Vite dev server on port 3000
- `pnpm build` - Build with Vite and run TypeScript compiler
- `pnpm test` - Run Vitest tests
- `pnpm lint` - Run Biome linting
- `pnpm check` - Run Biome checks (format + lint)

#### Templates Package (`packages/templates/`)
- `pnpm dev` - Start Vite dev server for template development
- `pnpm test` - Run Vitest tests (unit and browser)
- `pnpm test:browser` - Run browser-specific tests
- `pnpm create-template` - Generate new template boilerplate

#### Shared Packages
- **shared-schema**: `pnpm type-check` - TypeScript type checking
- **shared-utils**: `pnpm build` - Compile TypeScript, `pnpm dev` - Watch mode

## Architecture Overview

### Monorepo Structure
This is a pnpm workspace with four main packages:

1. **`@quickcv/shared-schema`** - Zod schemas and TypeScript types
2. **`@quickcv/shared-utils`** - Common utilities (date formatting, etc.)
3. **`@quickcv/templates`** - CV template components and rendering
4. **`app`** - Main React application (CV builder UI)

### Package Dependencies
- App depends on all shared packages
- Templates depend on shared-schema and shared-utils
- Shared packages are independent of each other

### Key Technologies
- **Frontend**: React 19, Vite, TanStack Router
- **Styling**: TailwindCSS v4, Radix UI primitives
- **State**: Zustand for state management
- **Forms**: React Hook Form with Zod validation
- **PDF**: @react-pdf/renderer for CV generation
- **Rich Text**: Slate.js editor
- **Testing**: Vitest with jsdom and Playwright
- **Linting**: Biome (replaces ESLint/Prettier)

## Project Structure Rules

### Core App Structure
```
src/
├── app/           # routes, main app component, providers, router
├── assets/        # static files (images, fonts, etc.)
├── components/    # shared UI components
├── config/        # global configs, env variables
├── features/      # feature-based modules (main organization principle)
├── hooks/         # shared hooks
├── lib/           # preconfigured libraries
├── stores/        # global state
├── testing/       # test utilities, mocks
├── types/         # shared types
└── utils/         # shared utilities
```

**Architecture Flow**: `shared → features → app` (unidirectional)

### Feature Organization
```
src/features/[feature-name]/
├── api/           # API calls & hooks for this feature
├── assets/        # static files for this feature
├── components/    # feature-specific components
├── hooks/         # feature-specific hooks
├── stores/        # feature-specific state
├── types/         # feature-specific types
└── utils/         # feature-specific utilities
```

**Note**: Only include folders that are necessary for the feature

### Import Rules
- **Use absolute imports**: `@/components/ui/button` not `../../../components/ui/button`
- **Direct imports only**: No barrel exports (avoid `index.ts` re-exports)
  - Barrel files cause Vite tree shaking issues and performance problems
- **No cross-feature imports**: Features should not import from each other

```javascript
// ❌ Bad: cross-feature import
import { Discussion } from '@/features/discussions/types';

// ✅ Good: compose at app level instead
import { UserList } from '@/features/users/components/user-list';
import { DiscussionList } from '@/features/discussions/components/discussion-list';
```

## Component Architecture

### Structure & Organization
- **Colocate everything**: Keep components, styles, state close to usage
- **Extract rendering logic**: No nested render functions - create separate components

```javascript
// ❌ Bad: nested rendering functions
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}

// ✅ Good: separate component
function Items() {
  return <ul>...</ul>;
}

function Component() {
  return (
    <div>
      <Items />
    </div>
  );
}
```

- **Limit props**: Max 5-7 props per component, use composition via children/slots
- **Abstract shared components**: Build reusable component library
- **Wrap 3rd party components**: Always wrap external components for customization

### Performance Rules

#### State Management
- **Avoid single giant state**: Split state by usage areas
- **Keep state local**: Place state close to where it's used
- **Use state initializers**: `useState(() => expensiveFn())` not `useState(expensiveFn())`
- **Leverage children prop**: Use for preventing unnecessary re-renders

```javascript
// ❌ Bad: PureComponent re-renders when count updates
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>
      <PureComponent /> {/* re-renders unnecessarily */}
    </div>
  );
};

// ✅ Good: children won't re-render when count updates
const App = () => (
  <Counter>
    <PureComponent />
  </Counter>
);

const Counter = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>
      {children} {/* won't re-render */}
    </div>
  );
};
```

### Naming Conventions
- **Files**: `kebab-case` for all files (`user-profile.tsx`)
- **Folders**: `kebab-case` for all folders (`user-management/`)
- **Components**: `kebab-case` for component names
- **Stay consistent**: Same patterns across entire codebase

## TypeScript Standards
- **Strict TypeScript enabled**
- **No `any`, `!` (non-null assertion), or `as unknown` casting**
- **Use `satisfies` over type assertions**
- **Zod for all schema validation**
- **Define custom types**: Create types as needed

## Template System Architecture

Templates are React components that render CV data. The system includes:

### Template Generation
- Templates auto-registered in `templates.gen.ts` (auto-generated)
- Use `pnpm create-template "Template Name"` to scaffold new templates
- Each template exports a `name` constant for auto-detection

### Template Rendering
- `renderTemplateToHTML()` function converts React components to HTML
- Templates receive CV data via props matching the shared schema
- Built-in CSS compilation with TailwindCSS extraction

### Template Development
- Isolated development environment in templates package
- Mock data provided for template testing
- Browser tests ensure rendering correctness

## Form Architecture

The CV builder uses a simplified, schema-driven form pattern:

### Form State Management
- Zustand store in `form-store.ts` manages CV data
- Form navigation handled by `FormNavigationProvider`
- Direct Zod schema consumption using `extractFormFields()`

### Form Components
- **`<Form />`** - Dumb component that only renders fields from schema
- **Collection forms** - Handle arrays (experience, education, etc.)
- **Rich text editor** - For formatted content
- **Date range picker** - For employment periods
- **Photo uploader** - With image optimization

### Form Field Extraction
```typescript
// Extract field metadata directly from Zod schema
const fields = extractFormFields(experienceItemSchema);

// Simple form rendering
<Form schema={schema} form={form} onKeyDown={handleKeyDown} />
```

### Screen Organization
- Each step is a separate screen component
- Screen content wrapped in consistent layout
- Navigation between steps with keyboard shortcuts (Alt + Arrow keys)

## Architecture Principles
- **DRY**: Don't repeat yourself
- **SOLID**: Follow SOLID principles
- **Onion architecture**: Core logic separated from external dependencies
- **Scalable design**: Anticipate future growth

## Biome Configuration

Code formatting and linting managed by Biome:
- Tab indentation, 80 character line width
- Double quotes for JavaScript/JSX
- Kebab-case filename enforcement
- Unused imports automatically removed
- Accessibility rules for components

## Testing Strategy

### Unit Tests
- Vitest for utility functions and components
- jsdom environment for React component testing
- Tests colocated with source files in `__tests__/` folders

### Browser Tests
- Playwright for template rendering validation
- Ensures CSS compilation and visual correctness
- Browser-specific test project in templates package

## Implementation Checklist

### Before Creating Components
- [ ] Is this logic reused elsewhere? → Abstract to shared component
- [ ] Does this need state? → Keep state local if possible
- [ ] Too many props? → Use composition pattern
- [ ] Large component? → Split into smaller components
- [ ] Wrapping 3rd party component? → Adapt to app needs

### Before Adding Features
- [ ] Create feature folder structure (only necessary folders)
- [ ] Define types first
- [ ] Implement API layer (or use shared API folder)
- [ ] Build components with proper composition
- [ ] Add hooks/utils as needed
- [ ] Ensure no cross-feature imports
- [ ] Follow unidirectional architecture flow

### Code Review Points
- [ ] Uses absolute imports (`@/`)
- [ ] Follows naming conventions (kebab-case files)
- [ ] No unnecessary re-renders (use children prop optimization)
- [ ] Proper TypeScript typing (no `any`, `!`, `as unknown`)
- [ ] State management optimized (local state, initializers)
- [ ] Components properly sized and focused
- [ ] Images optimized (lazy loading, modern formats)
- [ ] Code splitting at route level only