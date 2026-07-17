# design-combinator

**A live, in-browser, *combinable* design-exploration dock for any existing page — grounded in that page's own identity.**

Point it at a local page or a live URL. It audits the page, generates named design options grounded in the page's *real* fonts, colors, components, and sections, then hands you a live dock in your browser where you combine those options and see the compound result instantly — a font pick **and** a color pick **and** a section relayout, live, not three separate static previews judged one at a time.

Randomize. Lock the ones you like. Save snapshots. Compare A/B. Copy the config.

---

## Why this exists

Most "design options" tools show you static cards — you can't feel how option A combines with option B. And live "theme playground" tools ship a fixed, generic option list grounded in nothing. This bundles the two halves:

- **`design-options`** (the brain) audits the page and generates options grounded in *its* identity — its accent hue rotated, its paper warmed, fonts that fit its voice. Every option cites a real fact about the page.
- **`design-combinator`** (the delivery) turns those grounded options into a live, combinable dock.

Same tool, pointed at two different sites → two entirely different, grounded option sets. Nothing generic, nothing carried over.

---

## How it works

Three delivery mechanisms, all driven by the page's own identity:

| | |
|---|---|
| **Token swaps** | fonts, colors, type scale, radius, elevation, spacing, motion → live CSS-variable writes on the page's own vars |
| **Component rules** | buttons, links, dividers, list markers → style rules scoped to the page's *real* selectors, using `var()` so they recolor when you change a token |
| **Section swaps** | hero recompose, cards→rows, etc. → the section's DOM is swapped live, and your token/component picks still hold on the new markup |

You combine across all three at once. A section swap doesn't drop your font/color picks — they compose.

---

## Install

In Claude Code:

```
/plugin marketplace add Hardik1697/design-combinator
/plugin install design-combinator@design-combinator
```

This installs both skills together (they work as a pair).

## Use

```
/design-combinator <page-or-url>
```

or just ask in natural language — "give me a live combinator for ./index.html", "let me combine fonts and colors on example.com live".

The skill audits the page (via `design-options`), builds a self-contained combinator page, serves it locally, and prints a URL. Open it in your browser and explore. When you've found a combination you like, **Copy config** gives you paste-ready output to apply back to your real stylesheet.

---

## Requirements

- **Claude Code** with plugin support.
- **`python3`** — used to serve the generated dock over local HTTP.
- **A real browser** — the dock is an interactive local tool you drive yourself.
- **Internet access at runtime** — the dock loads fonts (Google Fonts) and icons (Phosphor) from live CDNs.

> **Note:** the dock runs on a **local HTTP server**, not as a shareable static link or a Claude Artifact — it depends on those live font/icon CDNs and is an interactive tool, not a static page. Offline, fonts fall back and icon glyphs vanish.

---

## What it covers (and what it doesn't)

Coverage is whatever `design-options` can ground for your page:

- ✅ Full token surface (type, color, shape, space, motion)
- ✅ The components your page actually has (buttons, links, dividers, …)
- ✅ One section-layout dimension per morphable section it detects

Not automatic:

- ⚠️ **JS-bound effects** (count-up, magnetic hover, custom entrance animations) and **truly page-unique sections** don't auto-appear. They can be hand-added — see the bundled `authoring.md` — so coverage can still reach "everything" on a given page, just not automatically.

It is an exploration surface, not a critic: it never ranks options or auto-picks a winner. You keep taste authority.

---

## What's inside

```
plugins/design-combinator/
  skills/
    design-options/       # the brain: audit + grounded option generation
    design-combinator/    # the delivery: config schema, generator, live dock, serializers
```

---

## License

MIT © 2026 Hardik Anand
