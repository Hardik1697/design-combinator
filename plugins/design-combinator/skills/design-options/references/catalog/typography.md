# Typography catalog — T1–T6  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
type + strong + body → T1 heading-font + T2 body-font · scale + measure → T3 type-scale ·
case + track + hweight → T4 heading-treatment · read + para → T5 body-rhythm ·
emph + bodylink + figures + dropcap → T6 emphasis-marks (dropcap moved here: it is an inline
mark, not a rhythm setting). Dropped as cosmetic/thin: lig, selection.
Naming, rationale format, and line discipline: references/option-writing.md.

### T1 heading-font  [token · concrete]
What: the display/heading face — the loudest single voice decision on the page.
Applies-when: always.
Options (10) — all Google Fonts; each = voice, exemplar face, one-line character:
- didone-drama — Fraunces (soft-didone) or Playfair Display; high-contrast, luxe, editorial.
- oldstyle-humanist — EB Garamond or Crimson Pro; bookish warmth, heritage.
- text-serif-calm — Source Serif 4 or Lora; serious but unshowy; reads product-grade.
- slab-conviction — Bitter or Zilla Slab; sturdy, opinionated, a little retro.
- grotesque-neutral — Archivo or Inter (Display opsz); Swiss, lets content lead.
- geometric-modern — Space Grotesk or Outfit; techy, precise, startup-coded.
- expressive-display — Bricolage Grotesque; quirky width/weight play; memorable, risky.
- condensed-impact — Archivo Condensed or Oswald; poster energy, tall heros.
- mono-display — JetBrains Mono or Space Mono at display sizes; data-product voice.
- round-warm — Nunito Sans or Josefin Sans; friendly, consumer, soft.
Grounding hook: name the current face + its voice class ("your headings are Merriweather — text-serif-calm; didone-drama would sharpen the luxe read, grotesque-neutral would flatten it toward product").
Apply: swap the font var / font-family declaration + add the Google Fonts link or @font-face; carry weights actually used. → apply.md §token.

### T2 body-font  [token · concrete]
What: the running-text face and its pairing logic against the audited heading face.
Applies-when: always.
Options (9) — grouped by voice (sans → serif → slab → mono → suite); each names its pairing strategy relative to the heading choice:
- workhorse-grotesk — Inter or Public Sans; near-invisible neutrality; quiet-workhorse strategy: gives a loud display face (didone, expressive) the whole stage.
- humanist-open — Source Sans 3 or PT Sans; open apertures, warm counters; match-temperature under oldstyle or round headings; thaws a geometric display.
- geometric-echo — DM Sans or Jost; circles-and-lines construction; match-voice with geometric headings; avoid under a didone — two cold voices flatten.
- rounded-consumer — Nunito or Mulish; soft terminals, zero menace; match-temperature with round-warm headings; wins for consumer, community, and kids pages.
- bookish-text — Source Serif 4 or PT Serif; sturdy text serif; match-contrast under a sans heading — warms a product page without going literary.
- oldstyle-flow — EB Garamond or Crimson Pro at text sizes; long-form ease; same-blood under serif headings; wins when reading time is the page's point.
- slab-plain — Roboto Slab 300–400 or Zilla Slab; even color, sturdy; match-contrast under condensed or impact headings; keeps poster pages readable.
- mono-throughout — IBM Plex Mono or Space Mono as the body face; match-voice under mono-display; deliberate friction under a serif heading — zine energy.
- superfamily-suite — take body from the heading's own superfamily (IBM Plex, Source, Roboto, Archivo ship sans+serif+mono); zero-friction, engineered read.
Grounding hook: quote the current body face, weight, and whether it duplicates the heading face ("body is the heading face at 400 — single-face page; bookish-text splits the voices").
Apply: swap the body font-family var/declaration + loading link; carry only the weights the audit found in body roles; leave the heading face untouched. → apply.md §token.

### T3 type-scale  [token · css]
What: the size relationship between display, headings, and body.
Applies-when: always.
Options (8): compact · snug · moderate · relaxed · grand · editorial · giant · monumental
- compact — ~1.15 ratio; dense, product-like. For: dashboards, docs-y pages.
- snug — ~1.2 ratio; headings lead but stay inside the text's world. For: docs, blogs, content apps.
- moderate — ~1.25 ratio; h1 lands ≈3× body across five ranks; balanced marketing register. For: general landing pages.
- relaxed — ~1.333 ratio; display opens real air over body. For: airy landing pages, portfolios with short copy.
- grand — ~1.414 ratio; h1 ≈4× body; the headline is clearly the point. For: hero-led pages with one big claim.
- editorial — dual ratio: ~1.2 inside text ranks, display jumps to 2.5–3× body; magazine hierarchy. For: article-led pages.
- giant — ~1.6 ratio; only 3–4 ranks survive; h1 ≈4–5× body. For: poster pages, single-message heros.
- monumental — display abandons ratio: h1 clamps to 7–9vw, body holds ≤18px, mid-ranks compress. For: manifesto pages, one-screen statements.
Grounding hook: quote current h1 px + body px + computed ratio from audit.
Apply: prefer redefining scale vars; else rewrite the h1/h2/h3/body font-size declarations; wrap display sizes in clamp() so mobile survives. → apply.md §token.

### T4 heading-treatment  [token · css]
What: the case/tracking/weight bundle that sets the headings' posture — same face, different manners.
Applies-when: always.
Options (8): prose-sentence · title-formal · lowercase-casual · airy-light · tight-heavy · caps-compact · smallcaps-heritage · two-register
- prose-sentence — sentence case, tracking 0, weight 600; headings read as written language, not signage. Wins when the copy is conversational.
- title-formal — Title Case, tracking 0 to +0.01em, weight 700; institutional posture. Wins for legal, finance, enterprise registers.
- lowercase-casual — all-lowercase, tracking 0, weight 500–600; indie-product intimacy. Wins for dev tools and personal sites; risky for authority pages.
- airy-light — weight 300–400 at display size, tracking +0.01–0.02em, line-height 1.2; whispered confidence. Only when display ≥40px — thin breaks small.
- tight-heavy — tracking −0.02 to −0.03em, weight 750–850, line-height 1.02–1.08; compressed punch. Wins for short, declarative headlines.
- caps-compact — ALL CAPS one size rank down, tracking +0.08–0.12em, weight 600; architectural signage. Wins for headings of ≤4 words.
- smallcaps-heritage — all-small-caps, tracking +0.05em, weight 500–600; bibliographic gravitas. Needs a face with real small caps — check the loaded family.
- two-register — h1–h2 take tight-heavy, h3+ take caps-compact; a deliberate two-voice system. Wins on long pages that need wayfinding.
Grounding hook: quote the current h1/h2 case, computed letter-spacing, and weight ("h2s are uppercase 700 at +0.05em — caps-compact is already half-present").
Apply: rewrite text-transform / letter-spacing / font-weight / line-height on the heading selectors or their vars; two-register also touches h3+ rules. → apply.md §token.

### T5 body-rhythm  [token · css]
What: the size/leading/paragraph bundle that sets how running text breathes.
Applies-when: always; measure it on the page's longest prose block.
Options (7): dense-utility · steady-read · open-air · book-flow · lede-spotlight · large-print · side-column
- dense-utility — 14–15px, 1.45 leading, 0.5em paragraph gap, 65–75ch measure; app-and-docs read. Wins for reference-heavy pages.
- steady-read — 16px, 1.6 leading, 1em gap, 60–70ch; unremarkable on purpose — the rhythm disappears behind the content.
- open-air — 17–18px, 1.7 leading, 1.25–1.5em gap, 55–65ch; slow, generous read. Wins when each section carries a single idea.
- book-flow — 18px, 1.6 leading, zero gap, 1.5em first-line indent (skipped after headings), 60–66ch; print-novel manner. Wins for essays.
- lede-spotlight — first paragraph per section at 1.2× size and 1.5 leading, the rest at 16px/1.6; magazine lede. Wins when openers are strong copy.
- large-print — 19–20px, 1.65 leading, 1em gap, 55–60ch; wins on short pages, older audiences, glasses-off reading distance.
- side-column — 15px, 1.5 leading, hard 45–55ch cap; built to sit beside media or inside 2-col grids. Wins in split layouts.
Grounding hook: quote body px / line-height / paragraph margin / measure in ch from the audit ("16px at 1.5 over a 78ch measure — the line runs long for the size").
Apply: body font-size + line-height vars, the p margin rules, and the prose max-width measure. → apply.md §token.

### T6 emphasis-marks  [token · css]
What: the inline devices — emphasis, highlights, drop caps, body links — that let single phrases step forward from running text.
Applies-when: always; richest on pages with running prose and inline links.
Options (8): true-italic · weight-step · accent-ink · hand-underline · marker-wash · chip-terms · dropcap-opener · living-links
- true-italic — em/emphasis set in the body face's real italic, no color change; the quietest mark on the page. (stackable)
- weight-step — strong = weight +200 at the same size, ink stays ink; hierarchy carried purely by tone. (stackable)
- accent-ink — strong or key phrases take the accent hue at text weight; only where accent-on-paper holds ≥4.5:1. (stackable)
- hand-underline — key phrases get a 2–3px accent underline, offset 0.15em, skip-ink on; annotated-by-a-person energy. (stackable)
- marker-wash — highlight: accent at 15–25% opacity behind text, 0.1em padding, box-decoration-break: clone. Not with accent-ink on the same run.
- chip-terms — inline key terms in the mono face at 0.85em inside a hairline chip using the page's radius token; spec-sheet voice. (stackable)
- dropcap-opener — 3-line drop cap on the first prose paragraph per section, set in the heading face; initial-letter with a float fallback. (stackable)
- living-links — body links: 1px underline at rest, accent ink + 2px underline on hover; the underline is the signal, color the reward. (stackable)
Grounding hook: quote the current em/strong/a rules from the component inventory ("links are accent-colored with no underline; em falls back to browser italic — no authored marks").
Apply: rewrite the em/strong/mark/a rules; dropcap via ::first-letter behind @supports (initial-letter); marker-wash re-checks text contrast over the wash. → apply.md §token.
