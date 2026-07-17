# Morphology catalog — per-family structural variant sets  [structural layer]

Family-keyed, not menu-ID-keyed: the audit instantiates these as per-page X-entries (X1, X2…)
for each morphable section it finds — recognition.md decides which family a section belongs
to. Variants are generated as real HTML, never token flips.
Naming, rationale format, and line discipline: references/option-writing.md.

**Variant-set coverage (frozen for v1):**
- **Has a variant set (13):** hero · card-grid · steps/list · comparison-table · pricing-table · quote/proof · logo-wall · faq · stats · split · cta-band · nav · footer.
- **Recognize-only for now (listed in the map + menu footnote, no variants yet):** carousel/slider · form/lead-capture · gallery/masonry · banner/announcement · tabs/accordion · video-embed · article/prose · sidebar · breadcrumb · mega-menu · map/embed · social-proof-strip.

Recognize-only and `unknown` sections are never silently dropped: the menu ends with an
"Also on this page (recognized, no variant set yet)" footnote listing them with their
one-line guessed descriptions.

### X hero — "what else besides this hero?"  [structural · generated variants]
Applies-when: audit classified the page's first content section as family hero.
Options (5) — every variant MUST reuse the hero's real heading, subhead, CTA copy, and media assets verbatim:
- poster-center — one centered column; heading at the scale's top step; CTAs paired beneath; media drops below the copy block; frontal, symmetric.
- split-stage — 55/45 two-column; copy cluster left, media right bleeding to the viewport edge; CTAs under the subhead.
- media-flood — media becomes a full-bleed background field; copy sits in a scrim-backed block in the lower third; heading steps up one size.
- offset-anchor — copy anchored to one edge on a 2/3–1/3 asymmetric grid; media overlaps the next section's boundary by 48–96px; whitespace carries the balance.
- type-monument — media leaves the first view; heading fills 80–90% of viewport width at maximum scale; subhead + CTAs in one thin row; media leads the next block.
Grounding hook: quote the hero's audited shape ("centered column, one CTA, background photo, heading ~2.8rem — split-stage would seat the photo beside the copy; type-monument trades it for scale").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X card-grid — "what else besides cards?"  [structural · generated variants]
Applies-when: audit detected a repeated-card grid section.
Options (6) — every variant MUST reuse the section's real copy and image assets verbatim:
- bento-mosaic — mixed-span cells on a tight grid, one hero cell 2×; thin gaps; density signal.
- editorial-rows — full-width stacked rows, big numerals, hairline separators, generous air; magazine read.
- ledger-table — dense tabular layout; mono numerals; row hover; for data-flavored content.
- timeline-rail — vertical rail with nodes; items hang off one or alternating sides; implies sequence.
- index-panel — left index list (titles) drives a right detail panel; accordion below 720px; for 4+ items with long bodies.
- chip-strip — compact chips or a slow marquee strip; for many low-content items (logos, tags, short features).
Grounding hook: quote the section's item count + current column count + content weight ("6 items, 3-col cards, ~40 words each — editorial-rows would give each room; ledger-table would compress to a scannable unit").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X steps/list — "what else besides a numbered stack?"  [structural · generated variants]
Applies-when: audit detected a sequence section — ordinal markers, an ol tag, or step-labelled siblings.
Options (5) — every variant MUST reuse each step's real order, headings, and body copy verbatim:
- checklist-compact — dense single column; check glyphs replace ordinals; 8–12px row gaps; halves the section's height; for 5+ short steps.
- milestone-row — all steps in one horizontal row of equal columns, connector arrows between; reads as a pipeline.
- ladder-rail — a vertical connector line with numbered nodes; steps hang right of the rail; ordinals at 2× body size.
- zigzag-path — steps alternate left/right down the page with a connector snaking between; implies a journey, costs height.
- numeral-ledge — ordinals blow up to 4–6× body and sit behind each step's copy as a graphic layer; steps stack full-width; poster read.
Grounding hook: quote count + current layout ("4 steps in a 4-col row, ~15 words each — ladder-rail would stack them on one spine; numeral-ledge makes the ordinals the design").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X comparison-table — "what else besides a check matrix?"  [structural · generated variants]
Applies-when: audit detected a real or implicit table comparing 2–4 columns across labelled rows.
Options (4) — every variant MUST reuse the real row labels, column names, and cell values verbatim:
- delta-list — only rows that differ survive, each as one line naming which column has it; matching rows compress to a footnote count.
- duel-split — a center spine of row labels with the two compared columns flanking left/right; for exactly-2 comparisons.
- verdict-cards — each compared column becomes a standalone card listing only its included rows; per-option read instead of per-row.
- stripe-matrix — the matrix stays but gains a sticky label column, zebra rows, and row hover; for 6+ rows of dense cells.
Grounding hook: quote dimensions ("3 columns × 11 rows, 7 rows identical across all — delta-list would cut it to the 4 rows that actually differ").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X pricing-table — "what else besides side-by-side plans?"  [structural · generated variants]
Applies-when: audit detected sibling plan columns, each carrying a price numeral, feature list, and CTA.
Options (5) — every variant MUST reuse the real plan names, prices, feature lists, and CTA copy verbatim:
- ladder-rows — plans become stacked full-width rows; price right-aligned in mono numerals; features run inline; rate-sheet read.
- anchor-duo — two plans at 50/50; remaining tiers fold into a disclosure row beneath; sharpens the either/or.
- single-spotlight — one plan full-width with its complete feature list; other plans compress to a one-line switcher above.
- price-monument — the lead price renders at display scale center-page, features in two thin columns beneath; other plans as compact cards below.
- feature-matrix — plans become matrix columns: features as rows, check glyphs per plan, price row pinned on top; for 3+ plans with long lists.
Grounding hook: quote plan facts ("3 plans, 9 features each, middle one highlighted — anchor-duo would drop to 2 + a disclosure; feature-matrix turns 27 list items into one grid").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X quote/proof — "what else besides a block quote?"  [structural · generated variants]
Applies-when: audit detected quoted testimony — a blockquote, quotation glyphs, an attribution cluster.
Options (4) — every variant MUST reuse the real quote text, names, roles, and portrait assets verbatim:
- dossier-row — quote left, a fact column right (name, role, one metric pulled from the quote's own claim) split by a hairline; evidence read.
- pull-monument — one quote at 2–3× body with oversized quotation glyphs as a background layer; attribution in small caps beneath.
- portrait-flank — 1/3–2/3 split; the speaker's portrait fills the narrow side full-bleed; quote and attribution in the wide side.
- quote-mosaic — 2–3 columns of short quote cards at varied heights, attribution per card; for 4+ quotes of ≤40 words.
Grounding hook: quote the inventory ("1 quote, 38 words, name + role, no photo — pull-monument scales what exists; portrait-flank needs an asset the page would have to add").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X logo-wall — "what else besides a row of marks?"  [structural · generated variants]
Applies-when: audit detected 4+ sibling brand marks with near-zero text.
Options (4) — every variant MUST reuse the real mark images and any kicker line verbatim:
- strip-run — one tight row, marks normalized to 24–32px height, equal gaps, kicker line above; the quietest treatment.
- grid-plate — marks centered in hairline-bordered cells forming a lattice, 3–5 columns; the lattice does the design work.
- count-claim — a numeral claim line at stat scale leads, built from the audited mark count; marks shrink to supporting texture beneath.
- pair-caption — each mark pairs with a one-line fact in a two-column list; slower read, more weight per mark; for ≤6 marks.
Grounding hook: quote count + treatment ("7 marks at mixed heights, no kicker line — strip-run normalizes them to one 28px row; count-claim leads with the 7 itself").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X faq — "what else besides an accordion?"  [structural · generated variants]
Applies-when: audit detected 4+ question/answer pairs, collapsible or stacked.
Options (4) — every variant MUST reuse the real questions and answers verbatim, order preserved unless stated:
- open-ledger — every answer visible, zero toggles; questions as bold lead-ins, answers indented; for ≤6 short answers.
- spotlight-rest — the first 2–3 questions render open at full width; the rest compress into a plain accordion beneath.
- twin-column — open question/answer cards flow into two columns; halves scroll length; for 8+ items with short answers.
- index-jump — a question index on top anchors to full answers below; the index doubles as a table of contents; for 10+ long answers.
Grounding hook: quote item stats ("9 questions, answers ~60 words, all collapsed — open-ledger adds ~540 words of page; index-jump keeps one screen of questions").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X stats — "what else besides a numeral row?"  [structural · generated variants]
Applies-when: audit detected 2–5 large-numeral + short-label clusters.
Options (4) — quietest→loudest; every variant MUST reuse the real numerals and labels verbatim:
- plate-cells — stats in hairline-bordered cells sharing edges; numeral top-left, label bottom-right; ledger read.
- graph-hint — each stat gains a small CSS-drawn bar or spark shape under the numeral; for trend- or share-flavored numbers.
- lead-figure — one stat promoted to 2× the others' scale, the rest stacked in a column beside it; hierarchy instead of parity.
- counter-band — a full-width tinted or dark band; numerals at display scale in one row, labels in small caps beneath; the loudest treatment.
Grounding hook: quote the values ("4 stats in one row, equal size, all percentages — lead-figure would promote one; graph-hint gives the percentages shape").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X split — "what else besides half-and-half?"  [structural · generated variants]
Applies-when: audit detected a two-child section — one copy cluster, one media block, side by side.
Options (4) — every variant MUST reuse the real copy, CTA, and media assets verbatim:
- ratio-shift — 50/50 becomes 62/38 with copy dominant; media crops taller than wide; reading width leads.
- weave-alternate — consecutive splits alternate media side down the page; gaps stay constant; the familiar zigzag rhythm.
- overlap-stitch — the copy block overlaps the media's edge by 48–96px and floats on top; depth without new assets.
- stack-poster — the split collapses to full width: media as a wide band, copy centered beneath; each pairing becomes a poster unit.
Grounding hook: quote the run ("3 splits, media always right, all 50/50 — weave-alternate breaks the repetition; ratio-shift favors the ~70-word copy blocks").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X cta-band — "what else besides a colored strip?"  [structural · generated variants]
Applies-when: audit detected a short closing section — heading, ≤2 support lines, 1–2 buttons.
Options (4) — quietest→loudest close; every variant MUST reuse the real heading, support line, and button copy verbatim:
- hairline-close — no field at all: one hairline rule, heading left, single button right, one row; for text-led pages.
- split-close — heading left at ~60% width; support line + button stacked right; a two-beat close.
- card-inset — the CTA renders as an inset card floating across the boundary into the previous section (negative top margin); connective.
- field-flood — a full-viewport-width color field; heading at display scale, buttons centered; the loudest close.
Grounding hook: quote the current close ("tinted band, centered heading + 1 button, ~240px tall — hairline-close cuts it to one row; card-inset stitches it to the section above").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X nav — "what else besides a logo-left bar?"  [structural · generated variants]
Applies-when: audit classified the top-of-document navigation bar.
Options (4) — every variant MUST reuse the real logo asset, link labels, link order, and CTA verbatim:
- center-split — links divide into two groups flanking a centered logo; CTA holds the far right; symmetric bar.
- shrink-follow — the bar starts 72–96px tall over the hero and compresses to 48–56px on scroll, gaining a solid or blurred fill; same markup.
- pill-float — the nav detaches into a rounded bar inset 16–24px from the top edge, max-width capped; the page scrolls beneath it.
- side-rail — the nav becomes a fixed left rail, links stacked with labels; content shifts right; app-shell read.
Grounding hook: quote the bar ("logo + 5 links + 1 CTA, static, 64px tall — shrink-follow keeps it present past the fold; side-rail suits the 5 short link labels").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.

### X footer — "what else besides link columns?"  [structural · generated variants]
Applies-when: audit classified the last section as footer.
Options (4) — quietest→loudest; every variant MUST reuse the real link groups, legal line, logo, and social marks verbatim:
- slim-line — one row: logo left, links inline center, legal right; cuts footer height ~70%; for ≤8 destinations.
- stacked-center — one centered column: logo, wrapping link row, social marks, legal line; symmetric sign-off.
- mega-index — full sitemap: 4–5 labelled columns in small caps, a lead row holding logo + one-line pitch; for 15+ links.
- statement-close — an oversized wordmark or claim line at display scale above a thin link row; the footer becomes a sign-off poster.
Grounding hook: quote the inventory ("3 columns × 4 links + a legal line — slim-line fits all 12 inline; mega-index only earns its height with more destinations than this").
Apply: build 3–6 variants as real HTML per preview.md §variants; on pick, replace section markup + port scoped CSS + re-wire reveal hooks per apply.md §structural; ≤768px behavior ships inside every variant.
