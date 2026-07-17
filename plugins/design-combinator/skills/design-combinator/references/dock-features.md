# `dock.js` — runtime UX contract

`dock.js` is the config-driven port of the earlier per-page combinator's `combinator.js`. It reads
everything from `window.CMB` (written by `combinator.data.js`, `gen.mjs`'s output) — no
catalog, defaults, brand copy, or namespace is hardcoded. This doc is the affordance-by-
affordance contract: what each control does, the wire formats, the postMessage protocol, and
the live markup-swap applier (`applyMarkup`, U5).

---

## Where the data comes from

```js
window.CMB = { meta, dims, defaults, multi, jump, variantRegistry };
```

- `meta` — `{ target, mode, brand, currentTokens, componentSelectors, fontFamilies, insertAnchors }`.
  Only `meta.brand` is read by the runtime (namespacing); the rest is generation-time-only and
  passes through untouched.
- `dims` — **flat** array (not grouped): `{ key, label, cat, icon, mechanism, cssVars, target,
  multi, default, jumpSelector, options:[{name, rationale}] }`. `dock.js` regroups it into
  category sections for the accordion, preserving first-seen category order (== the order
  `gen.mjs` emitted them in, which is `config.categories` order).
- `defaults` — `key -> default option name` (e.g. `"accent": "current"`).
- `multi` — `key -> true` for space-joined multi-select dims.
- `jump` — `key -> jumpSelector` (identical to each dim's own `jumpSelector` field, hoisted for
  convenience by `gen.mjs`).
- `variantRegistry` — `dim.key -> { optionName -> html }` for markup-mechanism dims, **excluding**
  the `current`/default option — its `html` payload in `combinator.config.json` is a placeholder
  (`gen.mjs` skips baking it in). The runtime captures the *real* `current` fragment itself, live,
  by reading `target`'s `outerHTML` at stage boot before any swap — see `applyMarkup` below.

`dock.js` never sees `vars`/`css`/`html` option payloads (the generator strips them down to
`{name, rationale}` when building `combinator.data.js` — the concrete values live only in
`combinator.effects.css` and `variantRegistry`). This mirrors the source engine: the JS layer
has always been value-agnostic, only ever writing `data-<key>="<value>"`.

---

## Runtime scaffolding (`ensureScaffold`)

`gen.mjs` injects only two empty stub elements before `</body>`:

```html
<div id="cmb-dock"></div>
<div id="cmb-fab"></div>
```

It does **not** wrap the target page's body content in a stage container, and does not create
an iframe host — that markup was hand-authored into the earlier per-page combinator's static
`combinator.html` and has no generic equivalent to inject per-page. `dock.js` builds it at
runtime, once, before branching on `?embed=1`:

1. Every existing `<body>` child that isn't `#cmb-dock`, `#cmb-fab`, or a `<script>` tag gets
   moved into a new `<div class="cmb-stage">`, inserted as the first body child. (`dock.css`
   keeps `.cmb-stage{display:none}` by default and `body.cmb-embed .cmb-stage{display:block}`
   — same class names as the source chrome, so this "just works" once dock.css ships.)
   Script tags are left as top-level siblings (already executed by the time `dock.js` runs, so
   moving them later has no effect — matches the source page's original DOM order pattern).
2. A `<div id="cmb-stage-host" data-vp="desktop">` is inserted right before `#cmb-dock` — the
   iframe host the normal-mode dock renders its stage `<iframe>` into.

This runs identically on both the top-level load and the `?embed=1` iframe load (same HTML
file, loaded twice) — normal mode needs the wrapper so `.cmb-stage{display:none}` hides the
duplicate inline content; embed mode needs it so `body.cmb-embed .cmb-stage{display:block}` can
show it.

`buildChrome()` (normal mode only) then fills `#cmb-dock`'s innerHTML with the header/actions/
viewport-toggle/snapshots shell, using the exact class names (`.cmb-head`, `.cmb-title`,
`.cmb-acts`, `.cmb-vps`, `.cmb-vp`, `.cmb-scroll`, `.cmb-snaps-wrap`, `.cmb-subh`, `#cmb-snaps`)
the source `combinator.css` chrome targets, and `#cmb-fab`'s innerHTML with its icon.

---

## postMessage protocol (dock ↔ stage)

Unchanged from the source engine — this is what lets the dock drive the stage over `file://`,
where cross-frame `contentDocument` writes are blocked.

**Dock → stage:**

| message | payload | effect |
|---|---|---|
| `{cmb:"cfg", cfg}` | full config object | `eApply(cfg)` in the stage |
| `{cmb:"identify", on}` | boolean | toggle the full-page region-pointer overlay |
| `{cmb:"peek", k, on}` | dim key + boolean | toggle a pointer at that one dim's element(s) |
| `{cmb:"flash", k}` | dim key | flash that dim's element once |
| `{cmb:"pick", on}` | boolean | toggle click-to-inspect mode in the stage |
| `{cmb:"scroll", k, sel}` | dim key + selector | scroll the stage to `sel` (or `JUMP[k]` if `sel` is falsy) and flash it |

**Stage → dock:**

| message | payload | effect |
|---|---|---|
| `{cmb:"ready"}` | — | stage iframe finished booting; dock re-pushes cfg + identify state |
| `{cmb:"picked", k}` | dim key | dock opens that dim's category, scrolls to it, flashes `.cmb-target` |

---

## Apply mechanism (`eApply`, stage-side)

`eApply` runs in two passes over every key in the config, in this order:

```js
// pass 1 — markup swaps, so the target's DOM (if this key is a markup dim)
// is fully replaced before pass 2 writes the current token/component state
KEYS.forEach(k => { if (mechanism[k] === "markup") applyMarkup(k, value); });

// pass 2 — token/component attribute writes, unchanged from U3
KEYS.forEach(k => {
  eroot.dataset[k] = value;               // attribute toggle — combinator.effects.css does the rest
  if (mechanism === "token" && cssVars.length) {
    if (isHexColor(value)) cssVars.forEach(cv => eroot.style.setProperty(cv, value));  // escape hatch
    else                    cssVars.forEach(cv => eroot.style.removeProperty(cv));
  }
});
```

Markup-first ordering matters for **combo-holds**: `html[data-key="value"] .sel{...}` (component)
and inherited custom properties (token) are CSS descendant/inheritance effects that apply to
*whatever* is under `<html>` at style-recalc time. Doing the swap in pass 1 guarantees the
freshly-inserted nodes are already in the DOM when pass 2 writes the latest `dataset`/`style`
state onto `<html>`, so a single synchronous `eApply` call always leaves the swapped section
carrying the current token/component picks — no separate re-apply step needed.

- **Token + component dims**: pure attribute write. The generator's `combinator.effects.css`
  has already emitted `html[data-key="value"]{ ... }` (token) or `html[data-key="value"] .sel{
  ... }` (component) rules; the browser's cascade does the visual work. Multi dims store a
  space-joined token string and the generated CSS matches with `~=` — `toggleToken()` maintains
  that string.
- **Custom-hex escape hatch (generalized)**: the source engine hardcoded a `--paper`
  `setProperty` path so a colour-wheel input could drive an arbitrary hex the generated CSS
  couldn't enumerate in advance. This port generalizes the *mechanism* (not a specific UI
  widget — see Known assumptions below): **any** token dim whose current value matches
  `/^#[0-9a-fA-F]{3,8}$/` gets that hex written directly via `style.setProperty()` on every var
  in its `cssVars`, bypassing the generated rules; a non-hex value clears the inline override so
  the generated CSS governs again. This keeps the code path alive for a future colour-picker
  control (or a hand-authored one, per `authoring.md`) without inventing new schema.
- **Markup dims**: `applyMarkup(key, optionName)` — see next section.

---

## `applyMarkup` — live section markup-swap (U5)

```js
function applyMarkup(key, optionName) {
  var d = DIM[key]; if (!d || !d.target) return;
  if (markupApplied[key] === optionName) return;           // already showing this option — no-op
  var isCurrent = optionName === DEFAULTS[key];
  var html = isCurrent ? markupOriginal[key]
                        : ((CMB.variantRegistry && CMB.variantRegistry[key]) || {})[optionName];
  if (html == null) return;                                 // unknown option — never throws
  var node = document.querySelector(d.target);
  if (!node) return;
  node.outerHTML = html;
  markupApplied[key] = optionName;
  var fresh = document.querySelector(d.target);              // old node reference is dead — relocate
  if (fresh) { reWireReveal(fresh); reWireHooks(fresh); }
}
```

### Capture, before any swap

`run()` calls `captureMarkupOriginals()` first, before the boot `eApply()`. For every
markup-mechanism dim it reads `document.querySelector(dim.target).outerHTML` **while the page is
still exactly what the server sent** and stores it in `markupOriginal[key]` — this is the real
`current` fragment (`combinator.data.js`'s own `current` payload is a placeholder; see "Where the
data comes from" above). `markupApplied[key]` seeds to `DEFAULTS[key]` at the same time, since the
DOM at that instant *is* showing the default option, verbatim.

### Swap / restore

- **Non-default option** → `node.outerHTML = variantRegistry[key][optionName]`.
- **`current`/default option** → `node.outerHTML = markupOriginal[key]` (the captured original) —
  this is how "restore" works; the fragment ships baked into `markupOriginal`, not the registry.
- **Re-selecting the currently-showing option** is a no-op (`markupApplied[key] === optionName`
  guard) — avoids a redundant destroy+recreate on every unrelated `eApply` call, since `eApply`
  re-invokes `applyMarkup()` for every markup dim on every config change, not just the one that
  changed.
- Every swap re-locates the element via `document.querySelector(dim.target)` **after** the
  replace — `outerHTML` assignment destroys the old node, so the prior reference is dead.

### Re-wire (`reWireReveal`, `reWireHooks`)

`combinator.data.js` only ever carries `{name, rationale}` per option — `gen.mjs` does not thread
an option's `rewire` metadata (`config-schema.md`: `reveal`/`ids`/`hooks`) through to
`window.CMB`. The runtime therefore can't branch on rewire fields; instead it runs two
unconditional, idempotent re-wire steps on every fresh swap, each a no-op when the fragment
doesn't need it:

- **`reWireReveal(root)`** — force-reveals `root` and any `[data-reveal]` descendants by adding
  both `is-visible` (the page's own reveal convention, e.g. an `IntersectionObserver`-driven
  class) and `in` (the class this runtime's own reduced-motion fallback, above, already uses) —
  the schema names neither convention, so both are set defensively. Needed because `outerHTML`
  replacement makes brand-new nodes; the page's own reveal observer already fired-and-unobserved
  the *old* node and will never
  see the new one scroll into view, so without this step a variant that introduces `[data-reveal]`
  (or reuses a `[data-reveal]` target section) would render permanently at `opacity:0`.
- **`reWireHooks(root)`** — rebinds the one interactive hook this stage knows about, FAQ-toggle
  clicks (`bindFaq`, shared with `embedSetup()`'s initial global bind), scoped to `root` only.
  Safe to call on every swap: `outerHTML` replacement always yields brand-new nodes, so a scoped
  rebind can never double-bind a listener onto a node that already has one.
- Preserving `rewire.ids`/anchors is the **serializer's** job (U8) — the swapped-in `html` string
  is expected to already carry whatever ids/anchors it needs baked in; the runtime does not
  inject or rewrite ids at swap time (there's no rewire data at runtime to act on).

### Combo-holds (token/component picks surviving a swap)

No extra JS is needed to re-apply token/component state to swapped-in nodes — `html[data-key=
value] .sel{...}` (component) and custom-property inheritance (token) are both live CSS
mechanisms that apply to whatever is currently under `<html>`, including nodes inserted after the
attribute/style was set. What *does* matter is **within-`eApply` ordering**: markup swaps run in
pass 1, token/component dataset writes in pass 2 (see "Apply mechanism" above), so a single
`eApply(cfg)` call — whether from the boot `run()`, a `{cmb:"cfg"}` postMessage, or a
`hashchange` — always leaves the swapped section carrying the *current* config's token/component
picks, never a stale pass.

### Serialization (unchanged from U3, still holds)

The selection **is recorded** exactly like any other dim — `state[key]`/`cfg[key]` holds the
option name, so it flows through `data-<key>` attribute writes, snapshots, URL-hash persistence,
and `randomize()`/`reset()` for free (`randomize()` and the snapshot/compare/URL-hash paths are
mechanism-agnostic; they only ever read `d.options` names and `state`/`cfg` values). `copyCfg()`
gets one addition: for every non-default **markup** pick it appends a human-readable comment line
after the `data-*` string —

```
data-hero="centered-stack"
/* section hero: variant "centered-stack" (swap markup) */
```

— since a bare `data-hero="centered-stack"` attribute doesn't itself carry which markup was
swapped in (that lives in `variantRegistry`, not on the element), the comment makes the paste-ready
output self-describing.

---

## Dock UX affordances

- **Accordion** — one `<section class="cmb-cat">` per config category (first category starts
  open), each with a lock-category toggle in the header and a `.cmb-grp` per dim inside.
- **Per-dim controls** — label, a "take me there" crosshair button (`{cmb:"scroll"}` to
  `JUMP[key]`), a current-value `<code>`, a per-dim lock toggle, and one `.cmb-opt` button per
  option (button text = `option.name` with hyphens turned to spaces; `title` = `option.rationale`
  when present — the grounding text design-options attaches to each option).
- **Randomize (R)** — picks a random option per unlocked dim (space-joined subset for multi
  dims); locked dims are skipped entirely; if every dim is locked, no-ops with a toast ("All
  locked — nothing to randomize").
- **Reset (0)** — `applyAll(DEFAULTS)`, i.e. every dim back to its config `default` option name.
- **Copy config** — `KEYS.filter(k => getVal(k) !== DEFAULTS[k]).map(k => 'data-'+k+'="'+v+'"')
  .join(" ")`, written to a throwaway `<textarea>` + `execCommand("copy")`. All-defaults yields
  the literal string `"(all defaults)"`.
- **Snapshots (Save / Load / Compare / rename / delete)** — `{name, cfg, locks}` objects in an
  array under localStorage key `<brand>.combinator.snaps`. Load restores both `cfg` and `locks`;
  a legacy snapshot with no `locks` field loads with locks cleared (`(s.locks||[])`).
- **Per-dim + per-category + lock-all** — `locks` is a `key -> true` map, persisted separately
  under `<brand>.combinator.locks` (and mirrored into the URL hash as `&lock=k1,k2,...` when
  non-empty) — randomize-scope only, doesn't block manual picks.
- **URL-hash mirror** — `#cfg=<pipe-serialized-cfg>&lock=<csv-of-locked-keys>`, rewritten on
  every `persist()`. `serialize`/`deserialize` are unchanged from the source engine
  (`key:value` pairs joined with `|`).
- **Viewport toggle (Desktop/Tablet/Phone → 360/768/1440-ish widths)** — sets
  `#cmb-stage-host[data-vp]`; `dock.css` (a parallel unit) does the actual width/scaling.
- **Compare (A/B)** — opens a full-screen overlay with two `.cmb-frame`-styled iframes, each
  `?embed=1#cfg=<serialize(cfg)>` — one for the live current config, one for the snapshot.
- **Identify (L) / Peek / Inspect (P) / Flash** — all delegated to the stage over postMessage;
  see "Known assumptions" for how region/target selectors are derived without a hardcoded
  region map.
- **FAB (`#cmb-fab`)** — toggles `body.cmb-dock-hidden`, which `dock.css` uses to slide the dock
  out and reveal the FAB (and vice versa via the in-dock hide button and the `\` key).
- **Keyboard shortcuts** — `L` identify, `P` inspect, `R` randomize, `\` toggle dock, `0` reset
  (ignored while focus is in an `<input>`/`<textarea>`).

---

## Known assumptions / generalizations (schema is silent on these)

The config schema (`config-schema.md`) doesn't give the runtime everything the source engine's
hand-authored `EREG`/`DETECT`/`JUMP` maps had, since those were curated per-page. This port
makes the following explicit, defensible substitutions:

1. **`EREG` (Identify overlay regions)** — built from each dim's `target` (markup dims) or
   `jumpSelector` (token/component dims), deduped by selector. This produces roughly one region
   per dim rather than the source's hand-picked ~17 section regions, but every pointer still
   lands on a real, page-specific element.
2. **`DETECT` (click-to-inspect → dock control)** — same selector source as above, sorted
   longest-selector-first as a specific-before-general heuristic (the source engine's DETECT
   list was hand-ordered the same way). `closest()` walks up from the clicked node and the first
   matching selector in that order wins.
3. **Peek/flash granularity** — for token/component dims (no `target` in the flat schema, only a
   single `jumpSelector` anchor), peek/flash highlight just that one anchor element rather than
   every element the dim's generated CSS touches. Markup dims use their real `target` (the whole
   swapped section), so this is unaffected there.
4. **Dropped: per-option font-family preview on typography buttons.** The source engine inlined
   a hardcoded `value -> CSS font stack` map to style each font option button in its own
   typeface. The runtime has no access to concrete option values (only `{name, rationale}`), so
   this per-page-specific preview isn't reproducible generically and was dropped rather than
   faked.
5. **Dropped: the dedicated background colour-wheel widget.** The source engine special-cased
   `d.k === "paper"` to render a `<input type="color">` next to that one dim. Per the plan's
   Scope Boundaries, generalizing a continuous-input UI across arbitrary dims is explicitly
   deferred — this port keeps the underlying *escape-hatch mechanism* (see custom-hex above) but
   doesn't add a picker widget, since the schema carries no signal for "this token dim is a
   colour" beyond `cssVars` presence.
