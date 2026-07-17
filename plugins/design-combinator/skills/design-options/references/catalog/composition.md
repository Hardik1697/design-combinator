# Composition catalog — Z1–Z2  [structural layer]

Page-level dimensions: how sections align against the page axis (Z1) and what container
system they sit in (Z2). Both regenerate section wrappers and grid markup, so they ride the
structural pipeline (preview.md §variants → apply.md §structural), not the token path.
Z1 and Z2 combine freely except where an option names an incompatibility below; either may
be scoped to a range of sections instead of the whole page.
Naming, rationale format, and line discipline: references/option-writing.md.

### Z1 page-symmetry  [structural · generated variants]
What: how section content aligns against the page axis — the centered/left/offset rhythm read top to bottom.
Applies-when: always (the audit records each section's alignment; user may scope to a range of sections).
Options (5) — one axis→loose axis; every variant keeps section order and copy untouched:
- center-column — every section centers on one axis; headings, leads, and CTAs centered; frontal, symmetric. ≤768px: unchanged, already single-axis.
- left-anchor — headings and lead copy align to the container's left edge page-wide, ragged right; media may still bleed right. ≤768px: the same left spine holds.
- alternate-swing — sections alternate content-left/content-right in a fixed A/B rhythm; media takes the opposing side. ≤768px: collapses to one stack, order preserved.
- offset-drift — sections indent by stepped amounts off a shared grid (0/8/16% steps); editorial asymmetry; incompatible with split-track (Z2). ≤768px: indents flatten to one margin.
- edge-flush — content blocks anchor to alternating outer viewport edges, the gutter collapsing on the anchored side; poster tension. ≤768px: reverts to a single margin.
Grounding hook: name the audited alignment run ("9 sections: 7 centered, 2 left-aligned — left-anchor would put the whole page on one spine; alternate-swing turns the run into an A/B rhythm").
Apply: re-align section containers and heading blocks per apply.md §structural; the ≤768px behavior stated per option ships inside every variant.

### Z2 grid-restructure  [structural · generated variants]
What: the page's container system — column width, bleed, and how sections claim the viewport.
Applies-when: always (the audit records max-width values, container count, and bleed usage).
Options (5) — steadiest→most varied; every variant keeps section content untouched:
- uniform-channel — one fixed max-width (1080–1200px) wraps every section; nothing bleeds; the steadiest read. ≤768px: one column, 16–24px gutters.
- narrow-spine — a 640–760px reading column for text sections; grid sections alone widen; article register. ≤768px: spine equals viewport minus gutters.
- breakout-bleed — text keeps its channel; media and field-backed sections break to full viewport width; a two-tier system. ≤768px: bleeds keep inner gutters.
- variable-width — each section picks from a 3-step width set (narrow/base/full) by content type; per-section fit. ≤768px: all steps converge to one column.
- split-track — a persistent asymmetric two-track grid (2:1) every section places onto; labels and meta live in the narrow track; incompatible with offset-drift (Z1). ≤768px: tracks stack, narrow track first as a kicker.
Grounding hook: quote the audited container ("one 1140px container, zero bleeds, 3 media sections — breakout-bleed sends those 3 full-width; narrow-spine tightens prose to ~700px").
Apply: rewrite container and grid wrappers per apply.md §structural; the ≤768px behavior stated per option ships inside every variant.
