# serialize-structural.md — M3: structural variant → swap fragment + rewire metadata

Turns design-options' generated structural variants (morphology/transitions/composition
families, built as real HTML in `.design-options/variants/*.html`) into the `markup`-mechanism
dims + options `config-schema.md` defines. One dim per morphable section the user picked;
one option per generated variant, plus the mandatory `current` placeholder. This is packaging,
not authoring — every fact, every class, every asset in the output already exists on the real
page or in design-options' own generated markup. Voice and grounding discipline follow
design-options `references/option-writing.md`.

---

## Inputs

- `.design-options/audit.md` block 3 — the section map: which sections exist, family,
  confidence, morphable yes/no, item counts, boundary style. Gates WHICH sections are even
  eligible; does not itself carry a CSS selector (see Step 2).
- `.design-options/variants/*.html` — the real generated variant pages for each structural dim
  the user picked (`preview.md` §variants). If a picked dim has no variant files staged yet,
  run that recipe first — this serializer packages what design-options generated, it does not
  generate variants itself.
- The target page's own markup (local: the source HTML; remote: the staged `page.html` from
  `audit.md` §remote-fetch) — needed to resolve each section's real selector and to verify a
  variant's root element still carries it (Step 2).
- `meta.currentTokens.varNames` and `meta.componentSelectors` (already populated by the M1/M2
  serializers, or read straight from `audit.md` blocks 2/4) — every `var()` reference and every
  reused component class in a variant's markup must match these, not invented names.

---

## Scope — which dims this covers

**Morphology families (the main case).** Each of the 13 morphable families in
`catalog/morphology.md` is a single section with a single natural selector — this is the clean
1:1 case: one dim, `target` = that section, options = `current` + each generated variant. The
rest of this file is written against this case; the worked example (below) is one.

**Transitions (Y1) and composition (Z1/Z2) — narrower fit, call stated.** `catalog/
transitions.md`'s Y1 varies a *boundary* (bottom of section A + top of section B), and
`catalog/composition.md`'s Z1/Z2 vary page-level or ranged alignment/grid, not one section.
Neither maps onto a single-section `target` the way morphology does. Resolve `target` as:
- **Y1** — the nearest shared ancestor that contains exactly sections A and B and nothing else
  as a direct child (common when sections are flat siblings under `<body>`/`<main>`); the `html`
  payload replaces that wrapper's full content (both sections, boundary treatment applied).
  When no such clean wrapper exists (other siblings would get swept into the swap), do not force
  it — leave the dim for the hand-author residue path (`authoring.md`, U9) instead of shipping a
  swap with collateral scope.
- **Z1/Z2** — `target` is the page's outer content wrapper, or (per composition.md's "may be
  scoped to a range of sections") the shared wrapper of that range. These fragments are large by
  nature; still built from the same `current`-placeholder + generated-variant packaging below.
  If composition.md's own catalog note flags an option as pure alignment (no markup change,
  e.g. `text-align`/`margin` only), route it to M2 (`serialize-components.md`) instead — it
  doesn't need a DOM swap at all. Only route a composition option through M3 when it actually
  changes wrapper/grid markup, not just position.

This narrower fit is a real gap between the config schema (built for one-section swaps) and
the transitions/composition catalogs (built for boundary/page scope) — flagged here rather than
silently forced. The worked example and the rest of this file cover the morphology case, which
is the common one.

---

## Procedure

### 1. Confirm the variant files exist

For each structural dim the user picked, check `.design-options/variants/` for that section's
generated `vN.html` files. If missing, invoke design-options' `preview.md` §variants recipe for
that section first (this is the "trigger" step — the plan's U8 approach note). Never fabricate
variant markup from the catalog's prose recipe; only package what was actually generated as
real HTML.

### 2. Resolve `target` — the section's real selector

`audit.md` block 3 identifies WHICH section (heading text, family, position, boundary style) —
it does not hand you a CSS selector. Resolve one by reading the section's real opening tag in
the target markup (or the staged `page.html` for a remote target):

- Prefer an existing `id` (`#features`).
- Else the section's own semantic class (`.features`, `.pricing`) — whatever the page already
  uses, never an invented name.
- Only fall back to a positional selector (`main > section:nth-of-type(3)`) when the section
  carries neither — sibling count is stable across a same-section swap, so this remains valid,
  but prefer a real attribute whenever one exists.

**This selector must survive the swap.** The runtime re-locates the element via
`document.querySelector(dim.target)` *after every* `outerHTML` replacement (`dock-features.md`
§`applyMarkup`) — if the variant's root element doesn't carry whatever `target` matches on, the
re-locate returns null and the dim silently stops responding to further picks. Concretely: if
`target` is `#features`, every variant's root element keeps `id="features"`; if `target` is
`.features`, every variant's root element keeps `class="...features..."`. Verify this for
`current` too, even though its `html` is a placeholder (Step 3) — the *live* DOM node the
runtime captures at boot already carries it by definition.

### 3. Emit `current` first — the placeholder, not the real markup

`current` is always the first option. Its `html` field is a **marker string**, not the section's
actual original markup — do not paste the real original in. The runtime captures the true
original itself, live, via `document.querySelector(target).outerHTML` at page boot, before any
swap (`dock-features.md` §"Capture, before any swap"); `gen.mjs` deliberately skips baking the
`current` option's `html` into the variant registry it hands the runtime. Use the same
convention as the U1 fixture (`assets/combinator/config.example.json`):

```jsonc
{ "name": "current", "rationale": "the page's own <N-item description>, captured verbatim at generate time",
  "html": "<!-- ORIGINAL <selector> outerHTML captured by the generator at build time -->",
  "rewire": { "reveal": true, "ids": [], "hooks": [] } }
```

`config-schema.md`'s line "the `current` option's payload is the identity ... `html` = the
section's original markup captured verbatim" describes what the runtime's captured value
*represents*, not what the serializer should write into the config file — write the placeholder
per the convention above; state this in the config's own `rationale` line if it would otherwise
read as a contradiction to a future reader.

### 4. Extract each generated variant's `html` payload

Each `vN.html` is a full preview page (page's real stylesheet linked, body classes carried,
the restructured section, a `.dov-vN`-scoped override block, plus a force-reveal block —
`preview.md` §variants). Extract only what belongs in production:

1. Locate the restructured section node inside `vN.html`. Confirm it still carries the real
   copy/assets verbatim (morphology.md's per-family rule) and the target-matching id/class from
   Step 2 — add it back onto the variant's root element if the preview build dropped it.
2. Pull the `.dov-vN`-scoped `<style>` block out of `vN.html` and rewrite its scoping prefix from
   `.dov-vN` to the real `target` selector (same 1:1 substitution `apply.md` §structural does
   when porting this same block into the page's stylesheet — here it lands inside the fragment
   instead, see Step 6). Skip this step entirely when the variant needs no rules beyond classes
   the page's stylesheet already defines — the common, preferred case.
3. **Drop the force-reveal override block.** `preview.md` injects
   `[data-reveal],[data-animate],.reveal{opacity:1!important;...}` into every variant page so
   comparison iframes render without waiting on scroll — that override exists only for the
   preview page. Carrying it into the production `html` payload would permanently disable
   reveal-gating on the live section. Never copy it forward.
4. Assemble the final `html` string: the section's opening tag (real selector intact) + the
   restructured content +, only if Step 2's extraction produced one, a nested `<style>` element
   as its last child. A `<style>` tag inserted via `outerHTML`/`innerHTML` assignment is parsed
   and applied normally by the browser — unlike `<script>`, which the runtime never relies on
   here; JS-bound behavior is handled by `rewire.hooks` + `dock.js`'s re-wire step (Step 5), not
   by shipping inline scripts.

### 5. Derive `rewire` metadata

Walk `apply.md`'s re-wire checklist per variant and translate each item into the matching
schema field:

| checklist item (`apply.md` §structural) | schema field | what to write |
|---|---|---|
| reveal/`data-*` attributes carried onto the new markup | `reveal` | `true` if the variant (or the section family generally) is reveal-gated; the runtime force-reveals unconditionally on every swap regardless (`dock-features.md` §`reWireReveal`), so this is documentation of intent more than a runtime switch — still set it honestly. |
| ids/anchors referenced by nav or in-page links still resolve | `ids` | every id/anchor the *original* section exposed that something else on the page points at (nav `href="#features"`, a skip-link, another section's cross-reference) — **not just `target`'s own id**. |
| JS hooks still bind | `hooks` | short identifiers for JS-bound behavior the section's original markup carried (e.g. `"faq-toggle"`) — found by grepping the page's JS for selectors touching this section, per the audit's component inventory (block 4). Empty for families with no JS-bound behavior (hero, card-grid, stats, most families) — non-empty mainly for `faq` (accordion toggle), which is why `dock.js`'s one real hook implementation is FAQ-specific. |
| responsive breakpoints (≤768px) | — (no dedicated field) | the variant's own ≤768px behavior must already be inside the `html`/`<style>` payload (morphology.md requires every option to ship it) — there's nothing separate to record, just confirm it's present before packaging. |

**`ids` and `hooks` are not cosmetic.** `dock.js` never threads an option's `rewire` metadata
into `window.CMB` — `combinator.data.js` carries only `{name, rationale}` per option
(`dock-features.md` §"Where the data comes from"). The runtime's re-wire step is unconditional
and generic; it does not read `rewire.ids` or `rewire.hooks` at swap time. **Preserving an id or
anchor a swap must not break is entirely on the `html` string itself** — if `rewire.ids` lists
`"#features"`, the packaged `html` must literally contain `id="features"` somewhere in it, or the
metadata is a lie the runtime can't make true.

### 6. Combo-holds — reuse first, wire second, flag what's left

Every variant's markup must keep working under whatever M1 (token) and M2 (component) pick is
currently active, because the runtime always re-applies token/component state after a markup
swap (`dock-features.md` §"Combo-holds" — pass 1 swaps DOM, pass 2 writes the current
`data-*`/`vars` state onto `<html>`, every `eApply` call). That only produces a visible effect if
the swapped-in nodes are *targetable* by the existing rules:

1. **Reuse page classes first.** Design-options' own generation rule already helps here —
   morphology.md variants are built from the section's real copy/assets, so reuse its real
   component classes too: give a new CTA the page's real button class (`meta.componentSelectors
   .button`), a new divider the page's real divider class, etc. A variant built entirely from
   existing classes needs no flag and no inline `<style>` at all — this is the default target,
   not a nice-to-have.
2. **When a variant genuinely needs a new class** (e.g. a big numeral treatment `editorial-rows`
   introduces that nothing on the page already styles), wire its color/radius/spacing to the
   page's real token vars (`var(--ink-950)`, `var(--radius-card)`, …) inside the Step 4 `<style>`
   block — so an M1 accent/paper pick still recolors it after the swap.
3. **Flag what isn't wired.** If a new class can't reasonably reference a token var (its value is
   genuinely fixed, or the mapping is ambiguous), do not silently ship it — append a bracketed
   flag to the option's `rationale`, grep-able by the residue path:
   `[new: .row-num, NOT token-wired — see authoring.md]`. When it IS wired, say so the same way:
   `[new: .row-num, wired to var(--ink-950)]`. This is the note `authoring.md` (U9) picks up;
   there is no separate schema field for it — `rationale` is prose, and this is where design-
   options' own grounding discipline (cite the real fact) already lives.

---

## Output shape

One dim per morphable section picked, always non-`multi` (a section shows exactly one layout at
a time — combining two full-section swaps isn't representable), `default` always `"current"`:

```jsonc
{
  "key": "features", "label": "Features section", "mechanism": "markup",
  "target": ".features", "multi": false, "default": "current",
  "jumpSelector": ".features",
  "options": [
    { "name": "current", "rationale": "…", "html": "<!-- ORIGINAL … -->", "rewire": {"reveal":true,"ids":[],"hooks":[]} },
    { "name": "<variant-name>", "rationale": "…", "html": "<section …>…</section>", "rewire": {"reveal":true,"ids":[…],"hooks":[…]} }
  ]
}
```

Exactly the `markup` row of `config-schema.md`'s dim/option tables — nothing added, nothing
dropped.

---

## Worked example — features: cards → editorial-rows

The example fixture's identity (same as `assets/combinator/config.example.json`): accent
`--cobalt-600 #2f5fe0`, ink `--ink-950 #121316`, radius `--radius-card 14px`, dividers
`.hairline-top`/`.hairline-bottom`, buttons `.btn, .btn-primary`. Audit block 3: "Features —
family: card-grid — confidence: high — morphable: yes — 3 items, ~28 words each, icon + heading
+ body — boundary: hairline-bottom" and the section has `id="features"` (nav links to
`#features`). `.design-options/variants/features-v2.html` holds the generated `editorial-rows`
option (morphology.md's card-grid recipe: "full-width stacked rows, big numerals, hairline
separators, generous air").

```jsonc
{
  "name": "editorial-rows",
  "rationale": "3 feature cards × ~28 words in a 3-col grid -> full-width numbered rows give each item room to read as a claim, not a tile [new: .row-num, wired to var(--ink-950)]",
  "html": "<section id=\"features\" class=\"features features--rows\"><div class=\"container\"><article class=\"row-feature\"><span class=\"row-num\" style=\"font-family:var(--font-heading);color:var(--ink-950)\">01</span><h3 style=\"font-family:var(--font-heading)\">Answers every call</h3><p>Example picks up in two rings, day or night, in your business's own voice — no hold music, no voicemail.</p></article><hr class=\"hairline-top\"><article class=\"row-feature\"><span class=\"row-num\" style=\"font-family:var(--font-heading);color:var(--ink-950)\">02</span><h3 style=\"font-family:var(--font-heading)\">Books appointments</h3><p>Checks your real calendar and confirms a slot on the call — nothing double-books, nothing waits for Monday.</p></article><hr class=\"hairline-top\"><article class=\"row-feature\"><span class=\"row-num\" style=\"font-family:var(--font-heading);color:var(--ink-950)\">03</span><h3 style=\"font-family:var(--font-heading)\">Follows up automatically</h3><p>Missed calls get a text back inside a minute, so no lead goes cold waiting on a callback.</p></article><style>.features--rows .row-num{font-size:2.5rem;line-height:1;display:block;margin-bottom:.5rem}.features--rows .row-feature{padding-block:2rem}</style></div></section>",
  "rewire": { "reveal": true, "ids": ["#features"], "hooks": [] }
}
```

Notes on this example:
- `id="features"` is preserved on the new root — `target` (`#features` or `.features`,
  whichever the audit resolved) still matches after the swap.
- Reuses the page's real `.hairline-top` divider class and real `--font-heading`/`--ink-950`
  vars — no new tokens invented, so an M1 accent/ink pick still recolors the numerals and an M2
  divider pick still restyles the rules.
- The one genuinely new class, `.row-num`, gets its layout-only rule in a nested `<style>`
  scoped under `.features--rows` (not bare `.row-num`, to avoid leaking page-wide) and is
  flagged + confirmed wired in `rationale`, per Step 6.
- `rewire.ids` carries `#features` because the nav references it; `rewire.hooks` is empty — a
  card-grid section has no JS-bound behavior to preserve.

---

## Pre-move-on checklist

- [ ] `current` is the first option, and its `html` is the placeholder marker — not real markup.
- [ ] `target` is a real selector read off the page, and every option's root element (including
      the variant's) carries whatever `target` matches on.
- [ ] Every variant's `html` reuses the page's real copy, assets, and classes/vars — no invented
      brand values.
- [ ] The preview-only force-reveal override block is stripped out of every packaged `html`.
- [ ] Any new class introduced is either token-wired (`var(...)`) or explicitly flagged
      unwired in `rationale`, per Step 6 — never shipped silently unwired.
- [ ] `rewire.ids` lists every anchor something else on the page points at, and each one is
      literally present in the `html` string — not just named in the metadata.
- [ ] `rewire.hooks` reflects a real check against the page's JS (audit block 4), not a guess.
- [ ] Dim is `multi: false`, `default: "current"`.
