# `authoring.md` — the hand-author residue path

Auto-grounding (`serialize-tokens.md` M1, `serialize-components.md` M2, `serialize-structural.md`
M3) turns design-options catalogs into config dims automatically. It does not cover everything a
page might want in the dock. **This is the manual path for the rest** — how to add a dim by hand
so coverage on a given page reaches "everything," not just "everything design-options already
catalogs."

This is a residue path, not a fallback. Reach for it only after the auto-grounding pass has run —
check what design-options' token/component/structural catalogs already picked up before
hand-authoring a duplicate.

---

## What won't auto-ground

**JS-bound effects.** Count-up numerals, magnetic CTA pull, cursor-follow, page-load entrance —
anything that needs a `<script>` wiring a behavior, not just a CSS rule. design-options catalogs
color/type/shape/space/motion *tokens* and component *recipes*; it doesn't write JS. The source
100-dim combinator hand-authored these as "engine-touching" dims (⚙️): `cursor`, `entrance`,
`order`, `show`, `scroll`, `arrow`, `iconset` all needed embed-mode JS or markup beyond a CSS
attribute rule. Same category here.

**Page-unique sections with no morphable family.** design-options' structural catalog
(`morphology.md`, 13 families) covers hero/cards/steps/proof-style patterns it recognizes. A
section that doesn't map to a known family — a bespoke interactive widget, a one-off layout that
isn't a recognized pattern — has nothing to morph against. It's still a real section; it just
needs a hand-written `html` variant instead of a generated one.

**Bespoke component patterns the audit's selectors don't cleanly cover.** The component catalog
(`components.md`: buttons-and-inputs, links-and-ctas, labels-and-eyebrows, lists-and-markers,
dividers) is a fixed list. A page-specific ornament, badge, or decorative treatment that isn't one
of those families (a divider glyph, a corner clip, a bespoke card frame) is real and stylable, but
outside what the catalog enumerates.

None of this is a gap in design-options — it's the boundary of what a page-audit-driven catalog
can recognize. The residue path is how the config still reaches full coverage per page.

---

## The per-page authoring recipe

1. **Confirm it's actually residue.** Re-check the picked-dimension menu and the token/component/
   structural catalogs first. If design-options already has a family for it, use auto-grounding —
   don't hand-author a dim that duplicates one M1/M2/M3 would have produced.

2. **Choose the mechanism** by payload shape, same routing as everywhere else in the config:
   - `token` — a CSS custom property gets a new value. Requires `cssVars`.
   - `component` — a scoped declaration block styles existing elements. No extra required field.
   - `markup` — a section's DOM gets replaced. Requires `target`.

3. **Ground every option the same way design-options does** (`option-writing.md`'s discipline,
   binding here too): every rationale cites a real page fact by value — a selector, a measured
   number, a count — never "your current design" or an ungrounded quality claim. Two-word names,
   no banned empty adjectives (modern/clean/sleek/beautiful/stunning/elegant/premium), no
   recommend-language. Options print in a semantic spectrum (quiet→loud, restrained→drenched);
   the skill never ranks.

4. **`current` is always first, and it's the true no-op.** Its payload must reproduce the live
   page exactly: `vars` = the page's real current values, `css` = `""`, `html` = the section's
   original markup captured verbatim. The dock must open visually identical to the unmodified
   page.

5. **Selectors and vars are the page's own**, read straight from `.design-options/audit.md` (block
   2 for token vars, block 4 for component selectors) or from `meta.componentSelectors` /
   `meta.currentTokens.varNames` already sitting in the config. Never invent a selector, and never
   borrow one from another page's markup — that's the exact bug (`--accent` vs `--cobalt-600`)
   `config-schema.md` calls out for auto-grounded dims, and it applies just as hard here.

6. **For `component` (`css`) dims: scope to the real selector, use `var()` for tokened
   properties.** Any color, radius, or spacing value the option touches should reference the
   page's own custom property (`var(--cobalt-600)`, not a literal hex) so the hand-authored dim
   still recolors when the user picks a different M1 token option. This is what "composes" means
   in practice.

7. **For `markup` (`html`) dims: reuse the page's own classes and token vars in the fragment.**
   A hand-written variant that introduces brand-new classes breaks M1/M2 composition after the
   swap — the token and component layers have nothing to attach to. If a variant genuinely needs
   a new class, say so explicitly next to the option (the serializer flags this same case for
   auto-grounded structural variants) and give it its own token wiring rather than leaving it
   silently unstyled.

8. **Add the dim object to the right `categories[].dims` array** (an existing category, or a new
   one if nothing fits) and pick a `key` unique across the whole config, a `jumpSelector` that
   resolves to a real on-page element, and a `label` a person would recognize in the dock
   accordion.

9. **Regenerate and check it manually.** Run `gen.mjs` against the edited config and confirm: the
   new `html[data-<key>="<name>"]` rules appear in `combinator.effects.css` (token/component) or
   the fragment lands in `variantRegistry` (markup), and toggling the dim in the dock changes only
   what the rationale says it changes.

---

## Worked example: a hand-authored `component` dim

The example fixture (`assets/combinator/config.example.json`) auto-grounds buttons and emphasis
marks under "Components," but has no dim for the section-break hairlines beyond their line style
— the audit's divider selector (`.hairline-top, .hairline-bottom`) exists, but no design-options
family covers a decorative glyph on top of it. That's residue: a bespoke ornament, on a real
selector the audit already captured, that the component catalog doesn't enumerate.

Add this dim object to the `"Components"` category, alongside `buttons` and `emphasis`:

```jsonc
{
  "key": "dividerglyph",
  "label": "Divider ornament",
  "mechanism": "component",
  "multi": false,
  "default": "current",
  "jumpSelector": ".hairline-top",
  "options": [
    {
      "name": "current",
      "rationale": "the page's own bare 1px hairline, no ornament",
      "css": ""
    },
    {
      "name": "diamond-mark",
      "rationale": "your section breaks are a plain hairline (.hairline-top/.hairline-bottom, no ornament) -> a centered accent diamond gives each break a wayfinding beat",
      "css": ".hairline-top, .hairline-bottom{ position:relative }\n.hairline-top::after, .hairline-bottom::after{ content:''; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(45deg); width:6px; height:6px; background:var(--cobalt-600) }"
    },
    {
      "name": "triple-dot",
      "rationale": "swap the single diamond for a quieter three-dot rhythm in ink, when a solid accent mark reads too loud against a dense page",
      "css": ".hairline-top, .hairline-bottom{ position:relative }\n.hairline-top::after, .hairline-bottom::after{ content:'\\2022 \\2022 \\2022'; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); color:var(--ink-950); font-size:10px }"
    }
  ]
}
```

Walking the checklist against it:

- **Mechanism matches payload** — `component`, and every option carries exactly one `css` field
  (no `vars`, no `html`).
- **`current` first, true no-op** — `css: ""`; the page's hairlines render exactly as they do
  today.
- **Real selector** — `.hairline-top, .hairline-bottom` is `meta.componentSelectors.divider` from
  this exact fixture (`config.example.json`), not invented.
- **`var()` for tokened properties** — `background:var(--cobalt-600)` and
  `color:var(--ink-950)` are the fixture's own `meta.currentTokens.varNames.accent` /
  `.ink`. Pick `complement-pop` on the `accent` token dim and the diamond recolors with it — the
  hand-authored dim composes with M1 without any extra wiring.
- **Grounded rationale** — each cites the real selector and the concrete current state (bare
  hairline, no ornament) before naming what changes.
- **Unique key, real jump target** — `dividerglyph` doesn't collide with `buttons`/`emphasis`/
  etc.; `.hairline-top` is a real element the dock can scroll to.

Run this fixture through `gen.mjs` and `buildEffectsCss` emits (per `componentRules` in
`assets/combinator/gen.mjs`, which loops every `{…}` block in the option's `css` string, so both
declaration blocks in `diamond-mark` land correctly):

```css
html[data-dividerglyph="diamond-mark"] .hairline-top, html[data-dividerglyph="diamond-mark"] .hairline-bottom{ position:relative }
html[data-dividerglyph="diamond-mark"] .hairline-top::after, html[data-dividerglyph="diamond-mark"] .hairline-bottom::after{ content:''; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(45deg); width:6px; height:6px; background:var(--cobalt-600) }
```

`dock.js` never sees `css` directly — it toggles `data-dividerglyph` and the generated rule above
does the rest, exactly like an auto-grounded component dim.

---

## JS-bound effects: expose only where the page already wires them

Do not fabricate JS to make an effect dim-able. If the example page has no count-up script, there
is no `countup-speed` dim — the effect doesn't exist on that page and inventing the wiring is out
of scope for this skill (per this skill's own deferred-scope note: *"JS-bound effects that need
per-page wiring… stay page-specific; the dock exposes them only where the target already wires
them, otherwise they're inert."*).

The one case where a JS-bound effect **can** become a dim: the target page already has the script,
and that script already reads a `data-*` attribute or CSS variable to vary its behavior. Then a
`component`/`token` dim that writes that same attribute or var is legitimate — the dim isn't
adding a new effect, it's exposing a knob the page's own JS already listens for. Ground it exactly
like anything else: cite the real script/selector in the rationale, `current` reproduces the
page's existing behavior untouched.

If the effect exists but isn't parameterized (the count-up runs, but always at one fixed speed
with no attribute it reads), don't wire a new attribute into the page's script to manufacture a
dim — that's writing new JS, which this path documents as out of scope. Leave it undimmed and note
it in the config's authoring notes as inert-by-design, same as the source combinator's own
documented behavior for effects the target markup didn't support.

---

## Checklist for a well-formed hand-authored dim

- [ ] **Mechanism matches payload.** `token`→`vars` only, `component`→`css` only, `markup`→`html`
      (+`rewire`) only — never a mix.
- [ ] **`current` is first and is the real no-op** — its payload reproduces the live page exactly,
      not an approximation.
- [ ] **Selectors/vars are the page's own**, pulled from `.design-options/audit.md` or the
      config's existing `meta.componentSelectors` / `meta.currentTokens.varNames` — never assumed,
      never borrowed from another page.
- [ ] **Every rationale cites a real page value** — a selector, a count, a measured number — same
      discipline as design-options' `option-writing.md`. No banned empty adjectives, no
      recommend-language, no ranking.
- [ ] **Composes via `var()`** — `css` options reference the page's real custom properties for any
      color/radius/spacing they touch, so an M1 token pick still recolors a hand-authored M2 dim;
      `html` options reuse the page's existing classes/vars so M1/M2 still apply post-swap.
- [ ] **Key is unique**, `jumpSelector` resolves to a real element, and the dim sits in a category
      that makes sense in the dock accordion.
- [ ] **No fabricated JS.** JS-bound effects are dimmed only if the page already wires them and
      already exposes a knob to vary; otherwise they're documented as inert, not invented.
