---
name: arch_guard
description: Core&Extensions境界を検問し、core変更時の必須更新を機械的にチェックする。
---

# arch_guard

## 目的
- coreの神聖性を守る（依存方向/I-O混入/例外手順漏れの検出）。

## 入力
- 変更差分（既定: `git diff --name-only HEAD`）
- 任意: `ARCH_GUARD_DIFF_RANGE`, `ARCH_GUARD_USE_STAGED`, `ARCH_GUARD_CHANGED_FILES`

## 手順
1. `./scripts/arch_guard.sh` を実行する。
2. core変更がある場合、`docs/arch/core-change.md` 更新有無を確認する。
3. core変更がある場合、`tests/contract/` など契約/回帰テスト更新の気配を確認する。
4. NG時は `file:line` 単位で修正し、再実行する。

## NG判定
- core内でadapter/extension/framework依存を検出
- core内でI/Oやruntime依存（env/time/http/fsなど）を検出
- core変更時にcore-change log更新がない
- core変更時に契約/回帰テスト更新がない

## allowlist
- 行末コメント: `arch-guard:allow`
- `.arch-guard-allowlist`: `path::regex` または `regex`

## 完了条件
- `arch_guard: OK` が出力される。
