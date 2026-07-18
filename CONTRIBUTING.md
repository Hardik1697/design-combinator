# Contributing

Ideas and improvements are genuinely welcome — this tool is meant to grow with what people actually need when exploring real pages. Whether you have a rough idea or a finished patch, here's how it works.

## 💡 Suggest an idea

The fastest way to help: **[open a suggestion](https://github.com/Hardik1697/design-combinator/issues/new?template=suggestion.yml)**. It's a short form — what you'd want, and the page or scenario that prompted it. Rough ideas are fine; grounded, specific ones are just easier to act on.

## 🐛 Report a bug

**[File a bug report](https://github.com/Hardik1697/design-combinator/issues/new?template=bug_report.yml)** with what happened and how to reproduce it. The page you pointed it at + your environment (OS, browser, Claude Code version) speeds things up a lot.

## 🔧 Contribute a change

1. **Fork** the repo and create a branch (`feat/…` or `fix/…`).
2. Make your change (see the dev loop below).
3. Open a **Pull Request** against `main`, filling in the PR template.
4. The maintainer reviews and merges — a PR never changes the repo until it's reviewed, so open one freely.

### How suggestions are triaged

Every issue gets read, labeled (`enhancement`, `bug`, `good first issue`, `needs-info`, …), and either turned into work, parked, or closed with a reason. If something needs more detail, you'll get a comment asking for it — no suggestion just disappears.

## Dev loop (testing your change)

This is a pair of Claude Code skills, not a compiled app. The two halves:

- `plugins/design-combinator/skills/design-options/` — audits a page and generates grounded options (the brain).
- `plugins/design-combinator/skills/design-combinator/` — turns those into a live dock (the delivery). The engine lives in `assets/combinator/` (`gen.mjs`, `dock.js`, `dock.css`) and the config contract is `references/config-schema.md`.

To exercise the engine end-to-end without Claude Code:

```bash
cd plugins/design-combinator/skills/design-combinator/assets/combinator

# generate a combinator page from the example config against any real .html page
node gen.mjs config.example.json /path/to/some/page/index.html /tmp/out

# copy the runtime + chrome next to it, then serve over http (never file://)
cp dock.js dock.css /tmp/out/
bash ../../scripts/serve.sh /tmp/out
# open the printed URL in a real browser and drive the dock
```

Confirm: the dock renders, picks apply live, dimensions compose, and there are **no console errors**.

## Ground rules for changes

- **Stay generic and portable.** No business names, no absolute paths (`~/.claude/...`), no `../` filesystem escapes. Skill assets are referenced via `${CLAUDE_SKILL_DIR}`. Anything a specific page needs is expressed as *config*, never hardcoded.
- **The config is the seam.** `combinator.config.json` (see `references/config-schema.md`) is the contract between the two skills. Changes to what design-options produces and what the dock consumes have to agree there.
- **Keep the three mechanisms honest** — token (`vars`), component (`css` scoped to real selectors), and section (`html` markup swap). New capabilities should fit one of these or clearly extend the schema.
- **Grounding discipline** — an option cites a real fact about the page; the tool never ranks or auto-picks. It explores; the user decides.

## Be kind

Assume good intent, keep discussion focused on the work, and remember everyone's here to make the tool better.
