# AGENTS for {PROJECT_NAME} (Harness)

## コアルール
- SSoTは次の3ドキュメントのみ:
  - `doc/DoD.md`
  - `doc/evals.md`
  - `doc/runbook.md`
- Architecture Contract:
  - Coreは domain types / invariants / use-cases / ports のみを保持する。
  - extensions/adapters は外部依存（DB/HTTP/fs/time/env等）を引き受ける。
  - 依存方向は `extensions|adapters -> core` のみ許可し、`core -> extensions|adapters` を禁止する。
- すべてのPRで聖域（S1-S3）への影響判定を必須化する。
- インシデント -> harness更新を必須化する:
  - `doc/runbook.md` を更新
  - `doc/evals.md` を更新
  - ガードが必要な場合は `doc/DoD.md` を更新

## 聖域
- S1: {CRITICAL_FLOW_1}
- S2: {CRITICAL_FLOW_2}
- S3: {CRITICAL_FLOW_3}

## PR Gate
- PRの必須CIチェック:
  - `test`
  - `build`
- 追加検問:
  - `./scripts/arch_guard.sh`
- 重いE2E:
  - `main` / nightly / manual のみで実行

## 運用原則
- 更新は小さくし、コード変更と同じPRで実施する。
- SSoT文書を変更しない場合、PRに明示的な理由を記載する。
