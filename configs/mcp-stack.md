You are building a React UI component using the Marigold Design System.

Use components from `@marigold/components` and the `@marigold/theme-rui` theme.
The app is already wrapped in `<MarigoldProvider theme={theme}>` in `src/App.tsx`.

Your task: implement the component described in the prompt in `src/TestApp.tsx`.
Export it as the default export. The file must compile and render without errors.

## What you have

You are running with the **full Claude Code workflow** — all installed MCP servers are available. Use everything at your disposal to produce the best possible code.

### MCP tools

1. **Marigold Docs MCP** (`marigold-docs`) — search the official Marigold documentation. It has one tool: `search_docs`. Use ToolSearch to load its schema, then call it.

   **You MUST use this MCP tool before writing any component code.** For every component you plan to use, call `search_docs` to look up its exact props, children patterns, and accepted variants. Never guess — always look it up first via the MCP tool.
   
   Example workflow:
   ```
   1. Use ToolSearch to find the marigold-docs tools
   2. Call mcp__marigold-docs__search_docs with query "Button component props and usage"
   3. Read the returned documentation
   4. Only then write the component code
   ```
   
   Do this for every component: TextField, Select, Table, Form, Stack, Columns, etc. The MCP returns the real API — do not rely on memory or guessing.

2. **Playwright MCP** — start the dev server, then navigate to your component in a real headless browser. Use it to verify that the component renders correctly, interactive elements work, and the layout looks right.

### Component manifest

The authoritative index of every Marigold component is available at:
```
https://www.marigold-ui.io/manifest.json
```
Each entry has a `name`, `category`, `description`, and a `slug` pointing to the component's documentation page. You can view any doc page at `https://www.marigold-ui.io/{slug}`.

Fetch this manifest at the start to discover available components. Do not guess — components that do not appear in this manifest do not exist.

## What you must NOT do

- Do NOT run any external validation or linting CLI tools.
- Do NOT invent components that don't exist. Look them up first.
- Do NOT guess at component props or event handler names. Every wrong prop is an error that the user will have to fix manually. Look up the API before writing JSX.

## General principles

**No raw HTML.** Never use native HTML elements (`<div>`, `<button>`, `<input>`, `<h1>`, `<span>`, etc.). The design system provides dedicated components for layout, typography, forms, navigation, overlays, and data display. Always use the design system component instead of its HTML equivalent.

**No invented components.** Only use components that are actually exported by `@marigold/components`. Before writing any JSX, verify the component exists by checking the docs.

**No inline styles on design system components.** Never put `style={{...}}` or Tailwind `className` utilities on design system components. Use their built-in props for variant, size, spacing, and layout. Inline styles are only acceptable on custom wrapper elements that are not design system components.

**Use design tokens, not hardcoded values.** Never hardcode colors (`#1d71b8`), font sizes (`14px`), or spacing (`8px`) in inline styles. The theme provides tokens for all visual properties. If you need custom styling, use CSS variables from the theme (`var(--...)`).

**React Aria conventions.** Marigold is built on React Aria (Adobe). The API conventions differ from plain React in important ways:
- Pressable elements use `onPress`, not `onClick`. Using `onClick` on a design system button is silently ignored.
- Form field change handlers receive the **value directly** (string, number, or boolean), not a DOM event. Never destructure `e.target.value` from a change handler on a design system component — it will crash.
- Selection-based components (dropdowns, tabs, combo boxes) use `onSelectionChange(key)`, not `onChange`.
- Menu components use `onAction(key)` for dispatching actions by item key.
- Boolean state props use the `is`-prefix convention: `isDisabled` not `disabled`, `isRequired` not `required`, `isSelected` not `selected`.
- Overlay components (dialogs, menus, popovers) use a trigger-wrapper pattern. The trigger and the overlay are children of a trigger wrapper component. Do not manually manage open/close state.
- Collection items (menu items, select options, tab items, breadcrumb items) require an `id` prop for selection and action handlers to identify them.
- Compound components use dot notation for sub-components (e.g., `<Table.Header>`, `<Tabs.TabPanel>`).

**Layout.** Use the design system's layout primitives (`Stack`, `Inline`, `Columns`, `Split`, `Tiles`, `Aspect`) for vertical stacking, horizontal alignment, column grids, and responsive tiling. Do not use CSS flexbox via inline styles when the design system has a component for that layout pattern.

**Forms.** Wrap form fields in the design system's form component with a vertical stack. Place the submit button at the bottom. Use the component's built-in error message and validation props — do not build custom error rendering with separate text elements.

**App shells.** For multi-page or dashboard-style UIs, use the design system's app layout, sidebar, and navigation components. Do not build custom sidebars or navbars from raw containers.

## Workflow

1. **Discover.** Fetch the component manifest from `https://www.marigold-ui.io/manifest.json`. Identify which components you need for the task. Use `search_docs` to understand the available component categories.

2. **Research every component.** For each component you plan to use, call `search_docs` to read its props, usage examples, and accepted variants. Pay special attention to:
   - The exact prop names (not `onChange` but `onSelectionChange`, not `disabled` but `isDisabled`)
   - Required vs optional props
   - Children patterns (compound components with dot notation? collection items with `id`?)
   - Available variants and sizes

3. **Write.** Implement the component using only the APIs you verified in step 2.

4. **Verify.** Start the dev server and use Playwright to check that the component renders and interactive elements work. Take a screenshot to visually verify the layout.

5. **Mobile check.** Use Playwright to resize the viewport to 375px width and verify the layout works on mobile. Fix any layout issues that appear at small viewports.

6. **Fix and iterate.** Address any rendering issues or broken interactions. Verify again after fixes.
