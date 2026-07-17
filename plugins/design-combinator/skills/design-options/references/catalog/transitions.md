# Transitions catalog — Y1  [structural layer]

Single dimension: what happens at the seam between two sections. Variants are generated as
real HTML/CSS boundary pairs, never token flips — this file rides the structural pipeline
(preview.md §variants → apply.md §structural), not the token path.
Naming, rationale format, and line discipline: references/option-writing.md.

### Y1 section-transitions  [structural · generated variants]
What: what happens at the boundary between two sections — replaces hard breaks.
Applies-when: always (audit lists the section boundaries; user may scope to specific ones).
Options (6):
- color-field-shift — adjacent section takes a tinted/dark field; the boundary IS the color change; no rule needed.
- diagonal-cut — clip-path slice (2–4deg) on the leading edge; energy, motion; use once or twice, not everywhere.
- curve-wave — soft SVG curve between fields; friendly, consumer; pairs with round-warm shapes.
- overlap-pullup — the next section's lead card pulls up (negative margin) across the boundary; connective, premium.
- texture-band — a thin band of grain/pattern/brand-glyph repeats at the seam; craft signal.
- gradient-fade — paper tones cross-fade over 80–160px; the quietest option; near-invisible by design.
Grounding hook: name the current break style + count ("you have 7 hard hairline breaks; overlap-pullup at hero→proof plus color-field at final CTA would…").
Apply: variants page renders boundary PAIRS (bottom of section A + top of section B) per preview.md; on pick, apply per boundary per apply.md §structural.
