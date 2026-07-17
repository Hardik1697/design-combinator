# Motion catalog — M1–M3  [token layer]

Merged from seed registry (dimension keys only; no option values or names carried over):
motion + ease → M1 motion-level · entrance + revealdir + revealstagger → M2 reveal-style ·
hover + fx (partial) → M3 hover-personality (hover effects only; broader scroll and canvas
effects sit inside M1's cinematic level, not a separate dim). Dropped as cosmetic/thin:
marquee, cursor.
Naming, rationale format, and line discipline: references/option-writing.md.

### M1 motion-level  [token · css]
What: the overall amount and character of movement on the page — from fully still to cinematic.
Applies-when: always.
Options (6) — none→cinematic; each names durations, easing, and what MAY move; every level above still collapses to still under @media (prefers-reduced-motion: reduce):
- still — no transitions, reveals, or autoplay; changes are instant. The prefers-reduced-motion floor every level honors. Wins for utility, a11y-first pages.
- functional — 120–180ms ease-out on hover, focus, and open/close only; motion confirms input, nothing decorative. Wins for tools and dashboards.
- gentle — adds one-shot 300–450ms ease-out entrance fades as sections scroll in; easing stays soft, no bounce. Wins for calm marketing.
- lively — 250–400ms with slight overshoot easing (cubic-bezier past 1.0) on entrances and hovers; controls feel springy. Wins for upbeat consumer brands.
- expressive — layered reveals at 400–600ms, staggered children, and parallax on one or two blocks; motion is part of the story. Wins for product launches.
- cinematic — 600–900ms choreographed sequences, pinned/scrubbed scroll, hero video or canvas; movement leads. Wins for showcase pages, at a performance cost.
Grounding hook: quote the audited motion presence — transition durations, easings, scroll-reveal attributes, autoplay ("transitions are 200ms ease on hover only, no scroll reveals — gentle would add entrance fades, still would remove even the hover easing").
Apply: set the motion token(s) — transition duration/easing vars — and add or remove scroll-reveal wiring; every level above still gates behind @media (prefers-reduced-motion: reduce). → apply.md §token.

### M2 reveal-style  [token · css]
What: how elements arrive as they enter the viewport — the entrance mechanic and its staggering.
Applies-when: the audit found scroll-reveal gating, or motion-level is gentle or higher.
Options (8) — quietest→most active; px and ms ranges are per-element:
- plain-fade — opacity 0→1 over 350–500ms ease-out, no movement; the quietest reveal. Wins when layout should stay still and only tone shifts.
- rise-fade — fade plus translateY 16–24px→0 over 400–550ms ease-out; the familiar upward settle. Wins for general marketing sections.
- long-rise — translateY 48–80px→0 with fade over 600–800ms; a slower, weightier arrival. Wins for hero and statement blocks.
- blur-focus — opacity 0→1 plus filter blur(8–12px)→0 over 400–600ms; content resolves into focus. Wins for image-forward pages.
- clip-reveal — a clip-path or mask wipe (inset 100%→0) over 500–700ms; content is uncovered rather than moved. Wins for editorial and typographic reveals.
- scale-settle — scale 0.94→1 plus fade over 350–500ms ease-out; a subtle zoom-in settle. Wins for card and media tiles.
- stagger-cascade — children reveal in sequence at 60–120ms offsets, rise-fade each; the group assembles top-to-bottom. Wins for grids, lists, and stat rows.
- direction-swap — items alternate entrance direction, odd from left / even from right (translateX 24–40px); a woven arrival. Wins for zig-zag feature rows.
Grounding hook: quote the audited reveal attributes and current entrance ("content is gated by [data-reveal] with a fade-up ~24px, no stagger — stagger-cascade would sequence the grid, clip-reveal would swap the motion for a wipe").
Apply: rewrite the reveal keyframes/transition and the initial hidden state on the gated selectors; stagger-cascade sets per-child transition-delay; all gate behind prefers-reduced-motion. → apply.md §token.

### M3 hover-personality  [token · css]
What: how interactive elements respond to the cursor — the feedback character on cards, buttons, and links.
Applies-when: pointer devices; the audit found hoverable cards, buttons, or links.
Options (8) — none→showpiece; durations are per-interaction:
- no-hover — no hover change beyond the browser default; state carried by focus and active only. Wins for touch-first and utility pages.
- tint-shift — background or text nudges 4–8% toward the accent or a darker step over 120–160ms; a quiet acknowledgement. Wins for dense UIs.
- lift-shadow — translateY −2 to −4px plus a shadow deepening (blur +8–16px, opacity +4–6%) over 150–200ms; the tactile float. Wins for cards and tiles.
- press-sink — translateY +1–2px and softening shadow on hover, deeper on active; a physical push-in. Wins for buttons that should feel clickable.
- glow-ring — a soft outer ring in the brand hue grows on hover over 140ms. Instantiate: 0 0 0 3px H at 25–35% opacity. Wins for accent-led CTAs.
- underline-grow — links grow an underline 0→full width (or 1px→2px) over 160–220ms, left-anchored; the reward-on-hover read. Wins for text links and nav.
- scale-pop — scale 1→1.03–1.05 over 140–200ms ease-out on cards or media; a gentle zoom toward the cursor. Wins for gallery and product tiles.
- tilt-parallax — a 3–6° pointer-tracked tilt (rotateX/Y) plus inner-layer parallax; the showpiece hover. Wins for one card; costs JS. (reduced-motion gate)
Grounding hook: quote the audited hover behavior ("cards lift 4px and deepen shadow on hover; links have no hover change — underline-grow would give links a signal, no-hover would flatten the cards for touch").
Apply: rewrite :hover (and :active/:focus-visible) rules on the card/button/link selectors; tilt-parallax adds a JS pointer handler; motion gates behind prefers-reduced-motion. → apply.md §token.
