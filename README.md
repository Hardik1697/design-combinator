# design-combinator

Point it at a page, a local file or a live URL, and it gives you a playground in your browser for reworking how that page looks. It reads the page's real fonts, colors, buttons, and section layouts, comes up with named alternatives that actually fit what's there, and lets you mix them and watch the page change as you go. You can try a new heading font with a warmer accent and a different hero layout all at once, instead of guessing from three separate mockups.

Shuffle for random combinations, lock the parts you want to keep, save versions to compare, and copy the settings out once you land on something you like.

## Two skills, one job

It's two Claude Code skills that work as a pair.

`design-options` reads the page and proposes the alternatives. Each option is tied to something real about the page: its dominant hue rotated a little, its off-white background warmed up, a font that suits its voice. It doesn't reach for generic choices.

`design-combinator` takes those proposals and builds the live dock you click around in.

Since the options come from the page itself, you get a completely different set of choices on two different sites. Nothing is boilerplate, and nothing carries over from one page to the next.

## What you can change

Three kinds of edits, all driven by the page's own styling.

**Tokens** are the fonts, colors, type scale, corner radius, shadows, spacing, and motion. These swap the page's CSS variables live.

**Components** are buttons, links, dividers, list markers. These write rules against the selectors the page already uses, so they keep matching your color and font picks.

**Sections** let you recompose the hero, turn a card grid into stacked rows, that sort of thing. The section's markup gets swapped out live, and your token and component picks still land on the new layout.

Everything composes. Swapping a section doesn't throw away the font or color you chose; they carry onto the new markup.

## Install

In Claude Code:

```
/plugin marketplace add Hardik1697/design-combinator
/plugin install design-combinator@design-combinator
```

Both skills install together, since they only work as a pair.

## Using it

```
/design-combinator <page-or-url>
```

Or just ask in plain language, something like "give me a live combinator for ./index.html" or "let me play with fonts and colors on example.com."

It reads the page, builds a self-contained combinator version of it, serves that on a local web server, and prints a URL. Open it in your browser and start clicking. When a combination clicks for you, hit Copy config and you get paste-ready output to drop back into your real stylesheet.

## What you'll need

- Claude Code with plugin support.
- python3, which it uses to serve the dock over local HTTP.
- A real browser, since you drive the dock by hand.
- An internet connection while you use it, because the dock pulls fonts from Google Fonts and icons from Phosphor.

The dock runs on a local server rather than as a shareable link or a Claude Artifact. It relies on those live font and icon CDNs, and it's an interactive tool rather than a static page. Open it offline and the fonts fall back to defaults and the icons vanish.

## Where it stops

The dock covers whatever design-options can pull from your page: the full set of tokens, the components the page actually has, and one layout option per section it recognizes.

A few things it won't wire up for you. Anything driven by JavaScript, like a count-up number or a magnetic hover, and one-off sections that don't match a known pattern. You can still add those by hand (there's a guide in the skill's `authoring.md`), so full coverage on a given page is possible, just not automatic.

And it's a place to explore, not a judge. It won't rank the options or pick a favorite. That part's yours.

## What's inside

The repo doubles as its own plugin marketplace. One plugin, two skills:

```
design-combinator/
├── .claude-plugin/marketplace.json       the marketplace catalog
├── plugins/
│   └── design-combinator/
│       ├── .claude-plugin/plugin.json    the plugin manifest
│       └── skills/
│           ├── design-options/           reads the page, generates the grounded options
│           └── design-combinator/        builds the live dock (engine in assets/combinator/)
├── CONTRIBUTING.md
├── README.md
└── LICENSE
```

## Contributing and feedback

Ideas are welcome. This is the kind of tool that gets better the more real pages people throw at it.

Have an idea? [Open a suggestion](https://github.com/Hardik1697/design-combinator/issues/new?template=suggestion.yml). Found a bug? [File a report](https://github.com/Hardik1697/design-combinator/issues/new?template=bug_report.yml). Want to build something? Fork it, make a branch, send a pull request. There's a walkthrough in [CONTRIBUTING.md](CONTRIBUTING.md).

Everything that comes in gets read and sorted.

## License

MIT, copyright 2026 Hardik Anand.
