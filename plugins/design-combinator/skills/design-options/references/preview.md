# preview.md — preview recipes

Two recipes: the swatch sheet (color/font token dims) and the variants page (structural dims).
Static only — no live-tweak lab. The user compares in their own browser and replies with a
pick; this skill never renders a visual verdict itself.

## Swatch sheet recipe

Triggers when C1 color-scheme, C2 background-tone, T1 heading-font, or T2 body-font is among
the picks — these are the dims genuinely hard to imagine from prose.

1. Build from `assets/swatch-shell.html` into `<staging>/swatches.html`.
2. Specimen content:
   - Color chips derived from the instantiated archetype (per the option's Instantiate:
     clause), one swatch group per picked color option.
   - Heading + lede sample text set in the real proposed fonts, one block per picked font
     option.
3. Self-contained — no target-page duplication, no external requests.
4. Serve via `scripts/serve.sh` and hand the URL to the user. Stop.

## Variants page recipe  §variants

Triggers when a structural dim is among the picks and the user confirms "build preview" (the
Step 3 AskUserQuestion fork). Five steps, in order:

1. `mkdir <staging>/variants` (staging = `<target-dir>/.design-options/` local, or the remote
   staging dir per SKILL.md §3).
2. Build each `vN.html`:
   - `<link>` the page's real stylesheet(s) at the correct relative path from `variants/`.
     Remote mode: link the staged `styles/*.css`, or embed the extracted computed styles when
     stylesheets were unreadable (flag the fidelity caveat).
   - Carry the page's body classes onto `<body>`.
   - Restructure the target section's markup per the option.
   - Add a `<style>` block of variant-scoped overrides, all selectors under `.dov-vN` so
     variants sharing one preview page never bleed into each other.
   - Append the force-reveal block:
     ```css
     [data-reveal],[data-animate],.reveal{opacity:1!important;transform:none!important;visibility:visible!important}
     ```
3. Assemble `preview.html` from `assets/preview-shell.html`:
   - Sticky header: section name + variant count + "reply: apply #N".
   - Viewport-width toggle — **360 / 768 / 1440** — that resizes all iframes together, so
     responsive behavior is part of the comparison, not an afterthought.
   - One labeled full-width `<iframe>` per variant, stacked vertically (side-by-side is too
     narrow at section scale), `loading="lazy"`, each sized to the section (measure pass or a
     generous fixed height).
   - Iframes give style isolation between variants sharing one page — this is why each variant
     links/embeds its own styles rather than sharing one stylesheet scope.
   - Every variant's scoped CSS must include its own ≤768px behavior — a variant that only
     works at desktop is incomplete, not a draft to finish later.
4. Serve:
   - Local: `scripts/serve.sh <project-root>` — serving the project root (not just the staging
     dir) lets the page's own css/img/font paths resolve from `variants/`.
   - Remote: `scripts/serve.sh <staging-dir>` — all assets were staged and image URLs in the
     staged markup were rewritten to absolute origins, so paths resolve the same way.
   - Print the URL, e.g. `http://localhost:<port>/…/.design-options/preview.html`.
5. Optional: contact-sheet screenshot via playwright-cli, for the conversation record only —
   the URL is the real deliverable, not the screenshot.

## Rendering gotchas (hard-learned — also in audit.md)

- **file:// is blocked** for playwright screenshots → always serve over http via
  `scripts/serve.sh`, never open a `file://` URL for capture.
- **Reveal-gated content captures blank** → always inject the force-reveal block above before
  any capture; for captures also inject
  `*{animation:none!important;transition:none!important}`.
- Screenshots are saved only inside `.design-options/shots/` — never outside the project.
