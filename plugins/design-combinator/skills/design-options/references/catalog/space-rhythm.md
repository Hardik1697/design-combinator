# Space & Rhythm catalog — R1–R4  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
density → R1 density · rhythm → R2 section-rhythm · shell + gutter → R3 content-width ·
align + offset → R4 alignment. The structural halves of shell and offset/align route to
Z1 page-symmetry and Z2 grid-restructure (composition.md); the R-dimensions are the token-level
spacing flips only.
Naming, rationale format, and line discipline: references/option-writing.md.

### R1 density  [token · css]
What: the overall tightness of interior spacing — the padding and gap multipliers that make the page feel compact or open.
Applies-when: always; measured against the audit's base spacing unit.
Options (7) — compact→luxe; each is a multiplier on the audited base padding/gap:
- packed — multiply all paddings/gaps by ~0.7×; card padding ~12–16px, grid gap ~12px; dashboard density. Wins for data-dense, scan-heavy pages.
- trim — ~0.85× the base; snug but breathable, app-and-docs comfort without waste. Wins for content apps and reference layouts.
- even-hand — hold the audited density but regularize padding/gap to one 1.0× scale; removes drift, keeps the feel. Wins when spacing is inconsistent.
- relaxed — ~1.25× paddings and gaps; card padding ~24–32px, gaps ~24px; marketing-page ease. Wins for general landing pages.
- open-hand — ~1.5× base; sections and cards carry visible air, each block gets room. Wins when copy runs short per block.
- lavish — ~1.75× base; wide interior padding and generous gaps; boutique calm. Wins for image-led and portfolio registers.
- luxe — ~2.0×+ base; cards read as framed objects and gaps read as intentional silence. Wins for one-idea-per-screen pages.
Grounding hook: quote the audited base unit plus a sample card padding and grid gap ("cards pad 32px, grids gap 24px, sections pad 96px — you sit near relaxed; packed would compress to a dashboard, luxe would double the air").
Apply: scale the spacing token(s) or the padding/gap declarations by the option's multiplier; keep the ratios between steps intact so the scale stays coherent. → apply.md §token.

### R2 section-rhythm  [token · css]
What: the vertical cadence between top-level sections — how much air separates one section from the next.
Applies-when: always; richest on pages with 3+ stacked sections.
Options (9) — tight→monumental; formulas in body line-heights (lh) or viewport width (vw):
- butted — sections pad 1.5–2× lh top and bottom (~40–56px); they nearly touch, a continuous-document feel. Wins for docs and long reads.
- steady-beat — 3× lh (~64–80px) every section; an even, predictable pulse. Wins when no section should dominate.
- roomy-beat — 4–5× lh (~96–128px); clear marketing separation. Wins for general landing pages.
- deep-breath — 6–7× lh (~144–180px) or ~10vw; each section arrives after a pause. Wins for one-idea-per-section pages.
- chapter-gaps — 8–10× lh (~200–260px) or ~14vw; sections read as chapters. Wins for narrative, scroll-story pages.
- monumental — ~18–22vw between sections; near-empty transitions, gallery pacing. Wins for manifesto and showcase pages.
- syncopated — alternate tight (2× lh) and wide (6× lh) so pairs group and separate; the uneven-rhythm option. Wins when sections come in pairs.
- taper-in — gaps shrink down the page (start ~10vw, end ~4vw), pulling toward the close. Wins for persuasion flows building to a CTA.
- hairline-punctuated — modest 3× lh gaps, but each seam carries a thin rule or mark, so rhythm is drawn not just spaced. Wins when air alone reads empty.
Grounding hook: quote the audited section top/bottom padding and whether it is uniform ("every section pads 80px top and bottom — steady-beat is your world; deep-breath would slow it, syncopated would group the pairs").
Apply: rewrite the section vertical-padding token or the per-section padding/margin rules; syncopated, taper-in, and hairline-punctuated need per-section values, not one token. → apply.md §token.

### R3 content-width  [token · css]
What: how wide content runs — the container max-width and gutter behavior that set the page's shell.
Applies-when: always.
Options (8) — narrow→edge-to-edge; each states a max-width and gutter behavior:
- column-narrow — max-width ~640–720px, centered, generous side gutters; a single-column reading shell. Wins for essays and focused copy.
- text-measure — ~760–860px shell, comfortable for prose plus small media. Wins for article-led marketing.
- standard-shell — ~1080–1200px centered container, 24px gutters; the general marketing width. Wins for mixed-content pages.
- wide-shell — ~1320–1440px, 32–48px gutters; roomy for 3–4 column grids and large media. Wins for dashboards and galleries.
- full-bleed-media — content holds a ~1100px shell but media, heroes, and bands break to 100vw edge-to-edge. Wins when imagery should dominate.
- edge-to-edge — no max-width; content runs the full viewport with fixed 4–6vw gutters. Wins for immersive showcase and photography pages.
- mixed-measure — prose capped at ~680px while media, grids, and pull-quotes widen to ~1200px+; the mixed-width option. Wins for editorial with rich media.
- rail-and-body — a fixed ~1200px shell split into a narrow side rail (~240px) plus a ~720px body column. Wins for docs with persistent nav or meta.
Grounding hook: quote the audited container max-width and gutter ("content sits in a uniform 1200px container with 24px gutters, media included — mixed-measure would pull prose to 680px while media keeps the width").
Apply: redefine the container max-width token/utility or the wrapper max-width rules; full-bleed-media and mixed-measure add a widen modifier class for media and grids. → apply.md §token.

### R4 alignment  [token · css]
What: the horizontal alignment logic — whether headings and body sit centered, left, or in a deliberate mix.
Applies-when: always.
Options (7) — from a single flush margin to deliberate mixes:
- all-left — every heading, body, and eyebrow flush-left; one strong margin down the page. Wins for editorial, technical, and long-copy pages.
- all-center — headings, body, and CTAs centered throughout; symmetric, announcement posture. Wins for short-copy, single-message landings.
- center-heads-left-body — section headings and eyebrows centered, paragraphs and lists flush-left; a common hybrid. Wins for marketing with real body copy.
- left-heads-center-accents — headings flush-left, but stats, quotes, and CTAs centered as punctuation. Wins when the spine is left but moments should breathe.
- mixed-by-section — alignment alternates by section (hero centered, features left, CTA centered); rhythm through alignment. Wins on long, varied pages.
- right-rail — labels and eyebrows right-aligned in a side column, body left; a magazine margin-note structure. Wins for docs and annotated layouts.
- offset-left — content sits left of center in a wide shell, asymmetric right whitespace; a deliberate lean. Wins for portfolios. (pairs with Z1 page-symmetry)
Grounding hook: quote the audited alignment of headings versus body ("headings and body are centered page-wide — all-left would give it an editorial spine, center-heads-left-body would keep the announcements but ease the reading").
Apply: rewrite text-align on the heading/body/eyebrow selectors; mixed-by-section and right-rail need per-section rules, not one token; offset-left also shifts the container. → apply.md §token.
