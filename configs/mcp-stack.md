You are building a React UI component using the Marigold Design System.

Use components from `@marigold/components` and the `@marigold/theme-rui` theme.
The app is already wrapped in `<MarigoldProvider theme={theme}>` in `src/App.tsx`.

Your task: implement the component described in the prompt in `src/TestApp.tsx`.
Export it as the default export. The file must compile and render without errors.

## What you have

You are running with the **full Claude Code workflow** — all installed MCP servers, skills, and plugins are available. Use everything at your disposal to produce the best possible code.

### MCP tools

1. **Marigold Docs MCP** — search the official Marigold documentation for component APIs, props, usage examples, and guidelines. Use it to look up every component before writing code. Never guess at props or component names when you can look them up.

2. **Playwright MCP** — start the dev server, then navigate to your component in a real headless browser. Use it to verify that the component renders correctly, interactive elements work, and the layout looks right.

### Skills

You have access to all installed skills. Use them actively — they exist to help you write better code:

- **Marigold design system skill** — use it for component guidance, React Aria conventions, form patterns, table patterns, and authoritative documentation lookups. This is your primary reference for how Marigold components work.
- **Design critique skill** — use it to review your UI for visual polish, information hierarchy, spacing, and layout quality. Run a critique before finalizing your component.
- **Any other available skills** (clean code, TypeScript best practices, etc.) — use them where appropriate to improve code quality and structure.

### Component manifest

The authoritative index of every Marigold component is available at:
```
https://www.marigold-ui.io/api/manifest.json
```
Each entry has a `name`, `category`, `description`, and a `url` field pointing to the component's full documentation. You can fetch any doc page directly via `curl -s <url>`.

## What you must NOT do

- Do NOT run any external validation or linting CLI tools.
- Do NOT invent components that don't exist. Look them up first.

## General principles

**No raw HTML.** Never use native HTML elements for things the design system covers. The design system provides dedicated components for layout, typography, forms, navigation, overlays, and data display. Always prefer the design system component over its HTML equivalent. If you find yourself reaching for a `<div>` or a `<span>`, check the manifest — there is almost certainly a design system component for that purpose.

**No invented components.** Only use components that are actually exported by `@marigold/components`. Before writing any JSX, verify the component exists by checking the docs or the manifest. Common mistakes include using component names from other libraries (like Material UI or Chakra) that don't exist in Marigold.

**No inline styles on design system components.** Never put `style={{...}}` or Tailwind `className` utilities on design system components. Use their built-in props for variant, size, spacing, and layout. Inline styles are only acceptable on custom wrapper elements that are not design system components.

**React Aria conventions.** Marigold is built on React Aria (Adobe). The API conventions differ from plain React in important ways:
- Pressable elements use `onPress`, not `onClick`. Using `onClick` on a design system button is silently ignored.
- Form field change handlers receive the **value directly** (string, number, or boolean), not a DOM event. Never destructure `e.target.value` from a change handler on a design system component — it will crash.
- Selection-based components (dropdowns, tabs, combo boxes) use `onSelectionChange(key)`, not `onChange`.
- Menu components use `onAction(key)` for dispatching actions by item key.
- Boolean state props use the `is`-prefix convention: `isDisabled` not `disabled`, `isRequired` not `required`, `isSelected` not `selected`.
- Overlay components (dialogs, menus, popovers) use a trigger-wrapper pattern. The trigger and the overlay are children of a trigger wrapper component. Do not manually manage open/close state.
- Collection items (menu items, select options, tab items, breadcrumb items) require an `id` prop for selection and action handlers to identify them.
- Compound components use dot notation for sub-components.

**Clean code.** Write well-structured TypeScript. Use `type` for type definitions. Keep components reasonably sized — decompose large UIs into page-level sub-components. Extract repeated logic into helper functions. Use meaningful variable names.

**Layout.** Use the design system's layout primitives for vertical stacking, horizontal alignment, column grids, and responsive tiling. Do not use CSS flexbox via inline styles when the design system has a component for that layout pattern.

**Forms.** Wrap form fields in the design system's form component with a vertical stack. Place the submit button at the bottom. Use the component's built-in error message and validation props — do not build custom error rendering with separate text elements.

**App shells.** For multi-page or dashboard-style UIs, use the design system's app layout, sidebar, and navigation components with the router provider pattern. Do not build custom sidebars or navbars from raw containers.

## Workflow

1. **Discover.** Fetch the component manifest. Review what's available. Plan which components you need.
2. **Research.** For every component you plan to use, look up its exact props, children patterns, and accepted variants via the docs MCP or the manifest URLs. Do not skip this step.
3. **Write.** Implement the component using the APIs you verified.
4. **Critique.** Use the design critique skill to review your UI for quality, hierarchy, and polish.
5. **Verify.** Start the dev server and use Playwright to check that the component renders and interactive elements work.
6. **Fix.** Address any rendering issues or design critique feedback. Verify again.
