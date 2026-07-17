# apply.md — apply recipes

Two modes, both entered only after explicit user picks and (structural dims) a preview look.
Never commit. Never self-approve a visual result — that's the user's call.

## Dirty-tree warning (both modes)

Before writing anything: if the git tree is dirty, warn and list the files apply is about to
touch. Let the user decide whether to stash/commit first or proceed anyway.

## §local

### §token

- Prefer redefining existing CSS custom properties — the audit's token inventory already
  names them.
- If none exist: introduce a minimal `:root` token block and swap the literal occurrences the
  audit frequency-ranked (highest-frequency literals first).
- Fonts: swap font-family + weights actually used, add/replace the Google Fonts `<link>` or
  `@font-face` loading line.
- Keep diffs minimal and colocated — one change per token, not a drive-by reformat.
- List every file touched in the apply report (source HTML/CSS, and any sibling page that
  shares the edited stylesheet — the audit already flagged shared files).

### §structural

- Replace the section's markup in the real page with the picked variant's markup verbatim
  (same copy, same assets — the variant was already built against the real content).
- Port the variant-scoped CSS (the `.dov-vN` block from the preview) into the page's
  stylesheet under a clearly-commented block, e.g. `/* design-options: <dim> → <option> */`.
- Re-wire checklist — walk every item before calling the structural apply done:
  - [ ] reveal/data-* attributes carried onto the new markup (`[data-reveal]`,
        `[data-animate]`, or whatever the audit's motion block recorded)
  - [ ] ids/anchors referenced by nav or in-page links still resolve to the new markup
  - [ ] JS hooks still bind — query the page's JS for selectors that touch this section
        (from the audit's component inventory) and confirm each still matches
  - [ ] responsive breakpoints — the variant's own ≤768px behavior (built in preview.md
        §variants) is present in the ported CSS, not dropped in translation

### Clash check (mechanical, not taste)

Before applying multiple picks together, flag combinations that fight each other — e.g.
dark-inversion plus a paper texture, compact density plus monumental type scale. Print the
warning and let the user decide. Never veto or silently drop a pick.

### Contrast guardrail

After any color apply, mechanically verify body-text contrast against its ground is ≥4.5:1.
Report the actual numbers. If it fails, say so and offer the nearest passing adjustment — the
user decides whether to take it.

### Verify + cleanup

- Never commit. The user verifies the result visually.
- An optional before/after screenshot pair (mechanical capture only, no verdict) can be
  offered after apply.
- Do not delete `.design-options/` on completion — offer cleanup only after the user confirms
  the result. Never assume the staging dir is disposable until told.

## §remote

No source to edit. Picks become three export deliverables written to `<staging>/exports/`,
using these exact names:

- **`recommendations.md`** — one block per picked option: dimension, option name, grounded
  rationale (audit facts cited by value), exact change description, and the target
  selectors/properties it touches on the live site (read from the staged DOM in `page.html`) —
  written so the site owner's engineer can act on it directly.
- **`tokens.css`** — a paste-ready `:root { … }` block with the instantiated token values
  (colors as hex, with the archetype formula that produced them in a comment), plus per-pick
  CSS snippets keyed to the site's real selectors, each under a `/* pick: <dim>/<option> */`
  comment. Font picks include the Google Fonts `<link>` line.
- **`variant-<section>-<option>/`** — the picked structural variant as standalone HTML+CSS:
  the variant markup carrying the section's real copy, one scoped stylesheet, and a
  `PORTING.md` note mapping the variant's classes to the site's original selectors.

### Remote rules

- Exports are the product. Print their absolute paths in the apply report. Never auto-delete
  them, regardless of what happens to the rest of the staging dir.
- Note fidelity caveats wherever a deliverable relied on the computed-style fallback rather
  than a downloaded stylesheet (audit.md §remote-fetch rung iii) — say so inline in
  `recommendations.md`, not just in the audit.

### Mode-switch rule

If the user supplies the local source repo for the audited site: spot-check 2–3 audited
selectors/values exist in that source, then proceed as §local from that point on — the audit
and the picks carry over unchanged; only selector grounding is re-checked against the real
source files before writing.
