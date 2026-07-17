# serialize-components.md — M2 component serializer

Turns design-options' component-catalog options (K1–K5 in `catalog/components.md`, plus the
selector-scoped dims in `catalog/shape-depth.md`) into the `mechanism:"component"` dims of
`combinator.config.json`. Runs after design-options has audited the page and printed its menu
(`.design-options/audit.md`, blocks 2/4/5) — this procedure never audits, never invents a
recipe, and never picks an option; it translates what design-options already grounded into a
real, selector-scoped `css` payload. Companion to `serialize-tokens.md` (M1, single-var swaps)
and `serialize-structural.md` (M3, markup swaps) — see the token/component boundary below
before assuming a dim belongs here.

---

## Inputs

- `.design-options/audit.md` **block 4** (component inventory) — the page's real selectors for
  buttons, links/CTAs, eyebrows/badges, list markers, dividers, and the nearest real container
  when there's no `.card`. This is the *only* source of selectors — never write one that isn't
  here.
- `.design-options/audit.md` **block 2** (token inventory) — `varNames` for ink/accent/paper/
  radius/etc., needed to write `var(--…)` instead of a re-typed literal.
- `.design-options/audit.md` **block 5** (the numbered menu) — the already page-grounded option
  lines for every K1–K5 / S2–S4 dim: name, one-line recipe, rationale citing an audit fact by
  value (`option-writing.md`'s contract). This is what gets translated, not re-derived.
- `catalog/components.md` and `catalog/shape-depth.md` — fall back to these only when a menu
  line is too compressed (≤160 chars) to fully specify a property; the catalog entry gives the
  full recipe the menu line was generated from.

---

## Scope — the token/component boundary

Not every catalog dim is `mechanism:"component"`. The catalogs' own `Apply:` line is the test:

- **"redefine the … token(s)"** → the option is a single CSS-var swap → `mechanism:"token"`,
  `serialize-tokens.md`'s job, not this doc's. S1 corner-radius is the default example: most of
  its options (`knife-edge`, `desk-round`, `soft-round`, …) swap one `--radius-*` var uniformly.
- **"rewrite the … selectors"** → the option needs declarations on one or more real selectors →
  `mechanism:"component"` → this doc.

K1–K5 (`components.md`) are component by default — none of them reduce to one var; K1 alone
touches a button rule and an input rule, K2 touches a link rule and a CTA rule. S2 elevation and
S3 borders are the ambiguous pair: their `Apply:` lines offer *both* paths ("redefine the shadow
token(s) **or** rewrite box-shadow on the … selectors"). Default them to component here unless
the audited page already exposes a single matching var (e.g. one `--shadow-2` every card/button
shares) **and** the option is a clean swap of that one var end to end — in that case it's really
an M1 pick and belongs in `serialize-tokens.md` instead. S4 edge-details has no token path; it's
always component. Four S1 options (`capsule-controls`, `size-scaled`, `arc-top`, `lens-round`)
are the mirror case going the other way — the catalog itself flags them as touching "several
selectors, not one var," so treat those four as component even though S1 as a whole is token.

When in doubt, ask: *does this option's whole effect collapse to one `--var: newValue`, applied
everywhere that var is already used?* Yes → token. No (multiple selectors, or a property the
page has no var for) → component, this doc.

---

## Role mapping

Resolve each in-scope dim to the `meta.componentSelectors` role(s) it needs, from audit block 4.
Never fall back to a bare tag or class the audit didn't name.

| catalog dim | role(s) | note |
|---|---|---|
| K1 buttons-and-inputs | `button` (+ an input/control role, only if the audit separately inventoried one) | recipe has two halves — see below |
| K2 links-and-ctas | `cta`, and `link` if the audit named body links separately | recipe may touch both in one payload |
| K3 labels-and-eyebrows | `eyebrow` | — |
| K4 lists-and-markers | `list` | — |
| K5 dividers | `divider` | — |
| S2 elevation / S3 borders / S4 edge-details | `card`, or the audit's nearest real container when there's no `.card` (config-schema's fallback rule) | — |

**K1's input half is conditional.** `components.md` defines K1 as "the button AND its matching
input treatment," but audit block 4 as documented only inventories buttons, links, eyebrows,
list markers, and dividers — no input role by default. If the audit didn't separately capture
the page's current input styling, there's no audited fact to cite for what's changing, so drop
the input half of the recipe and scope the option to the button role alone; note the input
pairing as residue for the hand-author path (`authoring.md`, U9). If the audit *did* capture a
form-control role (some pages warrant it), ground both halves and emit two rule blocks in one
`css` payload.

A dim's `css` payload can hold more than one rule block. `.btn, .btn-primary{…} input, select,
textarea{…}` in one string is correct for K1; the generator nests the whole string under
`html[data-key="opt"]{ … }` and CSS nesting flattens every inner selector, so multiple rules in
one payload cost nothing extra.

---

## Procedure

1. **Walk the menu.** For every dim in `.design-options/audit.md` block 5 sourced from an
   in-scope catalog entry (per the boundary above), start a `mechanism:"component"` dim.
2. **Resolve selectors.** Look up the role(s) from the table above in `meta.componentSelectors`.
   If a needed role is missing from `meta.componentSelectors` entirely, the audit found no such
   component on the page — per config-schema's dim-gating invariant the dim shouldn't have been
   generated at all; treat this as a hard stop, not a guess.
3. **Emit `current` first, empty `css`.** Per config-schema's payload rules, the identity option
   is always `{ "name": "current", "rationale": "<the page's own X, unchanged>", "css": "" }` —
   an empty string, never the page's literal CSS re-typed. The page's own stylesheet already
   renders it; nothing needs overriding. Write the rationale as the same audit fact every
   sibling option's rationale already opens with (option-writing.md's contract), reworded as a
   plain statement of the current state.
4. **Translate each remaining option's recipe into declarations**, one property at a time. Only
   write the properties the recipe actually states — no incidental resets, no unrelated
   properties "while we're in there."
5. **Decide `var()` vs literal per property (compose-with-M1):**
   - The property echoes a role the page already tokenizes (ink, accent, paper, an existing
     radius/shadow var) and the option is *reusing* that role's current value → `var(--…)`,
     using the real name from `meta.currentTokens.varNames`. This is what keeps a component
     option recoloring correctly when a later M1 pick changes the underlying var.
   - The property's value *is* the option's point — a radius forced to `0` when nothing on the
     page tokenizes "zero," a background forced to `transparent`, a wholly new multi-layer
     shadow recipe with no existing var to reuse — → a literal. Hardcoding here isn't a
     shortcut, it's correct: there's no page var for "this specific new value" to defer to.
   - Prefer `color-mix(in srgb, var(--accent-var) N%, transparent)` over a hand-computed rgba
     equivalent whenever a recipe tints something (a shadow, a wash) with the page's accent —
     the rgba literal looks identical today but silently desyncs the moment an M1 accent pick
     changes the var. See the worked example below for exactly this trade-off.
6. **`jumpSelector`.** Point it at one concrete instance of the resolved selector inside a real
   section from the audit's section map (block 3) — e.g. `.hero .btn-primary`, not the bare
   comma-joined role selector, which may match many places on the page.
7. **Multi dims get no special treatment here.** `multi:true` (config-schema: options combine
   as a space-joined value, matched at runtime with CSS `~=`) is entirely a generator/runtime
   concern. Write each option's `css` independently, scoped to only what that option touches —
   never merge two options' declarations into one block anticipating that they might be picked
   together.

Ignore any catalog `Apply:` instruction to add a "modifier class so only chosen blocks carry
it" (S4's note, for instance) — that's design-options' own in-place-edit apply path. The
combinator already scopes every option globally through its `data-<key>="<name>"` attribute; no
separate modifier class is needed or written here.

---

## Worked example

The example page. Audit block 4 gives `componentSelectors.button = ".btn,
.btn-primary"`; block 2 gives `varNames.ink = "--ink-950"` and `varNames.accent =
"--cobalt-600"`. The menu (block 5) printed, among the K1 buttons-and-inputs set:

> `12. square-ghost — your .btn-primary is a filled cobalt pill → hollow square, ink-bordered
> (wins for an editorial, technical CTA register)`

**Resolve.** Role `button` → `.btn, .btn-primary`.

**Translate, property by property:**
- "hollow" (drop the fill) → `background:transparent` — the recipe's whole point; no page var
  means "no fill," so literal.
- "square" (drop the pill radius) → `border-radius:0` — a genuinely new value; the page's
  `--radius-pill`/`--radius-card` vars mean something else, so literal, not a var reference.
- "ink-bordered" → the border reuses the page's own ink, a role the page already tokenizes →
  `border:1px solid var(--ink-950)`.
- Label color, now that the fill is gone, needs to read against the page's ground → same ink
  role → `color:var(--ink-950)`.

**Assembled:**

```json
{
  "name": "square-ghost",
  "rationale": "your .btn-primary is a filled pill → hollow square, ink-bordered variant",
  "css": ".btn, .btn-primary{ border-radius:0; background:transparent; color:var(--ink-950); border:1px solid var(--ink-950) }"
}
```

**A second option on the same dim, to show the var-vs-literal call the other way.** The menu
also printed a `soft-lift` option: "keep the fill, add a tinted cast so CTAs float off the
near-white ground." This is a shadow, tinted by the page's accent — a role the page tokenizes —
so per step 5 it should defer to `var(--cobalt-600)`, not a hand-typed rgba equivalent of it:

```json
{
  "name": "soft-lift",
  "rationale": "keep the fill but add a tinted cast so CTAs float off the near-white ground",
  "css": ".btn, .btn-primary{ box-shadow:0 1px 2px rgba(18,19,22,.06), 0 8px 24px color-mix(in srgb, var(--cobalt-600) 18%, transparent) }"
}
```

(The ink-tinted first layer stays a plain low-opacity rgba — ink isn't the thing being varied
here and the page has no `--ink-950-at-6%` var to defer to; only the accent-tinted layer gets
`color-mix()`. If you see a hardcoded `rgba(47,95,224,.18)` for this same recipe elsewhere —
`47,95,224` is `#2f5fe0`, i.e. `--cobalt-600` re-typed as rgb — that's the literal this rule
exists to avoid: it renders identically today but stops moving with the accent the moment an M1
pick changes it.)

---

## Output shape

Exactly the `component`-mechanism fields from `config-schema.md` — nothing borrowed from the
other two mechanisms:

```jsonc
{
  "key": "buttons", "label": "Button language", "mechanism": "component",
  "multi": false, "default": "current", "jumpSelector": ".hero .btn-primary",
  "options": [
    { "name": "current", "rationale": "the page's own filled cobalt button", "css": "" },
    { "name": "square-ghost", "rationale": "…", "css": ".btn, .btn-primary{ … }" }
  ]
}
```

No `cssVars` (token-only), no `target` (markup-only), no `rewire` (markup-only). Every option
carries exactly one payload key, `css`.

---

## Pre-move-on checklist

- [ ] `current` is first, and its `css` is the empty string `""` — not the page's CSS re-typed.
- [ ] Every selector in every `css` payload came from `meta.componentSelectors` (audit block 4)
      — none invented, none guessed.
- [ ] Color/radius/shadow properties that echo a role the page already tokenizes use
      `var(--…)` with the real name from `meta.currentTokens.varNames`; only a property whose
      value is genuinely new to the page is a literal.
- [ ] Accent-tinted shadows/washes use `color-mix(in srgb, var(--accent) N%, transparent)`, not
      a hand-typed rgba equivalent of the accent.
- [ ] Multi-role recipes (K1 button+input, K2 link+cta) are one `css` string with multiple rule
      blocks, not split across two dims.
- [ ] Multi (`multi:true`) dims still have each option's `css` written independently — nothing
      pre-merged for a combined pick.
- [ ] `jumpSelector` points at one real, visible instance of the selector, not the bare
      comma-joined role.
- [ ] No `html[data-key="opt"]` wrapper written into the `css` string itself — the generator
      adds that.
