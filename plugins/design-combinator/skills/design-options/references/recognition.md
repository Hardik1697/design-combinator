# Recognition registry — section-family classification for the audit

How the audit names what it sees. Classification is by STRUCTURAL SIGNATURE ONLY — never by
class names (class names are minified, framework-generated, or lie). Signals, in priority
order:
1. repetition patterns — N similar siblings at the same depth
2. landmark roles/tags — nav, header, footer, main, aside, form, table, video, iframe
3. DOM shape — depth, branching factor, text-to-markup ratio
4. position in document order — first, last, above/below the fold line
5. media density — img/svg/video count per block

Output contract: every classified section in the audit's section map gets family + confidence (high/med/low) + morphable yes/no + a one-line description; low-confidence and unknown sections are still listed with a best-guess description — the menu never silently skips page content.

Morphable families (13) point to catalog/morphology.md for their variant sets. Recognize-only
families still appear in the map and in the menu's closing footnote — no variant set in v1.
Tie-breaks: when two signatures both fit, the family whose Confusable-with note names the
other wins only if its Confidence boosts are present; otherwise classify as the simpler
family at med confidence. Voice and line discipline: references/option-writing.md.

## Families (canonical order)

### hero  [morphable: yes → morphology.md]
Signature: first content block after nav in document order; tallest section on the page,
often near viewport height; carries the page's largest heading, ≤2 short paragraphs, and
1–2 CTAs; shallow tree with one dominant text cluster, often one large img/video/canvas
sibling. Confidence boosts: an h1; the page's maximum font-size; viewport-height sizing.
Confusable with: cta-band (same shape, but position decides — first is hero, last is cta-band).

### card-grid  [morphable: yes → morphology.md]
Signature: 3+ similar siblings at equal depth, each a self-contained cluster — optional
media, short heading, 1–3 lines of text, sometimes a link; parent lays them in 2–4 columns;
mid-range text-to-markup ratio. Confidence boosts: identical tag sequence per sibling; item
count divisible by column count. Confusable with: pricing-table (price numeral + per-item
CTA), logo-wall (media-only, near-zero text), steps/list (carries ordering signals).

### split  [morphable: yes → morphology.md]
Signature: exactly 2 children side by side — one text cluster (heading, paragraphs, CTA) and
one media block — at roughly half-and-half widths; often repeats down the page with sides
alternating. Confidence boosts: consecutive sections with mirrored child order; exactly one
img/video per section. Confusable with: hero (a split-shaped FIRST section is hero — position
wins), sidebar (narrow utility column, not an equal media half).

### steps/list  [morphable: yes → morphology.md]
Signature: 3–6 similar siblings carrying sequence markers — ordinal numerals, an ol tag, or
step-shaped short labels; stacked vertically or in one numbered row; each item is a heading
plus 1–2 lines. Confidence boosts: an ol tag; visible 1/2/3 numerals; arrow or connector
glyphs between items. Confusable with: card-grid (peers with no ordering signal — the
sequence marker is the whole difference).

### comparison-table  [morphable: yes → morphology.md]
Signature: a real table tag, or an implicit one — a row-repeating grid where each row leads
with a text label and the following cells hold check/cross glyphs or short values; column
heads name the 2–4 things compared. Confidence boosts: check/cross glyph density; a th row;
4+ rows sharing one shape. Confusable with: pricing-table (its columns each carry a price
numeral and a CTA; comparison rows carry features).

### pricing-table  [morphable: yes → morphology.md]
Signature: 2–4 similar sibling columns/cards; each contains a short label, a prominent
numeral (currency glyph or superscript), a <ul>-like feature list, and exactly one CTA;
usually lower-middle of the page. Distinguish from card-grid: numeral + per-item CTA.
Confidence boosts: currency symbols; a highlighted middle sibling. Confusable with:
comparison-table (that one is a real/implicit table with row labels).

### quote/proof  [morphable: yes → morphology.md]
Signature: a blockquote tag, or a text block wrapped in quotation glyphs; text-to-markup
ratio high for its size; an attribution cluster nearby — small text plus an optional
portrait-aspect img; appears once or as 2–3 siblings. Confidence boosts: quotation glyphs;
a cite or figcaption tag; a person-portrait image. Confusable with: social-proof-strip (a
thin row of ratings/counts/badges, not full quoted sentences).

### logo-wall  [morphable: yes → morphology.md]
Signature: 4–10 sibling img/svg elements with near-zero text between them, similar rendered
heights, in one row or a shallow grid; media density is the tell — images per child near 1,
words per child near 0. Confidence boosts: a 3–6 word kicker line above the marks; uniform
image heights; muted/grayscale styling. Confusable with: gallery/masonry (larger images,
varied aspect ratios, no kicker pattern).

### faq  [morphable: yes → morphology.md]
Signature: 4+ repeated pairs of question-shaped text (most headings end in a question mark)
plus a collapsible or initially-hidden answer body; details/summary tags or button-per-heading
with hidden siblings; low media density. Confidence boosts: question marks in most item
headings; details tags; aria-expanded attributes. Confusable with: tabs/accordion (general
content panels with no question-mark pattern).

### stats  [morphable: yes → morphology.md]
Signature: 2–5 short sibling clusters, each dominated by a large numeral — digits with %, +,
× or unit suffixes — over a 2–6 word label; very low total text volume; shallow depth;
usually one row. Confidence boosts: digit-leading text nodes; numeral font-size ≥2× body;
plus/percent glyphs. Confusable with: pricing-table (currency glyph and a CTA per item —
stats have no CTA), social-proof-strip (tiny mixed one-liner, not a section of its own).

### cta-band  [morphable: yes → morphology.md]
Signature: a short full-width block low in document order — one heading, ≤2 lines of support
text, 1–2 buttons, nothing else; often a contrasting background field; tree depth of 2–3
levels only. Confidence boosts: last content section before footer; imperative verb-led
heading; buttons outweigh text. Confusable with: hero (same shape — document position
decides), form/lead-capture (that one contains inputs, not just buttons).

### nav  [morphable: yes → morphology.md]
Signature: a nav tag or header-first block at the top of document order — one logo-shaped
img/svg plus a flat row of 3–7 short links (1–2 words each), often one styled CTA link;
sticky or fixed positioning common. Confidence boosts: nav/header landmarks; link text under
15 characters each; position at document top. Confusable with: breadcrumb (a single trail of
links with separator glyphs, below the header, no logo).

### mega-menu  [morphable: no — recognize-only v1]
Signature: a hidden or hover/click-revealed panel inside the nav subtree, wider than a
dropdown — 2–4 columns of 3–8 links each, group labels over the clusters, sometimes small
media; found only by walking the nav's hidden children. Confidence boosts: hidden multi-column
panels inside nav; group labels over link clusters. Confusable with: nav itself (the mega-menu
is the bar's child panel, not the bar).
Best-guess line for the map: "expandable menu panel inside nav, N link groups".

### footer  [morphable: yes → morphology.md]
Signature: a footer tag or the last block in document order; 2–5 columns of short links plus
a legal/small-print line; often a repeated logo and a social-icon cluster; high link density,
low media. Confidence boosts: footer landmark; copyright glyph; the page's smallest font
sizes. Confusable with: cta-band (sits just above the footer; carries a heading and buttons,
not link columns).

### carousel/slider  [morphable: no — recognize-only v1]
Signature: overflow container wider than viewport with N similar slides in a row; prev/next
buttons or dot indicators as siblings; often transform/translate inline styles.
Best-guess line for the map: "auto-advancing slider, N slides, mixed media".

### form/lead-capture  [morphable: no — recognize-only v1]
Signature: a form tag, or an input cluster — 1–6 labeled inputs plus exactly one submit
control; inline (single email field + button) or stacked; often paired with a short pitch
heading. Confidence boosts: input/select/textarea tags; a submit-type button; label-input
pairing. Confusable with: cta-band (buttons but no inputs).
Best-guess line for the map: "lead-capture form, N fields, inline or stacked".

### gallery/masonry  [morphable: no — recognize-only v1]
Signature: 6+ img siblings with little or no text; varied aspect ratios or varied rendered
heights across columns; roughly one image per child; images far larger than brand-mark size.
Confidence boosts: mixed aspect ratios; link wrappers around every image; column-flow layout.
Confusable with: logo-wall (small uniform-height marks with a kicker line).
Best-guess line for the map: "image gallery, N images, mixed aspect ratios".

### banner/announcement  [morphable: no — recognize-only v1]
Signature: a one-line block above the nav in document order — a single short text node
(≤20 words), optionally one link and a dismiss control; minimal height; tree depth of 1–2
levels. Confidence boosts: first element in the body; a dismiss button; a single text node.
Confusable with: nav (carries a logo and multiple links — the banner has one line).
Best-guess line for the map: "announcement bar above nav, one line plus link".

### tabs/accordion  [morphable: no — recognize-only v1]
Signature: a row or stack of 2–6 short trigger controls where exactly one sibling panel is
visible and the rest are hidden; trigger count equals panel count; panels are content-heavy
relative to their triggers. Confidence boosts: aria-selected or aria-expanded attributes;
equal trigger/panel counts; one visible panel among hidden peers. Confusable with: faq
(question-mark headings, every item independently collapsible).
Best-guess line for the map: "tabbed/accordion content, N panels".

### video-embed  [morphable: no — recognize-only v1]
Signature: a video tag or a player iframe dominating its section's area; a box near 16:9
aspect; little surrounding text beyond an optional heading; a play-button overlay is common.
Confidence boosts: video/iframe tags; a poster image; aspect ratio near 16:9. Confusable
with: hero (a video-backed FIRST section is hero — position and heading weight win).
Best-guess line for the map: "video embed, 16:9 player plus heading".

### article/prose  [morphable: no — recognize-only v1]
Signature: a long run of sibling paragraph tags — text-to-markup ratio far above any other
family; h2/h3 headings interleaved; few or no buttons; a reading-width column. Confidence
boosts: an article tag; 300+ words in one container; paragraph count of 5+. Confusable with:
faq (prose broken into toggled question/answer pairs — an article's paragraphs are all
visible).
Best-guess line for the map: "long-form prose, ~N words, M subheadings".

### sidebar  [morphable: no — recognize-only v1]
Signature: an aside tag, or a narrow column beside a wider main column (width split roughly
1:2 to 1:3); holds secondary clusters — link lists, small CTAs, table-of-contents anchors;
persists while the main column scrolls. Confidence boosts: aside landmark; sticky positioning;
width under one-third of the parent. Confusable with: split (two equal halves, one of them
media — a sidebar is narrow and utility-flavored).
Best-guess line for the map: "sidebar column, N link/utility blocks".

### breadcrumb  [morphable: no — recognize-only v1]
Signature: a single flat row of 2–5 short links joined by separator glyphs (slash, chevron),
directly under the header; the final item is often plain text, not a link; the page's
smallest link type. Confidence boosts: separator glyphs between every link; position directly
below the header; final item unlinked. Confusable with: nav (carries a logo and a CTA — the
trail has neither).
Best-guess line for the map: "breadcrumb trail, N levels".

### map/embed  [morphable: no — recognize-only v1]
Signature: an iframe pointed at a mapping service, or a canvas/img styled as a tile grid,
usually beside or below address-shaped text (street/city/postal patterns); little other
content in the section. Confidence boosts: an iframe with pan/zoom controls; address text
nearby; a pin-shaped svg. Confusable with: video-embed (also iframe-led — aspect ratio and
the address text decide).
Best-guess line for the map: "embedded map plus address block".

### social-proof-strip  [morphable: no — recognize-only v1]
Signature: a thin single-row block mixing small numerals and marks — star glyphs, rating
numbers, review counts, award badges — with text fragments of ≤10 words per item; far
shorter than a stats section; usually adjacent to the hero or a CTA. Confidence boosts: star
glyph runs; rating-shaped decimals; 3+ tiny mixed items in one row. Confusable with: stats
(large numerals with labels in a section of its own — the strip is a one-liner).
Best-guess line for the map: "proof strip — ratings, counts, badges in one row".

### unknown  [morphable: no — fallback]
No structural signature possible by definition — this is the fallback when no other family's
signature matches. Always low confidence. Always still listed in the section map with a
best-guess one-line description built from what IS observable (child count, media density,
text volume, document position) — never dropped from the map or the menu footnote.
