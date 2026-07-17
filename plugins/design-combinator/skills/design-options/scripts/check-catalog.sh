#!/usr/bin/env bash
# check-catalog.sh — build-time self-check for the design-options catalog.
#
# Verifies:
#   1. every static menu ID in SKILL.md (28 token dims + 3 fixed structural dims) has
#      exactly one catalog entry, and every catalog entry (outside morphology.md) maps
#      back to a menu ID — a 1:1 mapping.
#   2. no "default:" field anywhere in references/catalog/.
#   3. brand-leak grep (wedge) on catalog/ is empty.
#   4. zero-bias grep (cormorant|newsreader|lato) on catalog/ is empty.
#   5. no hex color literals anywhere in catalog/.
#   6. no recommended|best|popular markers anywhere in catalog/.
#   7. token dims declare 6-10 options; structural dims declare 3-6 options.
#   8. every family named in catalog/morphology.md exists in references/recognition.md
#      (skipped with a warning if either file doesn't exist yet).
#
# Usage: bash check-catalog.sh
# Exit 0 only when every check that could run, passed. Exit 1 on any failure.
set -uo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_MD="$SKILL_DIR/SKILL.md"
CATALOG_DIR="$SKILL_DIR/references/catalog"
RECOGNITION_MD="$SKILL_DIR/references/recognition.md"
MORPHOLOGY_MD="$CATALOG_DIR/morphology.md"

FAIL=0
say()  { printf '%s\n' "$*"; }
ok()   { printf 'OK   - %s\n' "$*"; }
bad()  { printf 'FAIL - %s\n' "$*" >&2; FAIL=1; }
warn() { printf 'WARN - %s\n' "$*" >&2; }

if [ ! -f "$SKILL_MD" ]; then
  echo "FAIL - SKILL.md not found at $SKILL_MD" >&2
  exit 1
fi

if [ ! -d "$CATALOG_DIR" ]; then
  echo "FAIL - catalog dir not found: $CATALOG_DIR" >&2
  exit 1
fi

CATALOG_FILES=()
while IFS= read -r -d '' f; do
  CATALOG_FILES+=("$f")
done < <(find "$CATALOG_DIR" -maxdepth 1 -name '*.md' -type f -print0 | sort -z)

if [ "${#CATALOG_FILES[@]}" -eq 0 ]; then
  cat >&2 <<'EOF'
FAIL - references/catalog/ is empty: no dimension catalog *.md files found yet.

  There is nothing to check until the catalog is populated. Expected files (spec S3):
    typography.md   color-surface.md   shape-depth.md   space-rhythm.md
    motion.md        components.md      morphology.md    transitions.md
    composition.md

  Populate catalog/*.md (see the design-options skill's own architecture spec, S3.3,
  for the entry format), then re-run: bash scripts/check-catalog.sh
EOF
  exit 1
fi

say "Found ${#CATALOG_FILES[@]} catalog file(s) in $CATALOG_DIR"
say ""

# ---------------------------------------------------------------------------
# 1. Menu ID <-> catalog entry 1:1 mapping (static dims only: 28 token + 3
#    fixed structural — Y1/Z1/Z2). Dynamic per-page X-entries are excluded:
#    they're page-specific instantiations of morphology.md families, not
#    static menu lines, and are cross-checked separately in check 8.
# ---------------------------------------------------------------------------
say "--- 1. menu ID <-> catalog entry mapping ---"

TOKEN_BLOCK="$(awk '/^TOKEN — cheap flips/{f=1} /^STRUCTURAL — generated variants/{f=0} f' "$SKILL_MD")"
menu_token_ids=()
while IFS= read -r name; do
  [ -n "$name" ] && menu_token_ids+=("$name")
done < <(printf '%s\n' "$TOKEN_BLOCK" | grep -oE '^[[:space:]]*[0-9]+\.[[:space:]]+[a-z][a-z-]*' | sed -E 's/^[[:space:]]*[0-9]+\.[[:space:]]+//')

# Fixed structural dims are named literally in SKILL.md's structural block.
menu_structural_ids=(section-transitions page-symmetry grid-restructure)
for id in "${menu_structural_ids[@]}"; do
  if ! grep -qE "[[:space:]]${id}[[:space:]]" "$SKILL_MD"; then
    bad "SKILL.md menu is missing fixed structural dim: $id"
  fi
done

menu_ids=("${menu_token_ids[@]}" "${menu_structural_ids[@]}")

if [ "${#menu_token_ids[@]}" -ne 28 ]; then
  bad "expected 28 token dim lines in SKILL.md's TOKEN block, found ${#menu_token_ids[@]}"
else
  ok "28 token dim lines found in SKILL.md menu"
fi

# Catalog entry names: "### <ID> <name>  [...]" headings, across all catalog
# files EXCEPT morphology.md (family-keyed, dynamic — checked in step 8).
catalog_ids=()
declare -A catalog_id_file=()
for f in "${CATALOG_FILES[@]}"; do
  base="$(basename "$f")"
  [ "$base" = "morphology.md" ] && continue
  while IFS= read -r name; do
    [ -z "$name" ] && continue
    catalog_ids+=("$name")
    if [ -n "${catalog_id_file[$name]:-}" ]; then
      bad "catalog entry '$name' appears in both ${catalog_id_file[$name]} and $base (must be unique)"
    else
      catalog_id_file[$name]="$base"
    fi
  done < <(grep -oE '^### [A-Za-z][A-Za-z0-9]* +[a-z][a-z-]*' "$f" | sed -E 's/^### [A-Za-z][A-Za-z0-9]* +//')
done

# menu -> catalog
for id in "${menu_ids[@]}"; do
  found=0
  for c in "${catalog_ids[@]}"; do
    [ "$c" = "$id" ] && found=1 && break
  done
  if [ "$found" -eq 0 ]; then
    bad "menu ID '$id' (SKILL.md) has no matching catalog entry in references/catalog/*.md"
  fi
done

# catalog -> menu
for c in "${catalog_ids[@]}"; do
  found=0
  for id in "${menu_ids[@]}"; do
    [ "$c" = "$id" ] && found=1 && break
  done
  if [ "$found" -eq 0 ]; then
    bad "catalog entry '$c' (in ${catalog_id_file[$c]}) has no matching menu ID in SKILL.md"
  fi
done

if [ "$FAIL" -eq 0 ]; then
  ok "menu IDs and catalog entries map 1:1 (${#menu_ids[@]} static dims)"
fi

# ---------------------------------------------------------------------------
# 2. No "default:" field anywhere in catalog/
# ---------------------------------------------------------------------------
say ""
say "--- 2. no default: fields ---"
if grep -rniE '(^|[^a-z])default[[:space:]]*:' "$CATALOG_DIR" >/dev/null 2>&1; then
  bad "found a 'default:' field in catalog/ — the target's audit is the only baseline, no defaults allowed"
  grep -rniE '(^|[^a-z])default[[:space:]]*:' "$CATALOG_DIR" >&2
else
  ok "no 'default:' fields in catalog/"
fi

# ---------------------------------------------------------------------------
# 3. Brand-leak grep
# ---------------------------------------------------------------------------
say ""
say "--- 3. brand-leak grep ---"
if grep -rniE 'wedge' "$CATALOG_DIR" >/dev/null 2>&1; then
  bad "brand-leak terms found in catalog/ (wedge)"
  grep -rniE 'wedge' "$CATALOG_DIR" >&2
else
  ok "no brand-leak terms in catalog/"
fi

# ---------------------------------------------------------------------------
# 4. Zero-bias grep (seed project's committed font trio)
# ---------------------------------------------------------------------------
say ""
say "--- 4. zero-bias font grep ---"
if grep -rniE 'cormorant|newsreader|\blato\b' "$CATALOG_DIR" >/dev/null 2>&1; then
  bad "seed project's font trio leaked into catalog/ (cormorant|newsreader|lato)"
  grep -rniE 'cormorant|newsreader|\blato\b' "$CATALOG_DIR" >&2
else
  ok "no seed-project font-trio leakage in catalog/"
fi

# ---------------------------------------------------------------------------
# 5. No hex literals in catalog/
# ---------------------------------------------------------------------------
say ""
say "--- 5. no hex color literals ---"
if grep -rnE '#[0-9a-fA-F]{3,8}\b' "$CATALOG_DIR" >/dev/null 2>&1; then
  bad "hex color literal(s) found in catalog/ — colors must exist only as instantiation formulas"
  grep -rnE '#[0-9a-fA-F]{3,8}\b' "$CATALOG_DIR" >&2
else
  ok "no hex literals in catalog/"
fi

# ---------------------------------------------------------------------------
# 6. No recommended|best|popular markers
# ---------------------------------------------------------------------------
say ""
say "--- 6. no recommend-language markers ---"
if grep -rniE 'recommended|\bbest\b|popular' "$CATALOG_DIR" >/dev/null 2>&1; then
  bad "recommend-language found in catalog/ (recommended|best|popular) — options must stay unranked"
  grep -rniE 'recommended|\bbest\b|popular' "$CATALOG_DIR" >&2
else
  ok "no recommend-language markers in catalog/"
fi

# ---------------------------------------------------------------------------
# 7. Option counts: token dims 6-10, structural dims 3-6
# ---------------------------------------------------------------------------
say ""
say "--- 7. option-count bounds ---"
for f in "${CATALOG_FILES[@]}"; do
  base="$(basename "$f")"
  # Walk each "### <ID> <name>  [layer · ...]" heading and find its "Options (N)" line.
  awk -v file="$base" '
    /^### / {
      header = $0
      layer = "unknown"
      if (header ~ /\[token/) layer = "token"
      else if (header ~ /\[structural/) layer = "structural"
      id_name = header
      sub(/^### /, "", id_name)
      sub(/ *\[.*/, "", id_name)
      pending_id = id_name
      pending_layer = layer
      next
    }
    /Options \([0-9]+\)/ && pending_id != "" {
      n = $0
      match(n, /Options \(([0-9]+)\)/, m)
      count = m[1]
      print pending_id "|" pending_layer "|" count "|" file
      pending_id = ""
    }
  ' "$f"
done > /tmp/design-options-check-counts.$$ 2>/dev/null || true

if [ -s /tmp/design-options-check-counts.$$ ]; then
  while IFS='|' read -r id layer count file; do
    [ -z "$id" ] && continue
    case "$layer" in
      token)
        if [ "$count" -lt 6 ] || [ "$count" -gt 10 ]; then
          bad "$file: '$id' is token-layer but declares Options ($count) — must be 6-10"
        fi
        ;;
      structural)
        if [ "$count" -lt 3 ] || [ "$count" -gt 6 ]; then
          bad "$file: '$id' is structural-layer but declares Options ($count) — must be 3-6"
        fi
        ;;
      *)
        warn "$file: '$id' has an Options(N) line but no [token]/[structural] tag on its heading — skipping bound check"
        ;;
    esac
  done < /tmp/design-options-check-counts.$$
  ok "option-count bounds checked for all dims carrying an 'Options (N)' line"
else
  warn "no 'Options (N)' lines found in catalog/ yet — nothing to bound-check"
fi
rm -f /tmp/design-options-check-counts.$$

# ---------------------------------------------------------------------------
# 8. morphology.md families ⊆ recognition.md families
# ---------------------------------------------------------------------------
say ""
say "--- 8. morphology ⊆ recognition family cross-check ---"
if [ ! -f "$MORPHOLOGY_MD" ] || [ ! -f "$RECOGNITION_MD" ]; then
  warn "skipping (morphology.md and/or recognition.md do not exist yet)"
else
  # morphology.md headings carry the "X" category-ID prefix, e.g.
  # "### X card-grid — "what else besides cards?"  [structural · ...]" (spec S3.5) —
  # strip an optional leading "<ID> " token before the lowercase family name.
  morph_families=()
  while IFS= read -r name; do
    [ -n "$name" ] && morph_families+=("$name")
  done < <(grep -oE '^### ([A-Za-z][A-Za-z0-9]* +)?[a-z][a-zA-Z0-9/-]*' "$MORPHOLOGY_MD" | sed -E 's/^### ([A-Za-z][A-Za-z0-9]* +)?//')

  # recognition.md headings are bare family names, no ID prefix (spec S6.2).
  recog_families=()
  while IFS= read -r name; do
    [ -n "$name" ] && recog_families+=("$name")
  done < <(grep -oE '^### [a-z][a-zA-Z0-9/-]*' "$RECOGNITION_MD" | sed -E 's/^### //')

  section_fail=0
  for m in "${morph_families[@]}"; do
    found=0
    for r in "${recog_families[@]}"; do
      [ "$m" = "$r" ] && found=1 && break
    done
    if [ "$found" -eq 0 ]; then
      bad "morphology.md family '$m' has no matching entry in recognition.md"
      section_fail=1
    fi
  done
  if [ "$section_fail" -eq 0 ]; then
    ok "every morphology.md family exists in recognition.md"
  fi
fi

say ""
if [ "$FAIL" -eq 0 ]; then
  say "ALL CHECKS PASSED"
  exit 0
else
  say "CHECKS FAILED — see FAIL lines above"
  exit 1
fi
