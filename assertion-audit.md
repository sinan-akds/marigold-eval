# Assertion Audit Report

Synthesized from three independent reviews: Marigold-coverage analysis, reference-implementation cross-check, and design-critique assessment.

---

## P-01: Contact Form

### Confirmed-good assertions
- `a-import-marigold` — correctly required
- `a-name-field`, `a-email-field`, `a-select`, `a-textarea` — core form fields
- `a-submit-button`, `a-form-wrapper` — form structure
- `a-no-raw-html` — absence of raw input/select/textarea

### Assertions to add

```json
{
  "id": "a-uses-onpress",
  "description": "Buttons use onPress (not onClick)",
  "severity": "required",
  "check": { "type": "text-content", "pattern": "/onPress/" }
}
```
Rationale: P-02 and P-03 both check this; P-01 is inconsistent.

```json
{
  "id": "a-no-onclick-on-marigold",
  "description": "No onClick on Marigold Button components",
  "severity": "recommended",
  "check": { "type": "absence", "pattern": "/<Button[^>]*onClick/", "scope": "any" }
}
```
Rationale: Same consistency gap as above.

### Assertions to fix

**`a-submit-button`** — Currently checks only `Button` existence. The checklist specifies `type: "submit"`. Strengthen:
```json
{
  "id": "a-submit-button",
  "description": "Submit button with type=submit",
  "severity": "required",
  "check": { "type": "component", "component": "Button", "props": { "type": "submit" } }
}
```

**`a-no-raw-html`** — Missing `button` and `form` from absence checks. Expand:
```json
{
  "id": "a-no-raw-html",
  "description": "No raw HTML form elements (input, select, textarea, button, form)",
  "severity": "required",
  "check": {
    "type": "composite",
    "operator": "and",
    "checks": [
      { "type": "absence", "pattern": "input", "scope": "jsx" },
      { "type": "absence", "pattern": "select", "scope": "jsx" },
      { "type": "absence", "pattern": "textarea", "scope": "jsx" },
      { "type": "absence", "pattern": "button", "scope": "jsx" },
      { "type": "absence", "pattern": "form", "scope": "jsx" }
    ]
  }
}
```

### Assertions to remove
None.

---

## P-02: EventHub Dashboard

### Confirmed-good assertions
- `a-import-marigold`, `a-table`, `a-badge`, `a-search-field`, `a-menu`, `a-dialog`, `a-date-picker`, `a-tabs`, `a-accordion`, `a-card`, `a-text-field`, `a-select`, `a-switch`, `a-button`, `a-form`
- `a-uses-onpress`, `a-no-onclick-on-marigold`

### Assertions to add

**CRITICAL: Raw HTML absence checks (P-02 currently has zero)**
```json
{
  "id": "a-no-raw-html",
  "description": "No raw HTML elements (input, select, textarea, button, form, table)",
  "severity": "required",
  "check": {
    "type": "composite",
    "operator": "and",
    "checks": [
      { "type": "absence", "pattern": "button", "scope": "jsx" },
      { "type": "absence", "pattern": "input", "scope": "jsx" },
      { "type": "absence", "pattern": "select", "scope": "jsx" },
      { "type": "absence", "pattern": "table", "scope": "jsx" },
      { "type": "absence", "pattern": "form", "scope": "jsx" },
      { "type": "absence", "pattern": "textarea", "scope": "jsx" }
    ]
  }
}
```

**Headline component:**
```json
{
  "id": "a-headline",
  "description": "Headline component for page titles",
  "severity": "recommended",
  "check": { "type": "component", "component": "Headline" }
}
```

**Overlay trigger patterns:**
```json
{
  "id": "a-dialog-trigger",
  "description": "Dialog.Trigger for overlay pattern",
  "severity": "recommended",
  "check": { "type": "component", "component": "Dialog.Trigger" }
}
```

```json
{
  "id": "a-menu-trigger",
  "description": "Menu.Trigger for user dropdown",
  "severity": "recommended",
  "check": { "type": "component", "component": "Menu.Trigger" }
}
```

### Assertions to fix

**`a-table-header` and `a-table-body`** — Currently `recommended`, should be `required`. These are mandatory sub-components for Marigold Table to render correctly.

### Assertions to remove
None.

---

## P-03: Ticket Shop (Intent-driven)

### Confirmed-good assertions
- `a-import-marigold`, `a-has-button`, `a-has-form-input`, `a-has-layout-primitive`
- `a-uses-onpress`, `a-no-raw-input`, `a-no-raw-button`, `a-no-raw-select`, `a-no-raw-form`
- `a-price-indicator`
- `a-no-onclick-on-marigold`

### Assertions to add

**Headline for event name:**
```json
{
  "id": "a-has-headline",
  "description": "Headline for event name",
  "severity": "recommended",
  "check": { "type": "component", "component": "Headline" }
}
```

**Form component:**
```json
{
  "id": "a-has-form",
  "description": "Form component wrapping buyer info",
  "severity": "required",
  "check": { "type": "component", "component": "Form" }
}
```

**Sold-out state indicator:**
```json
{
  "id": "a-sold-out-state",
  "description": "Sold-out state indicated (disabled or badge)",
  "severity": "recommended",
  "check": {
    "type": "composite",
    "operator": "or",
    "checks": [
      { "type": "text-content", "pattern": "/sold.?out|unavailable|disabled/i" },
      { "type": "component", "component": "Badge" }
    ]
  }
}
```

### Assertions to fix

**`a-has-quantity-mechanism`** — Change from `recommended` to `required`. The prompt explicitly says "Let the customer select how many tickets they want per category."

**`a-has-feedback-mechanism`** — Change from `recommended` to `required`. The prompt says "After submission, show a confirmation or error state."

### Assertions to remove
None.

---

## Cross-cutting findings (from design-critique review)

1. **No assertions check component ordering/nesting depth** — layout quality is invisible to the current assertion engine. A flat dump of all components passes identically to a well-structured layout. This is a fundamental limitation of deterministic assertion checking.

2. **`required`/`isRequired` prop never asserted** — P-01 explicitly requires Name and Email to be required fields. Consider adding a `text-content` check for `/isRequired/` appearing at least once.

3. **Validation feedback unmeasurable** — P-01 says "Add basic form validation feedback" but no assertion covers this. A pragmatic check: assert presence of `isRequired` or `errorMessage` or `validationState` as text-content patterns.

4. **`a-has-feedback-mechanism` (P-03) is too lax** — The text-content fallback `/error|success|confirm/i` matches variable names and comments, not just user-facing feedback. Nearly any component will contain these words.

---

## Open questions for Sinan

1. **Severity policy**: Should the severity changes (recommended -> required for Table.Header/Body, quantity mechanism, feedback mechanism) be applied? This changes the scoring weight.
2. **Structural components for P-02**: Should we add checks for AppLayout/Sidebar/TopNavigation? The reference uses them, but they're very specific to one valid implementation approach. Other valid approaches exist.
3. **Weighted passRate (A39)**: The current unweighted approach means recommended assertions penalize equally. Should this be addressed in the validate package?

---

**Impact note**: Changing assertions invalidates all prior runs. After approval, benchmark.json must be regenerated via `pnpm tsx rescore.ts`.
