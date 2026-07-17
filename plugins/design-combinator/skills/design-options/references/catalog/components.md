# Components catalog — K1–K5  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
btn → K1 buttons-and-inputs (widened to form controls: inputs, selects, and textareas share the
control language) · link + arrow → K2 links-and-ctas · kick + badge + mono → K3 labels-and-eyebrows ·
list + icon → K4 lists-and-markers · divider → K5 dividers (glyph-level seams only; architectural
section breaks live in Y1 section-transitions, transitions.md). Dropped as cosmetic/thin: iconset,
avatar, quote-mark; mark folds into T6 emphasis-marks (typography.md).
Naming, rationale format, and line discipline: references/option-writing.md.

### K1 buttons-and-inputs  [token · css]
What: the shared control language — button shape/fill/border and the matching input, select, and textarea treatment that speaks the same dialect.
Applies-when: always; loudest on pages with forms or multiple CTAs.
Options (10) — each defines the button AND its matching input treatment, so both read as one system:
- solid-block — buttons: solid accent fill, no border, S1 radius, 600 weight. Inputs: tinted fill, same radius, accent focus line. A plain, confident pair.
- outline-quiet — buttons: transparent fill, 1.5px accent border, accent label, fill on hover. Inputs: 1.5px border, no fill; a drawn-outline system throughout.
- soft-fill — buttons: accent 12–18% tint fill, accent label, no border. Inputs: same tint fill, borderless, deepens on focus. Low-contrast, gentle controls.
- pill-solid — buttons: full-pill (≥ half height), solid accent, 600 weight. Inputs: matching pill radius, 1px hairline border. Friendly, consumer controls.
- sharp-flat — buttons: radius 0, solid fill or 2px border, label tracked +0.04em. Inputs: radius 0, bottom-edge 1px border only. Editorial, brutalist-leaning.
- underline-field — buttons: label over a 2–3px accent underline, no box. Inputs: bottom-border only, 1px→2px accent on focus. A minimal, form-forward pair.
- raised-key — buttons: solid fill with a hard 3–4px zero-blur offset shadow, sinks on press. Inputs: inset 1px well. Tactile, keyboard-flavored controls.
- glass-control — buttons: translucent fill + backdrop-blur(12px) + 1px hairline. Inputs: matching fill and blur. For controls over media; solid fallback.
- ghost-to-solid — primary buttons solid accent, secondary border-only ghost; inputs stay a neutral 1px line, accent on focus ring. A two-tier hierarchy.
- bracket-key — buttons: label framed by bracket marks or corner ticks, minimal fill. Inputs: matching corner ticks on focus. A terminal, technical dialect.
Grounding hook: quote the audited button shape/fill and input treatment ("primary buttons are solid accent at 8px radius; inputs are a 1px grey box at the same radius — soft-fill would tie them into one tinted system, underline-field would strip both to lines").
Apply: rewrite the button and input/select/textarea selectors together (shape, fill, border, focus) so they share one language; carry hover/focus/active states; glass-control ships a solid @supports fallback. → apply.md §token.

### K2 links-and-ctas  [token · css]
What: how inline links and text-CTAs are marked — underlines, arrows, brackets, or button-like emphasis.
Applies-when: always; richest on link-dense and marketing pages.
Options (8) — quiet→loud link signals:
- underline-steady — links carry a 1px underline at rest, offset 0.15em, skip-ink on, color unchanged; the always-visible link. Wins for text-dense pages.
- underline-grow — no underline at rest; it grows in on hover (0→full over 160ms). Wins when running text should stay uncluttered.
- accent-plain — links take the brand hue, no underline; hover shifts tone. Instantiate: link = H at ≥4.5:1 on P. Wins when color alone reads as link.
- arrow-cta — text-CTAs get a trailing arrow that slides 3–5px on hover; the actionable link. Wins for learn-more-style calls.
- bracket-cta — text-CTAs wrapped in brackets or a leading marker; a framed, technical call. Wins for dev and docs registers.
- button-like — inline CTAs render as small filled or outlined chips, distinct from body links. Wins when a link must read as a clear action mid-copy.
- underline-thick — links get a 2–3px brand-hue underline, offset 0.2em; the mark is the identity. Instantiate: underline = H. Wins for bold editorial links.
- number-linked — sequential or reference links get a small superscript index or leading numeral; a footnote/citation feel. Wins for research and long-form.
Grounding hook: quote the audited link treatment ("body links are accent-colored with no underline; text-CTAs are bare arrows — underline-steady would make links visible in dense copy, button-like would elevate the CTAs").
Apply: rewrite the a / .link / .cta rules (underline, offset, color, hover, ::after arrow); button-like reuses the K1 language at a smaller size; contrast-check any color-only option. → apply.md §token.

### K3 labels-and-eyebrows  [token · css]
What: the small over-line labels — eyebrows, kickers, badges — that sit above headings or tag content.
Applies-when: the audit found eyebrow/kicker text or badges; skip if none exist.
Options (8) — from hard signage caps to soft editorial kickers:
- caps-track — ALL-CAPS 0.75–0.8em, tracking +0.08–0.14em, weight 600; architectural signage. Uses the label/mono face if present. Wins for structured pages.
- mono-label — set in the page's mono face at 0.8em, tracking +0.05em, often lowercase; a spec-sheet tag. Wins for product and technical pages.
- rule-eyebrow — the label preceded by a short 24–40px rule (inline ::before line) in accent or ink. Wins when eyebrows should feel drawn.
- dot-eyebrow — a small leading dot or square (0.5em) before the label. Instantiate: dot = H. Wins for status and category cues.
- pill-badge — label inside a small pill: tinted fill, 0.75em, tracking +0.04em, S1 radius. Instantiate: fill = H at 10–15%. Wins for tags and beta flags.
- numbered-kicker — eyebrows carry a leading index (01 / 02 / 03) in the mono or heading face; implies a sequence. Wins for step and chapter structures.
- serif-italic — eyebrows set in a serif italic at 0.9em, no tracking; a soft kicker instead of hard caps. Wins for warm, magazine registers.
- underline-tag — the label with a 2px accent underline, no caps; a low-key marker. Instantiate: underline = H. Wins when caps feel too loud.
Grounding hook: quote the audited eyebrow/badge treatment and whether a mono/label face exists ("eyebrows are uppercase 700 accent at +0.1em; no mono face loaded — mono-label needs a mono added, numbered-kicker would sequence the sections").
Apply: rewrite the eyebrow/kicker/badge selectors (case, tracking, size, ::before rule/dot/pill); numbered-kicker adds a counter or inline index; pill-badge reuses the S1 radius. → apply.md §token.

### K4 lists-and-markers  [token · css]
What: how list items are marked and spaced — bullet glyphs, numbered treatments, and hanging alignment.
Applies-when: the audit found ul/ol or feature lists.
Options (8) — from stripped markers to structured rows:
- margin-hang — no visible bullet; items hang on a consistent left edge with ~0.75em row gap; the alignment is the marker. Wins for feature and benefit lists.
- accent-dot — a small filled dot marker, 0.4em, baseline-aligned. Instantiate: dot = H. Wins for standard marketing lists.
- check-mark — a check glyph (✓ or SVG) as the marker, accent-colored; an affirmative, benefits read. Instantiate: check = H. Wins for plans and value props.
- dash-list — an en-dash or short rule marker, ink-colored; understated, editorial. Wins for text-led and documentation lists.
- icon-lead — each item leads with a small themed icon in a tinted circle; a richer feature-grid read. Wins when items are distinct capabilities.
- numbered-emphasis — ordered lists get large mono or heading numerals, hanging left at 1.2–1.5em; the count is a design element. Wins for steps and rankings.
- bracket-marker — items marked with a bracket, arrow, or slash glyph; a technical register. Wins for dev, changelog, and spec lists.
- boxed-rows — each item is a tinted or hairline row with padding, not a bullet at all; list-as-stack. Wins for scannable, tappable lists.
Grounding hook: quote the audited list marker and spacing ("feature lists use default disc bullets at tight leading — check-mark would make them read as benefits, margin-hang would strip the glyph for an editorial column").
Apply: rewrite the ul/ol/li rules (list-style, ::marker or ::before glyph, padding, hanging indent); icon-lead and boxed-rows add per-item structure; carry the accent from C3's spread. → apply.md §token.

### K5 dividers  [token · css]
What: the glyph-level separators between blocks — hairlines, short rules, fades, ornaments — at the seam scale.
Applies-when: always. Full section-to-section transitions are a structural dimension (menu entry "section-transitions"), authored in transitions.md and not duplicated here.
Options (8) — from no glyph to a heavy band:
- no-rule — no divider glyphs; separation carried by spacing alone. Wins when the rhythm already reads clearly.
- full-hairline — a 1px full-width rule at ink 8–14% between blocks; the quiet standard separator. Wins for content and list-heavy pages.
- short-center — a centered 40–64px short rule as punctuation between blocks. Instantiate: accent variant = H. Wins for symmetric, centered layouts.
- gradient-fade — a rule that fades to transparent at both ends (linear-gradient hairline); softer than a hard line. Wins when a full rule feels heavy.
- dotted-seam — a dotted or dashed 1px rule; a receipt or ticket-seam texture. Wins for playful and utility registers.
- ornament-glyph — a small centered glyph (✳, §, or a brand dingbat) flanked by short rules; a hand-finished seam. Wins for editorial and craft pages.
- thick-band — a 3–6px solid rule or a short tinted band as the divider. Instantiate: band = H at full chroma or a 12–15% tint. Wins for bold, poster layouts.
- double-hairline — two 1px rules 3–4px apart; a bibliographic, formal seam. Wins for mastheads, quotes, and formal registers.
Grounding hook: quote the audited divider usage ("blocks are separated by full-width 1px hairlines at ink 12% — short-center would swap them for centered punctuation, ornament-glyph would add a craft mark").
Apply: rewrite the hr / .divider / border-top separator rules (or ::before/::after glyph rules); keep these glyph-level — architectural section breaks belong to the section-transitions dimension. → apply.md §token.
