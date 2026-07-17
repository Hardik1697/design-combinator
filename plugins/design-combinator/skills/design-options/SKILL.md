---
name: design-options
description: Design-alternatives menu for EXISTING pages and UIs — local files/dirs OR any live website URL. Audits the target page, prints the full pick-list of design dimensions (color schemes, font pairings, type scale, radius/shadow/borders, spacing rhythm, section dividers, buttons, motion, card alternatives, section-transition ideas, hero/layout restructures), generates 3–10 named options per picked dimension grounded in the page's own current identity, previews them, and applies exactly what the user picks (for remote URLs: exports a recommendations doc, paste-ready CSS token blocks, and standalone variant HTML). Use whenever the user says "give me options for…", "what else could this be", "alternatives to cards", "different color schemes", "other font pairings", "section break ideas", "design menu", "restyle options", "show me variations of…", "what are my choices for…", "what would you change on <url>", or invokes /design-options <page-or-url>. Not a builder, not a critic — user keeps taste authority; never redesign unprompted.
---

# design-options

## 1. What this is / is not

A **design-alternatives consultant for existing pages** — not a builder (the page must already
exist), not a critic (it never ranks or decides), not a redesigner (it never rewrites
unprompted). Target is a **local file/dir OR any live URL** — remote targets get the identical
audit → menu → options → preview flow; only apply differs (exported deliverables instead of
source edits). Job: audit the target, print the full dimension menu, generate named concrete
options grounded in the page's own identity for the dimensions the user picks, preview where
previewing pays, apply exactly what the user chooses. **The user keeps taste authority at every
step.** Never skip the menu step. Never pre-pick "the best" option. Never apply without
explicit picks.

## 2. Ground rules

- **Zero-bias contract:** work SOLELY with the target. Never read another project's source or
  tokens, never cite reference sites, never say "best practices from X". Archetype options
  instantiate against THIS page's audit only. No "default" baseline exists — the target's
  current state IS the baseline. Options print **unranked, in fixed catalog order**. Never say
  "recommended", "best", or "I'd go with" — rationales cite only target facts.
- **Never commit, never self-approve.** Applies happen only after explicit user picks.
  playwright-cli screenshots are allowed for the skill's own mechanical grounding; visual
  verdicts belong to the user, always.
- **Staging discipline:** everything this skill writes at runtime goes in the staging dir
  (§3) — never scatter files elsewhere. Local targets → `<target-dir>/.design-options/`.
  Remote targets → `<scratchpad>/design-options/<host-slug>/` by default, or
  `<cwd>/.design-options/<host-slug>/` if the user asks to keep the artifacts.
- **Dirty tree:** if the git tree is dirty at apply time, warn and list the files apply will
  touch before writing anything.

## 3. Invocation & argument parsing

`/design-options <target> [filter]` — or natural language ("give me options for this page's
section breaks", "what would you change on stripe.com").

Target resolution, in order:
1. Matches `^https?://` → **remote mode**: set staging dir per above, fetch per
   `references/audit.md` §remote-fetch.
2. Existing directory → resolve to `index.html` inside it (else the only, or
   most-recently-modified, `*.html`).
3. Existing file → use as-is.

`filter` = a category name (`color`, `typography`, `motion`, …) or a layer name (`token`,
`structural`): the menu still prints in full, scoped to matching categories, with a note that
`full menu` reprints everything. No target given → ask one plain-text question for it (never
AskUserQuestion for this). Multi-page directories: audit the resolved page only; if CSS is
shared across sibling pages, note which files are shared — token flips will propagate there
too. Record `mode: local|remote` in the staging audit — it changes only step 5 (apply) and the
staging location; every other step is identical between modes.

## 4. Step 1 — Audit

Read `references/audit.md` in full before auditing; it points into `references/recognition.md`
for section classification. Remote mode: fetch first (rendered DOM + styles + screenshot into
staging — audit.md §remote-fetch) before anything else. Produce `.design-options/audit.md`
containing: an identity summary, a token inventory (fonts, palette, scale, shape, space,
motion), a section map (family + confidence + morphable per top-level section, nothing
omitted), a component inventory, and the menu itself with every `[current: …]` slot filled from
the audit. In remote mode, the identity summary adds one line: "remote target — picks will be
exported, not applied in place." Screenshot capture is optional-but-preferred for local targets, mandatory for remote
(it's part of the fetch) — follow the rendering gotchas in audit.md (serve over http, never
file://; force-reveal gated content before capturing).

## 5. Step 2 — Menu

Print the FULL grouped, numbered menu below, with `[current: …]` slots filled from the audit
and structural X-entries appended from the section map (dynamic — one per detected morphable
section, see `references/catalog/morphology.md` for the family list). If a filter arg was
given, print only the matching categories and add "(filtered — reply `full menu` for
everything)". Never ask "which dimension do you want?" open-endedly — the menu is always
printed in full. End with the pick-instruction line and **stop — no AskUserQuestion here**;
30+ dimensions cannot fit its 4×4 envelope, free text is the protocol for picks.

```
## Design-options menu — <page>   (pick by number, name, or category)

TOKEN — cheap flips
Typography
  1. heading-font        — the display voice                [current: …]
  2. body-font           — text face + pairing               [current: …]
  3. type-scale          — display↔body size ratio           [current: …]
  4. heading-treatment   — case/tracking/weight bundle       [current: …]
  5. body-rhythm         — size, leading, paragraph          [current: …]
  6. emphasis-marks      — italic/underline/highlight        [current: …]
Color & Surface
  7. color-scheme        — accent/paper logic                [current: …]
  8. background-tone     — paper archetype                   [current: …]
  9. accent-spread       — restrained → drenched              [current: …]
 10. surface-treatment   — flush/lift/tint/frost              [current: …]
 11. texture             — grain/pattern/ornament             [current: …]
 12. imagery-treatment   — photo filters + frames             [current: …]
Shape & Depth
 13. corner-radius       — sharp ↔ pill-rounded                [current: …]
 14. elevation           — flat ↔ deep shadow                  [current: …]
 15. borders             — none/hairline/bold                  [current: …]
 16. edge-details        — clip-paths, rings, notches          [current: …]
Space & Rhythm
 17. density             — compact ↔ airy                      [current: …]
 18. section-rhythm      — spacing cadence between sections    [current: …]
 19. content-width       — shell / gutter / max-width          [current: …]
 20. alignment           — centered ↔ offset/asymmetric        [current: …]
Motion
 21. motion-level        — none ↔ expressive                   [current: …]
 22. reveal-style        — entrance direction + stagger        [current: …]
 23. hover-personality   — hover feedback character            [current: …]
Components
 24. buttons-and-inputs  — button + form-control language      [current: …]
 25. links-and-ctas      — link treatment + arrow/CTA style    [current: …]
 26. labels-and-eyebrows — kicker/badge/mono labels            [current: …]
 27. lists-and-markers   — list icon/marker style              [current: …]
 28. dividers            — glyph-level section dividers        [current: …]

STRUCTURAL — generated variants (side-by-side preview)
 29… one entry per detected morphable section, e.g.:
     29. hero — recompose                              [current: …]
     30. features — alternatives to cards              [current: …]
     31. testimonials — recompose                      [current: …]
 (N).   section-transitions — what happens at section boundaries  [current: … breaks]
 (N+1). page-symmetry — centered vs offset layout logic           [current: …]
 (N+2). grid-restructure — column count / shell / max-width       [current: …]

Also on this page (recognized, no variant set yet): <recognize-only sections with a
one-line best-guess description each, plus any morphable sections that lost the coin-flip
to the entry cap below — name and family, note that a variant set exists on request — or
omit this line if neither category has entries>.
Token dims still apply to these; say e.g. "buttons, scoped to the newsletter form".

Reply with picks: "2, 7, 14" · "all of Color" · "all token" · "30 and 32" · "all"
```

Numbering rule: dynamic X-entries are numbered continuing after 28, in section-map document
order; the three fixed structural dims (section-transitions, page-symmetry, grid-restructure)
always come last. Numbering is persisted in `.design-options/audit.md` so it stays stable
across turns and sessions.

Entry cap: the printed menu holds ≤40 entries total (28 static + dynamic X-entries + the 3
fixed structural dims), leaving a dynamic budget of 9. Real pages routinely carry more than 9
morphable sections (nav and footer both count) — when they do, fill the budget in document
order and list the rest by name + family in the "Also on this page" footnote instead of
padding the menu past the cap. Never drop static dims or the 3 fixed structural dims to make
room; the overflow always comes out of the dynamic X-entries.

## 6. Step 3 — Options

For each picked dimension: load ONLY that dimension's category catalog file (never load
catalog files for categories the user didn't pick). Emit named options grouped by dimension —
6–10 for token dims, 3–6 for structural dims — each as **name — grounded rationale** that
references at least one audit fact by value ("your accent is a single #2563eb used 4 places →
…"). Follow `references/option-writing.md` for naming style and the rationale format. If C1
color-scheme, C2 background-tone, T1 heading-font, or T2 body-font is among the picks, also
build the **swatch sheet** (`assets/swatch-shell.html` → `.design-options/swatches.html`),
serve it, and give the URL (§7). If a structural dimension is among the picks, ask via
**AskUserQuestion** whether to build the side-by-side variants preview now (3–6 real
renditions) or describe the options first — `[Build preview / Describe first / Skip this
dim]`. Stop and await the next reply either way.

## 7. Step 4 — Preview

Pointers into `references/preview.md` — do not re-derive the recipe here. Swatch sheet for
color/font dims (C1/C2/T1/T2): specimen chips + heading/lede samples in the real proposed
fonts, self-contained, no target-page duplication. Static variants page for structural dims:
real renditions using the section's real copy and assets, stacked labeled iframes with a
360/768/1440 viewport toggle. Serve either via `scripts/serve.sh <project-root>` (local) or
`scripts/serve.sh <staging-dir>` (remote — all assets were staged, paths resolve the same way).
Hand the printed URL to the user and **STOP** — the user looks in their own browser and picks;
this skill never renders a visual verdict itself.

## 8. Step 5 — Apply

Confirm via **AskUserQuestion**: `[Apply all / Show diff plan first / Apply subset / Abort]`
(remote mode relabels the same fork: `[Export all / Preview exports first / Export subset /
Abort]`). Then follow `references/apply.md`.
- **Local:** edit source directly; report the exact files touched and the line-level nature of
  each change. Offer an optional before/after screenshot pair (mechanical capture only, no
  verdict). Do not delete `.design-options/` yet — offer cleanup only after the user confirms
  the result.
- **Remote:** no source to edit — write the three export deliverables (`recommendations.md`,
  `tokens.css`, `variant-<section>-<option>/`) to `<staging>/exports/`; print their absolute
  paths and a short porting note. Exports are the product — never auto-delete them. If the user
  then supplies the local source repo for the same site, re-ground the audited selectors
  against that source and switch to the normal local apply path for anything picked from then
  on.

## 9. Iteration & re-entry

- "more options for #7" → regenerate that dimension with a fresh set of names, no repeats of
  what was already shown.
- "menu" → reprint the menu from `.design-options/audit.md` verbatim (numbering is persisted
  there, so numbers stay stable across turns and across sessions).
- Re-audit only if the target page itself changed since the last audit; otherwise reuse the
  staged audit.

## 10. Failure modes

- **No CSS custom properties found** → apply layer falls back to literal-value swaps with a
  newly introduced `:root` token block.
- **Page not servable** (no server tooling available) → skip screenshots, audit from source
  only, note the gap in the identity summary.
- **React/JSX target** → audit and options still work fully; apply edits the component source;
  the variants page uses extracted rendered markup — flag the fidelity caveat to the user.
- **Remote fetch fails** (bot-blocked, auth-walled, infinite spinner) → report what happened,
  offer a retry with a longer settle wait, or ask the user for a saved copy of the page. Never
  scrape around a block.
- **Remote CSS unreadable** (cross-origin, minified-into-JS, CSS-in-JS) → fall back to
  computed-style extraction (audit.md §remote-fetch step 4); variants then embed the extracted
  computed styles instead of linking stylesheets — flag the fidelity caveat.
- **Section classifier below confidence threshold** → still list the section as unknown with a
  best-guess description; `references/recognition.md`'s rule holds: the menu never silently
  skips page content, low-confidence sections still surface in the "Also on this page" footnote.
