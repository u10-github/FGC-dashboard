#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ARCH_GUARD_REPO_ROOT:-$(pwd)}"
ALLOWLIST_FILE="${ARCH_GUARD_ALLOWLIST_FILE:-$ROOT_DIR/.arch-guard-allowlist}"
CORE_CHANGE_LOG="${ARCH_GUARD_CORE_CHANGE_LOG:-docs/arch/core-change.md}"

CORE_DIR_PATTERN='(^|/)(core|src/core|domain|src/domain)(/|$)'
CORE_DEP_PATTERN='(from[[:space:]]+["\x27].*(adapters?|extensions?|infrastructure|infra|next|react|express|fastify)|require\(["\x27].*(adapters?|extensions?|infrastructure|infra|next|react|express|fastify))'
CORE_IO_PATTERN='(process\.env|Date\.now\(|new[[:space:]]+Date\(|fetch\(|axios\.|node:fs|\<fs\>|fs\.|readFile|writeFile|http\.|https\.|XMLHttpRequest|localStorage|sessionStorage)'
CONTRACT_TEST_PATTERN='(^|/)(tests/contract/|test/contract/|contracts?/|.*(contract|spec|test)\.)'

is_allowed_violation() {
  local file="$1"
  local line_no="$2"
  local text="$3"

  if echo "$text" | grep -q 'arch-guard:allow'; then
    return 0
  fi

  if [ -f "$ALLOWLIST_FILE" ]; then
    while IFS= read -r rule || [ -n "$rule" ]; do
      [ -z "$rule" ] && continue
      case "$rule" in
        \#*) continue ;;
      esac

      local rule_file="${rule%%::*}"
      local rule_pattern="${rule#*::}"
      if [ "$rule_file" = "$rule" ]; then
        rule_pattern="$rule"
        rule_file="*"
      fi

      if [ "$rule_file" = "*" ] || [ "$rule_file" = "$file" ]; then
        if echo "$text" | grep -Eq "$rule_pattern"; then
          return 0
        fi
      fi
    done < "$ALLOWLIST_FILE"
  fi

  return 1
}

load_changed_files() {
  if [ -n "${ARCH_GUARD_CHANGED_FILES:-}" ]; then
    printf '%s\n' "$ARCH_GUARD_CHANGED_FILES" | sed '/^$/d'
    return
  fi

  if [ -n "${ARCH_GUARD_DIFF_RANGE:-}" ]; then
    git -C "$ROOT_DIR" diff --name-only --diff-filter=ACMR "$ARCH_GUARD_DIFF_RANGE"
    return
  fi

  if [ "${ARCH_GUARD_USE_STAGED:-0}" = "1" ]; then
    git -C "$ROOT_DIR" diff --cached --name-only --diff-filter=ACMR
    return
  fi

  git -C "$ROOT_DIR" diff --name-only --diff-filter=ACMR HEAD
}

mapfile -t CHANGED_FILES < <(load_changed_files)

if [ "${#CHANGED_FILES[@]}" -eq 0 ]; then
  echo "arch_guard: no changed files detected"
  exit 0
fi

mapfile -t CORE_CHANGED_FILES < <(printf '%s\n' "${CHANGED_FILES[@]}" | grep -E "$CORE_DIR_PATTERN" || true)

errors=0

check_core_patterns() {
  local file="$1"
  local abs_file="$ROOT_DIR/$file"

  [ -f "$abs_file" ] || return 0

  while IFS= read -r line || [ -n "$line" ]; do
    local line_no="${line%%:*}"
    local text="${line#*:}"
    if ! is_allowed_violation "$file" "$line_no" "$text"; then
      echo "[NG] Forbidden dependency in core: $file:$line_no"
      echo "      $text"
      errors=1
    fi
  done < <(grep -nE "$CORE_DEP_PATTERN" "$abs_file" || true)

  while IFS= read -r line || [ -n "$line" ]; do
    local line_no="${line%%:*}"
    local text="${line#*:}"
    if ! is_allowed_violation "$file" "$line_no" "$text"; then
      echo "[NG] Forbidden I/O or runtime coupling in core: $file:$line_no"
      echo "      $text"
      errors=1
    fi
  done < <(grep -nE "$CORE_IO_PATTERN" "$abs_file" || true)
}

for file in "${CORE_CHANGED_FILES[@]:-}"; do
  check_core_patterns "$file"
done

if [ "${#CORE_CHANGED_FILES[@]}" -gt 0 ]; then
  has_core_change_log=0
  has_contract_update=0

  for file in "${CHANGED_FILES[@]}"; do
    if [ "$file" = "$CORE_CHANGE_LOG" ]; then
      has_core_change_log=1
    fi
    if echo "$file" | grep -Eq "$CONTRACT_TEST_PATTERN"; then
      has_contract_update=1
    fi
  done

  if [ "$has_core_change_log" -ne 1 ]; then
    echo "[NG] Core changed but missing update: $CORE_CHANGE_LOG"
    errors=1
  fi

  if [ "$has_contract_update" -ne 1 ]; then
    echo "[NG] Core changed but no contract/regression test updates detected"
    errors=1
  fi
fi

if [ "$errors" -ne 0 ]; then
  echo "arch_guard: FAILED"
  exit 1
fi

echo "arch_guard: OK"
