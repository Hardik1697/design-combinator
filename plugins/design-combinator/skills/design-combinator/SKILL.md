---
name: design-combinator
description: Live, in-browser combinable exploration dock for an EXISTING page — local file/dir or any live website URL. Same family as design-options — delegates the brain (audit the target, print the dimension menu, generate options grounded in the page's own identity) entirely to design-options, then serializes the picked options into a combinator.config.json (token CSS-variable swaps, component style rules, section markup swaps) and generates a self-contained live dock the user drives in their own browser: combine multiple dimensions at once (a font pick + a color pick + a section swap, live, not three separate static previews), randomize, lock, save/restore, compare, copy-config. Use whenever the user says "live combinator for <page>", "combinable design options", "grounded design dock", "let me combine fonts/colors/sections live", "let me play with these options together", "combine the picks live", or invokes /design-combinator <page-or-url>. Not a builder, not a critic, not a second brain — it never audits, classifies, or invents an option itself; user keeps taste authority, the dock explores and never auto-picks.
---

# design-combinator

## 1. What this is / is not

A **live, grounded, combinable exploration dock** for an EXISTING page — not a builder (the
page must already exist, same precondition as design-options), not a critic (never ranks,
never auto-picks a winner), and not a second brain: audit → menu → grounded options is entirely
design-options' job, always. **design-options ships as a sibling skill bundled in this same
plugin** (installed together) — running it means invoking that bundled skill, not a separate
install. This skill owns exactly one thing design-options doesn't —
**delivery**. It turns design-options' grounded, prose-form options into a machine-readable
config, generates a self-contained in-browser dock from it, serves it locally, and hands the
user a URL where combining dimensions is live: pick a font AND an accent AND a section
recompose and see the actual compound result, not three separate static previews judged one at
a time. **The user keeps taste authority at every step** — the dock explores, it never decides.

## 2. Ground rules

- **Never auto-pick, never rank.** The dock is an exploration surface, not a verdict — see §6
  Scope boundary. Same taste-authority contract design-options runs under.
- **Never commit, never self-approve.** Generating and serving the dock never touches git. The
  one exception that *can* touch source is the `:root` bootstrap (§5) — that follows
  design-options' own dirty-tree warning and apply discipline, not this skill's own judgment.
- **Delegate, don't duplicate.** If design-options' audit or options are missing or stale,
  re-run design-options — never patch around a gap here by inventing an option or a fact.
- **Staging discipline** — everything this skill writes at runtime goes in its own staging dir,
  kept separate from design-options' `.design-options/`:
  - Local target → `<target-dir>/.design-combinator/` (the config, generated
    `combinator.html`, the data module, effect-CSS, the variant registry).
  - Remote target → `<scratchpad>/design-combinator/<host-slug>/`.
  - Record `mode: "local"|"remote"` in `combinator.config.json`'s `meta.mode` — it changes only
    where output stages and how the §4 Step 4 round-trip note reads; every other step is
    identical between modes.

## 3. Invocation

`/design-combinator <target>` — or natural language ("live combinator for the example site",
"let me combine fonts and colors on this live", "give me a combinable design dock for
stripe.com"). Target resolution mirrors design-options' own `SKILL.md` §3 (local dir/file, or a
URL matching `^https?://`) — this skill never re-derives that logic, it hands the target
straight to design-options in §4 Step 1. No target given → ask one plain-text question for it.

## 4. The flow

### Step 1 — DELEGATE

Run the bundled **design-options** skill on `<target>` per its own documented flow (its
`SKILL.md` §4–6: audit → menu → the user's picks → grounded named options). This skill does not
re-implement any part of that — it waits for design-options to produce `.design-options/audit.md`
and print the grounded option lines for whatever dimensions the user picked. If the user hasn't
picked dimensions yet, that conversation happens entirely inside design-options' own menu step;
this skill only re-enters once picks exist.

### Step 2 — SERIALIZE

Transform the picked, grounded options into `combinator.config.json`
(`references/config-schema.md` is the contract every field below must satisfy). Three
serializers, one per delivery mechanism, plus the hand-authored residue path:

- `references/serialize-tokens.md` — **M1 tokens.** Instantiates token-catalog options
  (typography, color-surface, shape/space/motion) into concrete `vars`, resolving color/font
  formulas against the audit's H/P/ink.
- `references/serialize-components.md` — **M2 components.** Turns component-catalog options
  (buttons, links/CTAs, eyebrows, list markers, dividers, surface treatments) into `css` rules
  scoped to the page's real component selectors.
- `references/serialize-structural.md` — **M3 structural.** Packages design-options' generated
  section variants into `html` swap fragments plus re-wire metadata (reveal/ids/hooks/≤768px).
- `references/authoring.md` — **residue.** The hand-author path for whatever design-options
  can't auto-ground for this page (§6 Scope boundary names what falls here).

### Step 3 — GENERATE

```
node "${CLAUDE_SKILL_DIR}/assets/combinator/gen.mjs" <config> <targetHtml> <outDir>
```

Emits the self-contained combinator page: the data module, the generated effect-CSS
(`vars`/`css` options → `html[data-key="value"]{…}` rules), the variant registry (`html`
options), and `combinator.html` (target page + Google-Fonts link built from
`meta.fontFamilies` + dock chrome + `<script>` data + `dock.js`/`dock.css`). Anchor misses
(`meta.insertAnchors`) fail loudly rather than emitting a silently broken page.

### Step 4 — SERVE + HAND OFF

```
bash "${CLAUDE_SKILL_DIR}/scripts/serve.sh" <outDir>
```

Same free-ephemeral-port `python3 -m http.server` pattern as design-options' `serve.sh`. **Never
open the generated page via `file://`, and never publish it as an Artifact** — the dock's own
chrome loads Google Fonts and Phosphor icons from live CDNs at runtime (fonts fall back and
icon glyphs vanish offline), and an Artifact's CSP blocks exactly those external requests
outright, on top of the dock being an interactive local tool, not a static shareable page. Print
the URL and hand it to the user's real browser — they combine dimensions, randomize, lock, save,
compare, and copy-config themselves; this skill renders no visual verdict.

Copy-config produces paste-ready `data-*` attributes plus variant references (and, via
design-options, a `tokens.css` block) — that output is the round-trip back into design-options'
own apply path (design-options' own `references/apply.md` §token / §structural), which is how an
explored combination becomes a real source edit. This skill never edits the target's live
markup/CSS to apply a pick — only design-options' apply step does that.

## 5. The var-wiring caveat

A token dim's live swap only works where the page's CSS actually *consumes* the var it writes —
`html[data-accent="x"]{--cobalt-600:#e0662f}` changes nothing if no declaration anywhere reads
`var(--cobalt-600)`. Two ways this bites, both handled in `serialize-tokens.md`:

- **`meta.currentTokens.hasCustomProps` is `false`** — the page defines no custom-property layer
  at all. Run design-options' apply-layer bootstrap first (design-options' own `references/apply.md`
  §token: "no CSS custom properties found → introduce a `:root` token block and rewrite the
  frequency-ranked literals to `var()`") so there's something for a swap to hit — otherwise
  every M1 pick silently no-ops in the browser. `serialize-tokens.md`'s Preflight owns this gate.
- **A component uses a literal value even where the page has vars elsewhere** (one hardcoded
  hex in a single selector) — invisible to any `vars` payload no matter what M1 emits. That's
  per-selector residue, not a token-layer gap: route it to `references/authoring.md` (a
  hand-written `css` option overriding the literal directly) rather than treating it as covered.

## 6. Scope boundary

The dock covers exactly what design-options can ground for the target page — nothing more:

- **Token dims** — full coverage, always. Every T*/C*/shape/space/motion catalog dim
  design-options offers has a mechanical path to `vars` (`serialize-tokens.md`).
- **Component dims** — covered per `serialize-components.md`, scoped to whatever real selectors
  the audit's component inventory (block 4) actually found; a component the page doesn't have
  (no badges, no dividers) gets no dim.
- **Structural dims** — covered per `serialize-structural.md`, one per morphable section
  design-options detected.
- **Residue** — JS-bound effects (count-up, magnetic cursor, a custom entrance boot) and
  page-unique sections with no design-options family don't auto-ground; `references/
  authoring.md` documents the hand-author path so coverage can still reach "everything" on a
  given page, just not automatically.

The user picks which dimensions to explore at design-options' own menu step (§4 Step 1) — this
skill never expands that scope on its own and never auto-includes a dimension the user didn't
pick.

## 7. Delegates, never re-implements

Everything upstream of "what are the grounded options" belongs to design-options, full stop.
This skill never audits a page, never classifies a section, never invents a color formula, and
never writes an option's rationale — it reads what design-options already produced
(`.design-options/audit.md` plus the options it printed) and transforms that into a config the
dock can drive live. If design-options' output looks missing, thin, or stale, the fix is
re-running design-options — not working around it here.
