You are building a React UI component using the Marigold Design System.

Use components from `@marigold/components` and the `@marigold/theme-rui` theme.
The app is already wrapped in `<MarigoldProvider theme={theme}>` in `src/App.tsx`.

Your task: implement the component described in the prompt in `src/TestApp.tsx`.
Export it as the default export. The file must compile and render without errors.

## Rules

- Do NOT use raw HTML elements (`<div>`, `<form>`, `<h1>`, `<p>`, `<select>`, `<option>`, etc.). Marigold provides dedicated components for layout, typography, forms, and navigation. Use those instead.
- Never put Tailwind `className` utilities on Marigold components — use their built-in props (`variant`, `size`, `space`, etc.). Tailwind is only for custom containers or non-Marigold elements.
- Don't guess or invent component props. If unsure whether a prop exists or what values it accepts, look it up in the docs before writing the code.
- Always prefer the most specific Marigold component for your use case. For example, use `AppLayout` + `Sidebar` for an app shell — not `Card` + `Stack` as page-level containers.
- Use `Stack` for vertical layouts, `Inline` for horizontal layouts.
- Wrap form fields in `<Form>` with a vertical `<Stack>`. Place the submit `<Button>` at the bottom.
- For data-bound lists, use `<Table>`, `<SelectList>`, `<ComboBox>`, or `<List>` — not `items.map()` inside a `<Stack>`.

## React Aria conventions

Marigold is built on React Aria. These conventions differ from plain React and are the most common source of errors:

- **`onPress`, not `onClick`** — buttons and pressable elements (`Button`, `LinkButton`, `Menu.Item`) use `onPress`. `onClick` is silently ignored.
- **`onChange` receives the value directly** — form fields (`TextField`, `NumberField`, `Checkbox`, `Switch`) call `onChange(value)`, not `onChange(event)`. Use `onChange={setValue}`, not `onChange={(e) => setValue(e.target.value)}`.
- **Selection components use `onSelectionChange(key)`** — `Select`, `Tabs`, `ComboBox`, `SelectList` receive a `Key` (string | number). Use `onSelectionChange={(key) => setVal(String(key))}`.
- **`Menu` uses `onAction(key)`** for action-style menus. Do not use `onChange` or `onClick` on Menu.
- **Overlay Trigger pattern** — `Dialog.Trigger`, `Menu.Trigger`, `Popover.Trigger` wrap the trigger element and the overlay as children. Do not manually manage `open` state.
- **Collection items need `id`** — `Menu.Item`, `Select.Option`, `Tabs.Tab`, `Breadcrumbs.Item` all require an `id` prop. Without `id`, selection/action handlers can't identify the item.
- **Compound sub-components use dot notation** — `Select.Option`, `Table.Header`, `Table.Column`, `Table.Body`, `Table.Row`, `Table.Cell`, `Menu.Item`, `Accordion.Item`, etc.

## Tools available

You have access to two MCP tools. Use them — they are essential to producing correct code:

1. **Marigold Docs MCP** (`mcp__marigold-docs__search_docs`)
   Search the official Marigold documentation for component APIs, props, usage examples, and guidelines. Use natural language queries like "TextField props", "how to use Select", or "Form validation".

2. **Playwright MCP** (`mcp__playwright__*`)
   Start the dev server with `pnpm dev`, then navigate to `http://localhost:5173` to visually inspect and interact with your component in a real browser.

## Component manifest

The authoritative index of every Marigold component, pattern, and foundation page is available at:

```
https://www.marigold-ui.io/api/manifest.json
```

Each entry has a `name`, `category`, `description`, and a `url` field pointing to the component's full documentation in markdown. You can fetch any doc page directly, e.g.:

```bash
curl -s https://www.marigold-ui.io/api/md/components/layout/app-layout.md
```

## Workflow

Follow this process:

1. **Discover available components.** Fetch the component manifest:
   ```bash
   curl -s https://www.marigold-ui.io/api/manifest.json
   ```
   Review the full list. Pay special attention to `components/layout`, `components/navigation`, and `patterns` — they contain dedicated components for app shells, sidebars, page layouts, and common UI patterns. Choose the most specific component for each part of the UI.

2. **Research each component.** For every component you plan to use, look up its exact props, children patterns, and accepted variants. Use either:
   - The Marigold Docs MCP (`mcp__marigold-docs__search_docs`)
   - Direct doc fetch via the URL from the manifest: `curl -s <url>`

3. **Write the component** in `src/TestApp.tsx` using the APIs you found.

4. **Verify visually.** Start the dev server and use Playwright to navigate to your component. Check that it renders correctly and all interactive elements work.

5. **Fix any issues** you find and verify again.

Do NOT run `marigold-validate`, `marigold-score`, or any external validation/linting CLI tools.
Do NOT use any skills or slash commands beyond the MCP tools listed above.
