# `combinator.config.json` — the config contract

This is the seam between the **brain** (`design-options`, which audits a page and
generates grounded named options per dimension) and the **delivery** (the live in-browser
combinator dock). The serializer writes this file; the generator (`assets/combinator/gen.mjs`)
consumes it. Every field here is load-bearing — the generator and runtime read exactly these
names.

One rule governs the whole file: **everything is torn from the target page.** The current
token values, which sections exist, the real component selectors, and every option's concrete
value all come from the page's own `.design-options/audit.md`. Nothing is generic.

---

## Top-level shape

```jsonc
{
  "meta":       { … },     // page identity + generation inputs
  "categories": [ … ]      // the dimension catalog, grouped
}
```

---

## `meta`

Generation inputs and the page's audited identity. Read from `.design-options/audit.md`
(token inventory = block 2, section map = block 3, component inventory = block 4).

| field | type | source | purpose |
|---|---|---|---|
| `target` | string (repo/abs path or URL) | invocation | the page being combinated |
| `mode` | `"local"` \| `"remote"` | invocation | mirrors design-options; changes only staging + handoff |
| `brand` | string | audit identity / user | namespaces localStorage, dock title, copy. **Must be unique per page** or two pages on one origin collide |
| `currentTokens` | object | audit block 2 | the page's real token layer — see below |
| `componentSelectors` | object | audit block 4 | real selectors the M2 rules target — see below |
| `fontFamilies` | string[] | union of all font options | families to build the Google-Fonts `<link>` (weight 400) |
| `insertAnchors` | object | audit / defaults | where the generator injects into the page — see below |

### `meta.currentTokens`

```jsonc
"currentTokens": {
  "H":    "#2f5fe0",           // dominant brand hue (frequency-ranked palette top)
  "paper":"#fcfcfd",           // paper / ground
  "ink":  "#121316",           // ink
  "hasCustomProps": true,      // false → the page defines no CSS vars; a :root token
                               //          layer MUST be bootstrapped before M1 applies
                               //          (design-options apply.md fallback)
  "varNames": {                // the page's OWN custom-property names (NOT a generic guess).
                               // Keys are logical roles; values are the real vars to write.
    "accent":      "--cobalt-600",
    "paper":       "--surface",
    "ink":         "--ink-950",
    "headingFont": "--font-heading",
    "bodyFont":    "--font-body",
    "radius":      "--radius-card"
  }
}
```

- `H`/`paper`/`ink` are the instantiation basis: color/background formulas from design-options
  resolve against these to literal hex (the token serializer's job, U6).
- `varNames` maps a logical role → the page's actual variable. A token dim's `cssVars`
  (below) always uses these real names, never assumed ones. This is what prevents the
  token-name mismatch (writing `--accent` when the page actually defines `--cobalt-600`).
- `hasCustomProps:false` is a hard gate: the flow must inject a `:root` block and rewrite the
  frequency-ranked literals to `var()` before any live swap works.

### `meta.componentSelectors`

The real selectors, from audit block 4, that M2 (component) rules target. Roles are stable
keys; values are whatever the page actually uses (comma-joined when a role spans selectors).

```jsonc
"componentSelectors": {
  "button":  ".btn, .btn-primary",
  "cta":     ".btn-primary",
  "eyebrow": ".eyebrow",
  "list":    "ul.checks li",
  "divider": ".hairline-top, .hairline-bottom",
  "card":    ".section"        // when the page has no .card, the nearest real container
}
```

### `meta.insertAnchors`

Robust insertion points for the generator. Defaults are safe; override only when a page's
markup demands it. A missing anchor is a **hard error** (the generator must not emit a broken
page silently — the original combinator's failure mode).

```jsonc
"insertAnchors": {
  "headEnd": "</head>",                                  // fonts + dock.css + effect-CSS go before this
  "bodyEnd": "</body>",                                  // dock chrome + <script> data + dock.js go before this
  "cssLink": "<link rel=\"stylesheet\" href=\"styles.css\">"  // effect-CSS is injected AFTER the page's own sheet so it wins
}
```

---

## `categories[]`

The dimension catalog, grouped for the dock's accordion. Group order and dimension order are
preserved as shown (design-options emits dims in a semantic spectrum; order is information).

```jsonc
{
  "cat":  "Color & Theme",     // accordion header + lock-group unit
  "icon": "palette",           // Phosphor icon name for the header
  "dims": [ … ]                // dimension objects
}
```

---

## `dims[]` — a dimension

```jsonc
{
  "key":          "accent",          // stable identifier. Becomes html[data-accent],
                                     //   DEFAULTS.accent, state.accent, the serialize field.
                                     //   Unique across the whole config. MUST be lowercase
                                     //   kebab-case (/^[a-z][a-z0-9-]*$/) — it round-trips
                                     //   through dataset/HTML attrs/CSS selectors, which agree
                                     //   only for that form; a camelCase key silently no-ops.
                                     //   gen.mjs rejects non-conforming keys loudly.
  "label":        "Accent hue",      // human label in the dock
  "mechanism":    "token",           // "token" | "component" | "markup"  — routes payload + apply
  "multi":        false,             // true → options combine (space-joined value, CSS ~= match)
  "default":      "current",         // name of the no-op option that reproduces the live page
  "cssVars":      ["--cobalt-600"],  // (token only) the page's real var(s) this dim writes
  "target":       ".features",       // (markup only) the section selector whose DOM gets swapped
  "jumpSelector": ".hero .cta-row",  // one real element for the dock's "take me there"
  "options":      [ … ]              // option objects
}
```

**Which fields apply per `mechanism`:**

| mechanism | required extra | option payload | how it applies at runtime |
|---|---|---|---|
| `token` | `cssVars` | `vars` | generator emits `html[data-<key>="<opt>"]{ <var>:<value> … }`; runtime toggles the attribute |
| `component` | — | `css` | generator emits the option's `css` verbatim under `html[data-<key>="<opt>"]`; runtime toggles the attribute |
| `markup` | `target` | `html` (+ `rewire`) | generator registers the fragment; runtime **replaces `target`'s DOM** with it on toggle, then re-applies token/component state |

Invariants:
- The **first** option is always `current` — its payload reproduces the live page (so the dock
  opens visually identical to `index.html`).
- Exactly **one** payload per option, matching the dim's `mechanism`.
- `cssVars`, `target`, `componentSelectors`, `jumpSelector` are always the **page's own**
  selectors/vars (from the audit), never assumed.
- A dim only appears if the page has it: no pricing section → no pricing dim (audit block 3
  gates structural dims; block 4 gates component dims).

---

## `options[]` — an option

Common fields, then exactly one payload.

```jsonc
{
  "name":      "complement-pop",     // two-word name (dock button + serialize value)
  "rationale": "your accent #2f5fe0 sits alone → a chroma-matched pop reserved for CTAs",
                                     // grounded: cites a page fact by value (design-options discipline)

  // — exactly ONE of the following, per the dim's mechanism —

  "vars": { "--cobalt-600": "#e0662f" },              // token: role-var → concrete value

  "css":  ".btn, .btn-primary{ border-radius:0; background:transparent;\n              border:1px solid var(--ink-950) }",
                                                       // component: real declaration block,
                                                       //   scoped to the page's selectors,
                                                       //   using var() so it composes with M1

  "html": "<section class=\"features\"> … grounded variant markup … </section>",
                                                       // markup: the swap fragment, built from
                                                       //   the section's real copy/assets and
                                                       //   the page's own classes/vars

  "rewire": {                                          // markup only — how U5 re-inits after a swap
    "reveal": true,                                    // re-run scroll-reveal on the new nodes
    "ids":    ["#features"],                            // ids/anchors the fragment must preserve
    "hooks":  []                                        // JS hooks to rebind (empty = none)
  }
}
```

### Payload rules

- **`vars`** — keys are the page's real var names (from `meta.currentTokens.varNames` or a
  dim's `cssVars`); values are concrete (hex, font stack, `14px`, a ratio). Color/font values
  are the *instantiated* result of design-options formulas, not the formula text.
- **`css`** — a real CSS declaration block, scoped to `meta.componentSelectors`. Reference
  `var(--…)` for color/radius so a component option still recolors when an M1 token pick
  changes. The generator wraps it under the dim's `[data-key="name"]`; do not pre-wrap it.
- **`html`** — self-contained section markup using the page's own classes and token vars, so
  M1/M2 picks still apply after the swap. If a variant introduces a *new* class that needs its
  own token wiring, say so in the fragment's authoring notes (serializer flags it — U8).
- The `current` option's payload is the identity: `vars` = the page's current values, `css` =
  `""`, `html` = the section's original markup captured verbatim.

---

## Worked routing (what the generator does with each)

```
token  option "complement-pop"  vars {"--cobalt-600":"#e0662f"}
   →  html[data-accent="complement-pop"]{ --cobalt-600:#e0662f }        (effect-CSS)

component option "square-ghost"  css ".btn{border-radius:0;…}"
   →  html[data-buttons="square-ghost"] .btn{border-radius:0;…}          (effect-CSS)

markup option "editorial-rows"  html "<section class=features>…"
   →  variantRegistry["features"]["editorial-rows"] = "<section…>"       (swap registry)
```

At runtime, selecting an option sets `html[data-<key>="<name>"]` (token/component) or triggers
a DOM swap of `target` (markup). Combining dims = independent attribute writes + at most one
markup swap per section, with token/component state re-applied after any swap.

---

## Minimal valid config

```jsonc
{
  "meta": {
    "target": "example-site/index.html", "mode": "local", "brand": "example",
    "currentTokens": { "H":"#2f5fe0", "paper":"#fcfcfd", "ink":"#121316",
      "hasCustomProps": true, "varNames": { "accent":"--cobalt-600" } },
    "componentSelectors": { "button": ".btn" },
    "fontFamilies": [],
    "insertAnchors": { "headEnd":"</head>", "bodyEnd":"</body>",
                       "cssLink":"<link rel=\"stylesheet\" href=\"styles.css\">" }
  },
  "categories": [
    { "cat": "Color & Theme", "icon": "palette", "dims": [
      { "key":"accent", "label":"Accent hue", "mechanism":"token",
        "cssVars":["--cobalt-600"], "multi":false, "default":"current",
        "jumpSelector":".hero .cta-row",
        "options": [
          { "name":"current", "rationale":"page's own #2f5fe0", "vars":{ "--cobalt-600":"#2f5fe0" } }
        ] } ] }
  ]
}
```

See `assets/combinator/config.example.json` for a full fixture covering all three mechanisms.
