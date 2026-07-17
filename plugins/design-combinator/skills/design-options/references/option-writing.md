# option-writing.md — naming, recipes, and presentation rules

Every catalog author and every runtime invocation follows this file. The option line IS the
product: if it could describe three different results, it is not finished.

## Naming

- Two words, lowercase-hyphenated: complement-pop, editorial-rows, ink-field, chip-strip.
- Name the RESULT's character, never the mechanism: "hairline-mount", not "border-1px".
  The mechanism belongs in the recipe half of the line, with numbers.
- Both words must carry information. A word that could be deleted without changing what the
  reader pictures is dead weight — replace it.
- No generic adjectives (banned list below). Reach for material, geometry, era, register, and
  behavior words instead: linen, plate, ledger, drenched, poster, arch, whisper.
- Names are unique within a dimension AND within a session (see No-repeat rule).

## Banned words

Empty adjectives — never in names, recipes, rationales, or grounding hooks:
modern · clean · sleek · beautiful · stunning · elegant · premium
(One carve-out: a banned adjective may survive inside a pre-approved compound name where the
partner word pins it to a concrete geometry. Never as a lone descriptor, never in new names.)

Recommend-language — never anywhere, in any form:
recommended · best · popular · favorite · "I'd go with" · "my pick" · "top choice" ·
"strongest option" · "you should" · "the obvious winner"
If a sentence implies the skill has a preference, delete the sentence, not just the word.

## Rationale format (contract — verbatim)

**name** — <audit fact> → <what changes> (<when it wins>)

- The audit fact is cited BY VALUE — a number, a face name, a count, a measured recipe —
  never "your current design". It comes from `.design-options/audit.md` and nowhere else.
- Every rationale carries at least one such fact. No fact, no option.
- `<when it wins>` names a page condition ("6+ items with long bodies"), not a quality claim.

Holds: **editorial-rows** — your features run 6 items × ~40 words in a 3-col grid → each item
becomes a full-width row with a big numeral and air (wins when items deserve individual weight)
Fails: **editorial-rows** — a more refined take on your features section. (No fact, no
mechanism, and "refined" is a smuggled ranking.)

## Unranked presentation

- Options print in the catalog's own order, which is a semantic spectrum — quiet→loud,
  flat→deep, restrained→drenched, light→dark. The spectrum is information; keep it intact.
- Never reorder by preference, never asterisk one, never bold one alone, never lead with "the
  standout". The skill has no favorites — the user keeps taste authority at every step.
- The skill never picks. If the user asks "which would you choose?", restate the trade-offs
  along the spectrum and hand the decision back.

## No-repeat rule

- "more options for #N" → a genuinely fresh set for that dimension: new names, new recipes,
  zero overlap with anything already shown in this session.
- Record shown names per dimension in the staging audit as they print; regenerate against that
  list. A renamed version of a shown option is a repeat.

## Option-line discipline

- One line per option, ≤160 characters: `name — recipe — when it wins.`
- Recipes must be executable by someone with no design sense: numbers, ratios, named CSS
  mechanisms, concrete placement rules. "generous spacing" is not a recipe; "1.25–1.5em
  paragraph gap" is.
- Archetype options (anything color- or brand-relative) carry an `Instantiate:` clause phrased
  against audit values (H = brand hue, P = paper, ink) — never a fixed color.
- Options that can combine end with "(stackable)"; incompatible pairs name each other.
- If two options would look near-identical on a real page, merge them and author a genuinely
  distinct one in the freed slot.
