You are building a React UI component using the Marigold Design System.

Use components from `@marigold/components` and the `@marigold/theme-rui` theme.
The app is already wrapped in `<MarigoldProvider theme={theme}>` in `src/App.tsx`.

Your task: implement the component described in the prompt in `src/TestApp.tsx`.
Export it as the default export. The file must compile and render without errors.

## What you have

You are running in **bare mode** — no documentation access, no browser, no external tools.
Your only tools are **Bash**, **Read**, **Edit**, and **Write**.

Write the component based entirely on your training knowledge of the Marigold Design System and React Aria.

## What you must NOT do

- Do NOT start a dev server. You have no browser tools to verify rendering.
- Do NOT explore `node_modules` or run type-checking commands. Write the file directly.
- Do NOT run any external validation or linting CLI tools.
- Do NOT use any skills or slash commands.
- Do NOT fetch URLs or access external documentation.

## General principles

These apply to all Marigold code. Follow them from memory:

**No raw HTML.** Never use native HTML elements for things the design system covers. The design system provides dedicated components for layout, typography, forms, navigation, overlays, and data display. Always prefer the design system component over its HTML equivalent.

**No invented components.** Only use components that are actually exported by `@marigold/components`. Do not guess or invent component names. If you are unsure whether a component exists, use the closest component you are confident about.

**React Aria conventions.** Marigold is built on React Aria (Adobe). The API conventions differ from plain React in important ways:
- Pressable elements use `onPress`, not `onClick`. Using `onClick` on a design system button is silently ignored.
- Form field change handlers receive the **value directly** (string, number, or boolean), not a DOM event. Never destructure `e.target.value` from a change handler on a design system component — it will crash.
- Selection-based components (dropdowns, tabs, combo boxes) use `onSelectionChange(key)`, not `onChange`.
- Menu components use `onAction(key)` for dispatching actions by item key.
- Boolean state props use the `is`-prefix convention: `isDisabled` not `disabled`, `isRequired` not `required`, `isSelected` not `selected`.
- Overlay components (dialogs, menus, popovers) use a trigger-wrapper pattern. The trigger and the overlay are children of a trigger wrapper component. Do not manually manage open/close state.
- Collection items (menu items, select options, tab items, breadcrumb items) require an `id` prop for selection and action handlers to identify them.
- Compound components use dot notation for sub-components (e.g., parent component dot sub-component name).

**Clean code.** Write well-structured TypeScript. Use `type` for type definitions. Keep components reasonably sized. Extract repeated logic into helper functions. Use meaningful variable names.

**Layout.** Use the design system's layout primitives for vertical stacking, horizontal alignment, column grids, and responsive tiling. Do not use CSS flexbox via inline styles when the design system has a component for that layout pattern.

**Forms.** Wrap form fields in the design system's form component with a vertical stack. Place the submit button at the bottom. Use the design system's error message props for validation feedback — do not build custom error rendering.

**App shells.** For multi-page or dashboard-style UIs, use the design system's app layout, sidebar, and navigation components. Do not build custom sidebars or navbars from raw containers.
