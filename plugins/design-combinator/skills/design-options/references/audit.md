# audit.md — audit recipe

Produces `.design-options/audit.md`, the grounding source for every rationale and the
persisted menu numbering. Section classification uses `references/recognition.md` — read it
before writing the section map.

## Input acquisition — local mode

1. Read the target HTML file directly.
2. Read every linked CSS file (`<link rel=stylesheet>`, local `@import`).
3. Skim linked JS for selectors/hooks that touch each section (nav anchors, reveal triggers,
   data-* attribute reads) — feeds the component inventory and the apply re-wire checklist.
4. Screenshot: optional but preferred (see Screenshot sub-step below).

## Input acquisition — remote mode  §remote-fetch

Numbered recipe, run in order, all output into the staging dir:

1. Create the staging dir (local: `<target-dir>/.design-options/`; remote:
   `<scratchpad>/design-options/<host-slug>/`). All fetch output lands there.
2. playwright-cli: open the URL, viewport 1440×900, wait for network-idle plus a settle delay.
   Inject the force-reveal block AND `*{animation:none!important;transition:none!important}`
   (live sites are reveal-gated too — same gotcha as local capture). Scroll the full page once
   to trigger lazy-load, then return to top.
3. Save:
   - Rendered DOM (`document.documentElement.outerHTML`) → `page.html` — rewrite relative
     asset URLs to absolute against the origin.
   - Full-page screenshot → `shots/current.png`.
   - Second capture at 390×844 → `shots/current-mobile.png` (responsive identity is part of
     the audit).
4. Styles, best-effort ladder — try each rung; a lower rung can still fill gaps a higher rung
   couldn't reach:
   - (i) Download every same-readable `<link rel=stylesheet>` → `styles/*.css`.
   - (ii) For cross-origin/unreadable sheets, pull rule text from `document.styleSheets`
     where accessible.
   - (iii) Fallback — extract **computed styles** for one representative element per audited
     role (body, h1/h2/h3, p, a, primary/secondary button, card, nav, footer, section
     wrappers), token-relevant properties only: color, background, font-*, letter-spacing,
     line-height, border-radius, box-shadow, border, padding, margin, gap, max-width,
     transition → `computed.md`. Also dump `:root` custom properties via
     `getComputedStyle(document.documentElement)`.
5. Record fetch provenance in `.design-options/audit.md`: URL, date, viewport, which ladder
   rung supplied styles. Rationales must not overclaim precision beyond the rung actually
   used — a computed-style-only audit gets a fidelity caveat wherever it's cited.

From here the audit is **mode-blind**: read the staged copy exactly like local source. Every
step below applies identically to local and remote.

## Screenshot sub-step

- Local: optional, preferred. Remote: already produced by the fetch (step 3 above).
- Recipe: `scripts/serve.sh` → playwright-cli full-page capture with the force-reveal block
  and the animation-freeze rule injected → save to `.design-options/shots/current.png`.
- Use: sanity-check the source-derived audit (rendered palette vs CSS literals) and
  disambiguate low-confidence section classifications (e.g. carousel vs card-grid). Never the
  sole source of truth — source-grounded first, screenshot-confirmed second.

## Output — `.design-options/audit.md`, five blocks

1. **Identity summary** (3–4 lines) — voice, palette logic, shape language, motion character.
   Write this last, derived from the blocks below. Remote mode adds one line: "remote target —
   picks will be exported, not applied in place."
2. **Token inventory** (mechanical extraction):
   - CSS custom properties: grep `--[a-zA-Z-]+\s*:` in `:root`/`html` blocks → name, value.
   - Fonts: `font-family` declarations + `@font-face`/`<link>` loads → faces, weights, roles
     (heading/body/mono), classified into T1's voice classes.
   - Type scale: h1/h2/h3/body sizes → computed ratio.
   - Palette: every hex/rgb/hsl/oklch literal, frequency-ranked → dominant brand hue H, paper
     P, ink, accent count.
   - Shape: radius values, box-shadow recipes, border widths/styles.
   - Space: section paddings, container max-width, grid gaps → rhythm classification.
   - Motion: transition/animation/scroll-reveal presence, easing values, and any
     `[data-reveal]`-style gating attributes (feeds the force-reveal step above).
   - Theming: existing dark-mode support (`prefers-color-scheme`, `[data-theme]`) and
     breakpoints in use — C2 dark archetypes and structural variants must respect both.
3. **Section map** — every top-level `<section>`/landmark, classified per
   `references/recognition.md`: heading text, family, confidence (high/med/low), morphable
   yes/no, one-line description (mandatory when confidence is low or family is unknown), item
   counts, boundary style to the next section. Nothing on the page is omitted. Feeds the
   dynamic X-entries, Y1, and the menu's "Also on this page" footnote.
4. **Component inventory** — buttons (shape/fill), links, badges/eyebrows, list markers,
   dividers, each with the selectors that style them (feeds apply).
5. **The menu, numbered and annotated** — the exact menu printed to the user, so later turns
   ("open 12", "more for 29") resolve numbers without re-derivation. Numbering persists across
   turns and sessions once written here.

## Rendering gotchas (hard-learned — also in preview.md)

- **file:// is blocked** for playwright screenshots → always serve over http via
  `scripts/serve.sh`, never open a `file://` URL for capture.
- **Reveal-gated content captures blank** → always inject the force-reveal block before any
  capture:
  ```css
  [data-reveal],[data-animate],.reveal{opacity:1!important;transform:none!important;visibility:visible!important}
  ```
  For captures also inject `*{animation:none!important;transition:none!important}`.
- Screenshots are saved only inside `.design-options/shots/` — never outside the project.

## Grounding contract

Every option rationale MUST reference at least one audit fact by value ("your radius is a
uniform 12px", "your 7 breaks are all hairlines"). `option-writing.md` enforces the format:
`**name** — <audit fact> → <what changes> (<when it wins>)`.
