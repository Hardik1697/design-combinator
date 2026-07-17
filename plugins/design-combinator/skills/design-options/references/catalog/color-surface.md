# Color & Surface catalog — C1–C6  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
accent + contrast → C1 color-scheme (contrast folded in, per the registry's own overlap note) ·
paper + theme → C2 background-tone (theme becomes the dim/dark archetypes) ·
accentuse → C3 accent-spread · surface + glass → C4 surface-treatment ·
grain + pattern + texture → C5 texture · img + plate → C6 imagery-treatment.
Dropped as cosmetic/thin: selection, scrollbar, mark, quote-mark.
Colors exist ONLY as formulas against audit values (H = dominant brand hue, P = paper tone,
ink = text ramp) — never fixed values. Naming and rationale rules: references/option-writing.md.

### C1 color-scheme  [token · archetype]
What: the accent/paper relationship — the page's whole color logic.
Applies-when: always.
Options (8) — each instantiated from the audit's dominant brand hue H and paper tone P:
- monochrome-ink — kill accents; near-black + one grey ramp; hierarchy via weight/size only. Instantiate: set accent vars to the ink ramp.
- single-accent — H everywhere an accent appears; remove any secondary hue. Instantiate: collapse accent vars to H.
- complement-pop — H stays primary; a complementary pop (rotate H 150–180°, chroma-matched to P's warmth) reserved for CTAs + emphasis marks only.
- analogous-tonal — H plus a ±30° neighbor; quiet, ramped, editorial. Instantiate: neighbor at ~70% of H's chroma.
- warm-paper-cool-ink — shift P warm (2–4% toward H's hue), cool the ink ramp; accents unchanged. Cozy-professional.
- dark-inversion — deep near-black of H's hue family becomes ground; P and ink flip; brighten accents +15–25 L for contrast (check ≥4.5:1).
- drenched-field — one section-scale field of H (hero or final CTA); everything else restrained to ink + P.
- muted-editorial — desaturate all hues ~40%; hierarchy carried by type; H survives only as thin rules and small marks.
Grounding hook: name H (from audit's frequency-ranked palette), where it currently appears, and the current accent count.
Apply: redefine the accent/paper CSS vars found in audit; if none exist, introduce a :root block and swap top literal occurrences. → apply.md §token. Verify contrast on dark-inversion/drenched-field.

### C2 background-tone  [token · archetype]
What: the paper archetype — what the page physically sits on, before any accent decision.
Applies-when: always.
Options (8) — light→dark; every option instantiates against H and the audited paper P:
- gallery-white — untinted maximum-light ground; imagery and accents pop hardest. Instantiate: P to hue-free lightness 100%; ink and accents as audited.
- warm-linen — paper with a sunlit cast; hospitable, print-adjacent. Instantiate: tint P 2–4% toward 45–70° at lightness 97–98%; nudge ink 1–2% the same way.
- cool-slate — lab-calm, screen-native ground. Instantiate: tint P 2–3% toward 215–240° at lightness 97–98%; keep ink neutral or 1% cooler.
- brand-breath — the page quietly wears its own hue. Instantiate: tint P 3–5% toward H at lightness 96–98%; hold accent-on-P contrast ≥4.5:1.
- paper-shift — two sibling papers alternate by section; banding without borders. Instantiate: second ground = P dropped 3–4 L, hue held.
- dusk-dim — dim mode short of full dark; softer than an inversion. Instantiate: ground at H's hue, 10–20% saturation, lightness 12–16%; ink flips to near-P.
- ink-field — full dark ground in the brand's shadow. Instantiate: ground at lightness 7–10%, H's hue at ≤10% saturation; accents +15–25 L; recheck 4.5:1.
- dark-bookends — first and last sections go dark, the middle keeps P; theatrical framing. Instantiate: bookends per ink-field; edges from the section map.
Grounding hook: quote P's current value and warmth, plus any existing dark-mode support from the audit's theming block.
Apply: redefine the paper/ground vars; the dark options must reconcile with any prefers-color-scheme/[data-theme] rules the audit found; contrast guardrail after apply. → apply.md §token.

### C3 accent-spread  [token · archetype]
What: how far the accent is allowed to travel — the same hue at six different volumes.
Applies-when: an accent exists in the audit; C1 monochrome-ink removes this dim's subject.
Options (6) — restrained→drenched; each level states exactly where accent may appear:
- thread-accent — accent ONLY as link underlines, 1px rules, and focus rings; no fills, no icons. Wins when type already carries the identity.
- marks-and-ctas — adds the primary CTA fill + inline emphasis marks; everything else stays ink. The one-button-owns-the-color read.
- headline-touch — adds one accented word or phrase per major heading, plus eyebrow labels. Wins when headlines are the page's spine.
- component-wash — adds badges, chips, icons, and card top-borders; tinted component grounds allowed. Instantiate: tint = H at 8–15% opacity over P.
- section-stripe — adds exactly one full accent-field band (hero or final CTA); text inside flips to P. Instantiate: band = H, deepened until P-on-band ≥4.5:1.
- drenched-brand — accent-derived grounds cover 40–60% of sections; P becomes the pause. Instantiate: two grounds from H — 95–97 L tint, 25–35 L deep.
Grounding hook: quote the audited accent count and every place accent currently appears ("one accent, 4 sites: two CTAs, links, one icon set").
Apply: edits where accent vars are CONSUMED, not their values — add or strip consumption sites per the picked level's list; pairs with any C1 scheme except monochrome-ink. → apply.md §token.

### C4 surface-treatment  [token · css]
What: how cards, panels, and media blocks separate from the ground — drawn, tinted, lifted, or cut.
Applies-when: always; loudest where the audit found repeated card or panel components.
Options (8): flush-field · hairline-case · tint-panel · soft-lift · deep-float · frost-veil · recessed-well · offset-plate
- flush-field — no card chrome at all; zoning by spacing and 1px rules only; content sits directly on P. Wins for editorial, text-led pages.
- hairline-case — 1px border of ink at 10–15% opacity, page radius, no shadow; drawn rather than lifted. Wins on dense grids where shadows stack muddy.
- tint-panel — surface = P shifted 2–4 L (or 2–3% toward H), no border, no shadow; the softest zoning. Instantiate: panel = P −2–4 L, hue held.
- soft-lift — shadow 0 1px 2px + 0 8px 24px, ink at 6–10% opacity; the polite float. Hover may deepen to 0 12px 32px.
- deep-float — 0 16px 48px at 12–16% ink opacity; surfaces clearly airborne. Needs airy section spacing or the page reads heavy.
- frost-veil — surface = P at 55–70% opacity + backdrop-filter blur(14–20px) + inner 1px hairline; only over imagery or color fields — on flat P it vanishes.
- recessed-well — surface 2–3 L below P + inset 0 1px 3px ink shadow; for inputs, code, and quotes — things you look INTO rather than at.
- offset-plate — 2px solid ink border + hard 4–6px offset shadow with zero blur, radius 0; print-poster conviction.
Grounding hook: quote the audited card shadow recipe, border, and surface-vs-P relationship ("cards float on 0 4px 12px at 8% ink, no border").
Apply: card/surface vars or the card class rules; carry hover states; frost-veil ships a solid tint-panel fallback behind @supports (backdrop-filter). → apply.md §token.

### C5 texture  [token · css]
What: the material layer under the color — grain, fiber, grids, rules, ornament — or its deliberate absence.
Applies-when: always.
Options (8): bare-field · film-grain · press-fiber · heavy-grain · dot-matrix · graph-grid · ledger-rules · seam-ornament
- bare-field — no texture layer at all; color and type carry everything. Wins when the palette already runs 3+ distinct grounds.
- film-grain — inline-SVG turbulence noise overlay at 2–4% opacity, fixed layer; takes the digital edge off flat fills without announcing itself.
- press-fiber — fractalNoise at low frequency (0.02–0.04), stretched horizontal, 2–3% opacity; paper-stock warmth for print-flavored pages.
- heavy-grain — turbulence at 6–10% opacity plus contrast(1.05); analog, zine, music-page energy. Halve it over photography.
- dot-matrix — radial-gradient dots, 1px on a 16–24px grid, ink at 4–6% opacity; engineering-paper undertone for spec and product pages.
- graph-grid — repeating-linear-gradient hairlines on both axes, 24–48px cells, ink at 3–5% opacity; drafting-table read. Keep off text-dense sections.
- ledger-rules — horizontal hairlines only, 28–36px pitch, ink at 3–4% opacity; notebook discipline. Pairs with tabular or numeric content.
- seam-ornament — one small inline-SVG glyph or flourish repeated at section seams, stroke = ink at 20–30% opacity; hand-finished craft signal.
Grounding hook: quote whether the audit found any texture or background-image layers, and how many flat fills the palette carries ("zero texture layers; five flat grounds").
Apply: a body/section ::before overlay or an extra background-image layer; pointer-events: none; z-index under content; halve opacity on dark grounds (dusk-dim, ink-field). → apply.md §token.

### C6 imagery-treatment  [token · css]
What: how photographs and illustrations are colored and edged — the fastest route to imagery that belongs to the page.
Applies-when: the page carries photographic or illustrative media (audit section map's media counts); skip on text-only pages.
Options (10) — five filters, then five frames; one filter + one frame stack freely (never filter-on-filter or frame-on-frame):
- brand-duotone — grayscale(1), then an overlay of H at 35–50% with mix-blend-mode: color; mixed-source photos join one palette. Instantiate: overlay hue = H.
- silver-mono — grayscale(1) contrast(1.05–1.15); no cast, archival calm. Wins when photo color fights the palette.
- warm-fade — sepia(0.2–0.3) brightness(1.03–1.06) contrast(0.9–0.95); lifted blacks, sun-worn nostalgia. Wins for heritage and lifestyle pages.
- contrast-punch — contrast(1.15–1.3) saturate(1.1–1.2); documentary bite. Wins when photography is strong and the layout stays quiet.
- cool-shift — saturate(0.85–0.95) + an overlay at 8–12% opacity toward 210–240°; screen-lit calm. Instantiate: overlay hue fixed at 210–240°, independent of H.
- frameless-bleed — zero chrome; media meets the grid edge, radius 0 or the page token. Wins when imagery is consistent enough to self-frame.
- hairline-mount — 1px border of ink at 15–25% opacity, page radius; gallery-label discipline that tames mixed media.
- gallery-inset — media inset 12–24px inside a surface panel with a 1px hairline; framed-print formality. Costs space, adds occasion.
- poster-plate — 4–8px solid ink border (accent only at C3 component-wash or louder), radius 0; zine plate energy.
- arch-crown — top corners fully rounded (border-radius 999px 999px 0 0), bottom square; romantic-editorial geometry. Use on portrait-ratio media.
A shadow-only media float belongs to C4 (soft-lift or deep-float applied to the media block) — pick it there, so shadow language lives in one dimension.
Grounding hook: quote media counts per section from the section map plus any img radius/shadow rules from the shape block ("9 photos across 3 sections, mixed temperature, no borders").
Apply: one media rule or utility class per pick; duotone/cool-shift overlays need a positioned wrapper around bare img elements. → apply.md §token.
