You are building a React UI component using the Marigold Design System.

Use components from `@marigold/components` and the `@marigold/theme-rui` theme.
The app is already wrapped in `<MarigoldProvider theme={theme}>` in `src/App.tsx`.

Your task: implement the component described in the prompt in `src/TestApp.tsx`.
Export it as the default export. The file must compile and render without errors.

## What you have

You are running with the **full Claude Code workflow plus `marigold-validate`** — all installed MCP servers, skills, plugins, and the deterministic validation CLI are available. Use everything at your disposal to produce the best possible code.

### MCP tools

1. **Marigold Docs MCP** — search the official Marigold documentation for component APIs, props, usage examples, and guidelines. Use it to look up every component before writing code. Never guess at props or component names when you can look them up.

2. **Playwright MCP** — start the dev server, then navigate to your component in a real headless browser. Use it to verify that the component renders correctly, interactive elements work, and the layout looks right.

### Skills

- **Marigold design system skill** — use it for component guidance, React Aria conventions, form patterns, table patterns, and authoritative documentation lookups. This is your primary reference for how Marigold components work.

### Validation CLI

**`marigold-validate`** is a deterministic validation tool that checks your code for:

**Static checks** (run on source code):
- Invalid or non-existent props on design system components
- Components that don't exist in the design system (hallucinated component names)
- Usage of raw HTML elements that should be design system components
- React Aria handler convention violations (wrong event handler names, wrong handler signatures)
- Boolean prop convention violations (`disabled` vs `isDisabled`)
- Component composition errors (missing required sub-components)
- Design token and theme variant compliance
- TypeScript compilation errors

**Spatial checks** (run in a headless browser at 375px, 768px, and 1280px viewports):
- Horizontal overflow / scroll at mobile and tablet viewports
- Touch targets smaller than 44×44px on mobile
- Components that disappear (zero dimensions) at smaller viewports
- Interactive elements not reachable via keyboard Tab navigation
- Missing visible focus indicators on focused elements
- Overlapping components that obscure each other
- Content overflowing its container bounds

Run it with:
```bash
marigold validate src/TestApp.tsx
marigold validate src/TestApp.tsx --checks technical    # static checks only (fast)
marigold validate src/TestApp.tsx --checks spatial      # browser checks only
marigold validate src/TestApp.tsx --checks a11y         # accessibility checks only
```

This is your most important feedback tool. Read **every** error and warning it produces — including spatial warnings about responsive layout, keyboard accessibility, and overlap issues. Fix them. Run it again. Repeat until the output is clean.

### Component manifest

The authoritative index of every Marigold component is available at:
```
https://www.marigold-ui.io/manifest.json
```
Each entry has a `name`, `category`, `description`, and a `slug` pointing to the component's documentation page. You can view any doc page at `https://www.marigold-ui.io/{slug}`.

## What you must NOT do

- Do NOT invent components that don't exist. Look them up first. The validator will catch hallucinated components, but avoiding them in the first place saves time.

## General principles

**No raw HTML.** Never use native HTML elements. The design system provides dedicated components for layout, typography, forms, navigation, overlays, and data display. Always use the design system component instead of its HTML equivalent.

**No invented components.** Only use components that are actually exported by `@marigold/components`. Before writing any JSX, verify the component exists by checking the docs.

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

**Layout.** Use the design system's layout primitives for vertical stacking, horizontal alignment, column grids, and responsive tiling. Do not use CSS flexbox via inline styles when the design system has a component for that layout pattern.

**Forms.** Wrap form fields in the design system's form component with a vertical stack. Place the submit button at the bottom. Use the component's built-in error message and validation props — do not build custom error rendering with separate text elements.

**App shells.** For multi-page or dashboard-style UIs, use the design system's app layout, sidebar, and navigation components. Do not build custom sidebars or navbars from raw containers.

## Workflow

1. **Discover.** Use the Marigold docs MCP or the design system skill to find which components are available. Plan which components you need.
2. **Research.** For every component you plan to use, look up its exact props, children patterns, and accepted variants. Do not skip this step.
3. **Write.** Implement the component using the APIs you verified.
4. **Validate (static).** Run `marigold validate src/TestApp.tsx --checks technical`. Focus on fixing all static errors first: wrong props, hallucinated components, handler conventions, compilation issues.
5. **Fix and re-validate.** Address each static issue, then run the validator again. Repeat until static errors are resolved.
6. **Verify and fix spatial issues.** Run `marigold validate src/TestApp.tsx --checks spatial` to check responsive layout, keyboard accessibility, overlapping components, and overflow in a headless browser. Fix issues by using responsive layout primitives (`Columns` with `collapseAt`, `Stack`, `Inline`) instead of fixed-width layouts. Re-validate after spatial fixes.
7. **Mobile check.** Use Playwright to resize the viewport to 375px width and verify the layout works on mobile. Fix any layout issues that appear at small viewports.
8. **Final pass.** Run `marigold validate src/TestApp.tsx` (all checks) one last time. Fix any remaining issues.

The validate-fix-validate loop is your most important feedback mechanism. Use it iteratively. The validator catches both static code issues (props, components, handlers) and spatial issues (responsive layout, keyboard accessibility, overlap) — address both categories before finalizing.
