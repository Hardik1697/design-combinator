# Shape & Depth catalog — S1–S4  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
radius → S1 corner-radius · elevation → S2 elevation · borders → S3 borders ·
clip + ring → S4 edge-details (clip-paths and surface rings fold into one low-priority edge layer).
Dropped as an a11y concern (not a restyle): focus — the focus ring is an accessibility
requirement, styled by the a11y layer, never a menu option.
Naming, rationale format, and line discipline: references/option-writing.md.

### S1 corner-radius  [token · css]
What: the corner geometry shared across cards, buttons, inputs, and media — how sharp or soft the page's edges read.
Applies-when: always.
Options (10) — sharp→round; the last four break the single value into per-component rules:
- knife-edge — radius 0 on every surface; cards, buttons, inputs, and media all meet square. Wins for drafting-table, editorial, and data-dense registers.
- hairline-round — 2–3px on all corners; a softening the eye barely registers. Wins for warmth without leaving a technical, product-grade posture.
- desk-round — 4–6px uniform across controls and cards; the unremarkable working curve. Wins when radius should recede and content leads.
- soft-round — 8–12px uniform; friendly, contemporary, not yet playful. Wins for general marketing and SaaS surfaces.
- cushion-round — 16–20px uniform; plush, app-store softness. Wins for consumer and mobile-first pages.
- pillow-round — 24–32px on cards and panels, scaled to 12–16px on small controls; overtly soft. Wins for wellness, kids, and community registers.
- capsule-controls — buttons/inputs/chips go full pill (radius ≥ half their height), cards hold 8–12px. Wins when controls should read as the loud element.
- size-scaled — radius tracks element size: radius = clamp(4px, height × 0.12, 28px), so controls curve tight and hero/media curve wide. One rule, one family.
- arc-top — top corners rounded 16–24px, bottom corners square 0, repeated on cards and media; an asymmetric signature. Wins for one memorable geometry.
- lens-round — 32–48px on media and hero blocks only; controls and cards stay at 6–10px. Wins when imagery is the identity and should read as soft portals.
Grounding hook: quote the audited radius value(s) and whether they are uniform ("cards, buttons, and inputs all sit at a uniform 12px — soft-round is already your world; knife-edge would harden it, capsule-controls would split the controls out").
Apply: redefine the radius token(s); else rewrite border-radius on the inventoried card/button/input/media selectors; size-scaled, capsule-controls, arc-top, and lens-round touch several selectors, not one var. → apply.md §token.

### S2 elevation  [token · css]
What: how surfaces lift off the ground — the shadow language for cards, panels, menus, and floating controls.
Applies-when: always; loudest where the audit found repeated card or panel components.
Options (9) — flat→dramatic; each is a shadow recipe (opacities assume a light ground; on dark grounds shadows read weaker, so lean on the top-edge highlight and halve the cast):
- ground-flush — no box-shadow at all; elements sit flat on the page, separated by border, tint, or spacing. The floor of the scale.
- seam-shadow — one hairline layer: y 1px / blur 1px / spread 0 at ink 5–7%; reads as a drawn seam, not a lift. Wins on dense grids.
- resting-pair — two layers, y 1px/blur 2px + y 2px/blur 6px at ink 6% and 8%; an ambient+direct combo for a grounded resting card.
- lifted-pair — two layers, y 2px/blur 4px + y 8px/blur 16px at ink 7% and 10%; a clear, hover-ready float. Wins for interactive card grids.
- floating-stack — three layers at y 1/6/16px, blur 2/12/28px, opacity ramp 5→8→11%; a graduated stack that reads engineered.
- airborne-drop — one wide soft layer: y 20px / blur 40px / spread −8px at ink 14–18%; the surface is clearly aloft. Needs airy spacing or the page reads heavy.
- theatrical-cast — y 32px / blur 64px / spread −12px at ink 18–24% plus a 1px top-edge highlight; showcase drama for one hero card, not a grid.
- hard-offset — a single hard shadow, zero blur: x/y 4–6px, spread 0, solid ink at 90–100%; graphic, poster conviction with no softness.
- tinted-cast — cast takes the brand hue, not neutral ink: y 12px / blur 32px at 20–30% opacity. Instantiate: shadow = H. Wins for accent-led heroes.
Grounding hook: quote the audited shadow recipe(s) and how many distinct elevations exist ("cards float on one 0 4px 12px layer at 8% ink; there is no second elevation — floating-stack would add a graduated system, ground-flush would remove lift entirely").
Apply: redefine the shadow token(s) or rewrite box-shadow on the card/panel/menu selectors; carry hover elevations the audit found; on dark grounds swap ink cast for the top-edge highlight. → apply.md §token.

### S3 borders  [token · css]
What: the outline language — whether surfaces are drawn with lines, and how heavy or tinted those lines run.
Applies-when: always.
Options (8) — none→heavy, with two tinted archetypes and two structured frames:
- no-outline — no borders anywhere; separation carried by shadow, tint, or spacing alone. Wins when the page already reads busy.
- hairline-draw — 1px lines at ink 8–14% opacity on cards, inputs, and dividers; drawn, not lifted. Wins on dense grids where stacked shadows go muddy.
- solid-ink — 1px solid line at ink 60–80% opacity; a confident, visible edge. Wins for editorial and form-heavy pages.
- weighted-frame — 2–3px solid ink border, radius held; the surface reads as a deliberate plate. Wins for poster and brutalist-leaning registers.
- tinted-edge — borders take the brand hue at low chroma, not neutral ink. Instantiate: border = H at 20–35% opacity. Wins for quiet color everywhere.
- accent-hairline — three sides a 1px ink line at 10%, one signal edge (top/left) 2px at full chroma. Instantiate: signal edge = H. Wins for status cues.
- double-rule — two stacked lines, 1px + 1px with a 2–3px gap (border + outline or inset shadow); a bibliographic, formal frame. Wins for quotes and mastheads.
- bracket-corners — no full border; short 10–16px rules at each corner only, via pseudo-elements. Wins as a viewfinder motif on featured cards.
Grounding hook: quote the audited border presence, width, style, and color relationship ("inputs carry a 1px solid line at ink 20%, cards have none — hairline-draw would unify them, weighted-frame would make the cards assertive").
Apply: redefine the border token(s) or rewrite the border/outline rules on the inventoried card/input/divider selectors; bracket-corners and double-rule add pseudo-element rules. → apply.md §token.

### S4 edge-details  [token · css]
What: the playful cut-and-carve treatments on a surface's edge — notches, scallops, rings, inset outlines — a low-priority signature layer.
Applies-when: optional; richest on featured cards, tickets, badges, or hero panels; skip on text-led pages.
Options (8) — from the deliberate absence outward; each is one distinct geometry:
- bare-edge — no edge treatment at all; the S1 corner radius is the whole story. The deliberate absence.
- cut-corner — one or two corners sliced flat at 45° via clip-path polygon (12–20px cut); an engineered, badge-like signature.
- notch-bite — a single semicircular notch cut from one edge via radial mask (16–24px); tab or dog-tag energy on featured cards.
- ticket-scallop — repeated small semicircles along one edge via repeating radial mask (8–12px pitch); a torn-ticket or coupon motif.
- surface-ring — a second outline floating 3–5px inside the edge (inset shadow or ::after border); framed, gallery-label formality.
- inset-outline — a 1px line offset 6–10px inward on all sides, echoing the shape; a matted-print inset that reads quieter than surface-ring.
- corner-fold — one corner rendered as a folded page, two triangles via pseudo-elements (20–28px); a dog-eared, saved-item cue.
- perforation-line — a dotted or dashed rule inset just below the top edge or between header and body; a form/receipt seam. (stackable)
Grounding hook: quote whether the audit found any clip-path, mask, or pseudo-element edge treatment today ("no edge details — every card is a plain rounded rectangle; cut-corner or ticket-scallop would add one signature without touching the palette").
Apply: add clip-path/mask or ::before/::after rules to the featured-card selectors; keep the treatment on a modifier class so only chosen blocks carry it. → apply.md §token.
