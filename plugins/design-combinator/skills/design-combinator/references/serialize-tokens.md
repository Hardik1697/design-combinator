# serialize-tokens.md — M1: grounded token options → concrete `vars`

Turns design-options' token-catalog options (T1–T6 typography, C1–C6 color-surface, plus the
shape-depth / space-rhythm / motion recipe dims) into the `vars` payload `config-schema.md`
defines for `mechanism:"token"` dims. Read `config-schema.md` in full before running this —
every field name below is load-bearing there.

## Inputs

- **`.design-options/audit.md` block 2** (token inventory): the page's real custom-property
  names (`varNames`), `hasCustomProps`, and the current per-role values — heading/body font,
  type scale, case/tracking, body rhythm, the frequency-ranked palette's dominant hue **H**,
  paper **P**, ink, radius, shadow recipe, spacing scale, motion easing/duration.
- **Design-options' already-generated option lines** for the picked token dims — printed at its
  Step 3 (`option-writing.md` format: `**name** — <audit fact> → <recipe or Instantiate: clause>
  (<when it wins>)`). For C1/C2/T1/T2, these arrive **pre-instantiated a second time** in
  `.design-options/swatches.html`'s specimen chips and type samples (design-options' own
  `references/preview.md` §swatch sheet) — when that file exists for a dim, **lift its already-computed
  hex/font stack** rather than re-deriving from the formula; this is the drift guard the plan's
  risk table calls for ("reuse swatch instantiation rather than re-deriving"). Every other token
  dim (T3–T6, C3–C6 non-color parts, shape/space/motion) never gets a swatch sheet — instantiate
  those directly from the option's recipe, per §Per-dim procedure below.

## Preflight — the `hasCustomProps` gate

If `.design-options/audit.md` block 2 reports `hasCustomProps: false`, **stop before emitting
any option** and run design-options' apply-layer bootstrap first
(design-options' own `references/apply.md` §token: "no CSS custom properties found → introduce a
minimal `:root` token block and swap the literal occurrences the audit frequency-ranked,
highest-frequency first"). Follow design-options' own dirty-tree warning before it writes.

**Why this gate exists:** the dock's whole mechanism is `html[data-key="value"]{ --var: newval
}` — a CSS custom-property write. If the page's stylesheet never references `var(--var)`
anywhere, the write has nothing to propagate into and every swap silently no-ops in the browser.
Bootstrapping first is what makes a swap actually visible.

After the bootstrap runs, record the newly introduced var names as the dim's `cssVars` and as
`meta.currentTokens.varNames` entries — they are now "the page's own" vars, current-value
included, for every step below.

## Per-dim procedure

For each picked token dim, in order:

1. **Emit `current` first.** Its `vars` = the page's own value(s), copied verbatim from audit
   block 2 — never rounded, never re-derived. This is the no-op option that reproduces the live
   page, per `config-schema.md`'s invariant that option 1 is always `current`.
2. **For every other option, instantiate to a concrete value:**
   - **Color/background archetypes** (C1, C2, and any `Instantiate:` clause elsewhere in
     C3–C6): parse the clause's operation (rotate hue, tint toward a hue, shift lightness,
     desaturate, …) and its stated range. Convert the referenced base (H, P, or ink) hex → HSL,
     apply the operation at the range's midpoint (or its stated fixed value), convert back to
     hex. This is the exact by-hand math a swatch chip's `style="background:#…"` already used —
     mirror it, don't invent a new resolution rule.
   - **Fonts (T1/T2):** the catalog line names two exemplar faces ("Fraunces … or Playfair
     Display"); use whichever one the swatch sheet already rendered for this option — T1/T2
     always get a swatch sheet when picked, so there is always a rendered choice to lift instead
     of re-deciding. Build the stack as `'<Face>', <fallback-generic>`, matching the shape of the
     page's own `--font-heading`/`--font-body` value. Append the face name to
     `meta.fontFamilies` (dedupe against what's already there).
   - **Scale/shape/space/motion recipes** (T3, T4, T5, T6, C3's non-color parts, shape-depth,
     space-rhythm, motion catalogs): these already carry literal numbers or ratios ("~1.333
     ratio", "tracking +0.05em", "0 16px 48px at 12–16% ink opacity") — copy the number(s)
     straight into `vars`, computing any derived rank (e.g. h2 from h1 × ratio) exactly as the
     catalog's recipe states it.
3. **Map to the page's own var(s).** Every key in an option's `vars` object must be one of the
   dim's own `cssVars` (from `config-schema.md`), which are themselves `meta.currentTokens.
   varNames` entries or bootstrap-introduced vars — never an assumed or invented name. (Writing
   `--accent` when the page actually defines a differently-named var like `--cobalt-600` is the
   token-name-mismatch bug this whole scheme exists to prevent.)
4. **Bundle dims write every member var in one option.** A dim like type-scale may need
   `cssVars: ["--h1-size","--h2-size","--h3-size"]` — one option's `vars` sets all of them
   together so the ratio actually holds; never split one recipe across two dims.

## Output shape

Exactly the `token`-mechanism dim shape from `config-schema.md`:

```jsonc
{
  "key": "accent", "label": "Accent hue", "mechanism": "token",
  "cssVars": ["--cobalt-600"], "multi": false, "default": "current",
  "jumpSelector": ".hero .btn-primary",
  "options": [
    { "name": "current", "rationale": "…", "vars": { "--cobalt-600": "#2f5fe0" } },
    { "name": "complement-pop", "rationale": "…", "vars": { "--cobalt-600": "#e0662f" } }
  ]
}
```

## Worked example — color formula → concrete hex

The example fixture's audit (`.design-options/audit.md` block 2): `H = #2f5fe0` (the dominant
cobalt accent), `P = #fcfcfd`, `varNames.accent = --cobalt-600`.

Design-options' C1 color-scheme option **complement-pop**: *"H stays primary; a complementary
pop (rotate H 150–180°, chroma-matched to P's warmth) reserved for CTAs + emphasis marks only."*

Instantiate:
1. `#2f5fe0` → HSL ≈ **(224°, 74%, 53%)**.
2. Apply the clause: "chroma-matched" here reads as *hold saturation and lightness, rotate hue
   only*. Rotate toward the low end of the stated 150–180° window, ~155° → target hue ≈
   224° + 155° − 360° = **19°**. Result HSL ≈ (19°, 74%, 53%).
3. HSL(19°, 74%, 53%) → hex ≈ **`#e0662f`**.
4. Map to the page's own var: `varNames.accent = --cobalt-600`.

```jsonc
{ "name": "complement-pop",
  "rationale": "your accent #2f5fe0 sits alone in blue -> a chroma-matched warm pop (H rotated ~155 deg) reserved for CTAs",
  "vars": { "--cobalt-600": "#e0662f" } }
```

(This is the same value already hand-authored in `assets/combinator/config.example.json` — a
confirming spot-check that the instantiation procedure reproduces the fixture, not just plausible
prose.)

## Worked example — font stack

Design-options' T1 heading-font option **didone-drama**: *"Fraunces (soft-didone) or Playfair
Display; high-contrast, luxe, editorial."* The example page's audit shows
`--font-heading: 'Archivo', …` — a neutral grotesque. The swatch sheet built for this pick already rendered its heading sample in
**Fraunces** (the first-listed exemplar, no other signal to prefer Playfair) — lift that choice
rather than re-deciding.

```jsonc
{ "name": "didone-drama",
  "rationale": "your headings are a neutral grotesque (Archivo) -> a high-contrast didone adds editorial authority to the H1 numeral",
  "vars": { "--font-heading": "'Fraunces', Georgia, serif" } }
```

And append to `meta.fontFamilies`: `["Archivo", "Fraunces", …]` — Archivo is already present
from the page's own `current` option; Fraunces is newly added, deduped against any other font
pick in the same run.

## Checklist — run before moving to M2/M3

- [ ] `current` is option 1 in every dim, values copied verbatim from audit block 2
- [ ] every non-current option's `vars` holds concrete values — no `Instantiate:` text, no
      unresolved font "A or B" pairs, no formula language survives into the config
- [ ] every `vars` key is one of the dim's own `cssVars`, sourced from
      `meta.currentTokens.varNames` or the bootstrap — never an invented name
- [ ] every font option's chosen face is appended to `meta.fontFamilies`, deduped
- [ ] if `hasCustomProps` was `false`, the `:root` bootstrap ran first and the new var names are
      what `cssVars`/`varNames` now point at
- [ ] each option's `rationale` is carried over from design-options unchanged — this serializer
      adds the concrete value, it doesn't rewrite the grounding fact
- [ ] bundle dims (type-scale, body-rhythm, …) set every member var in one option, never split
      across dims
