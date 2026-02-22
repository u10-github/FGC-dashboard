# DoD: {PROJECT_NAME}

## 対象範囲
- 最小コアのみ: `doc/DoD.md` + `doc/evals.md` + `doc/runbook.md` + PRゲート。
- 任意項目: 重いE2EはPR必須チェックから除外。

## 聖域（S1-S3）
- `S1`: {CRITICAL_FLOW_1}
- `S2`: {CRITICAL_FLOW_2}
- `S3`: {CRITICAL_FLOW_3}

## 合格条件（PRごと）
- [ ] PR本文にS1-S3への影響判定がある。
- [ ] 影響がある聖域のテストが追加/更新されている。
- [ ] テスト期待値が変わる場合、`doc/evals.md` が同期されている。
- [ ] 運用/復旧手順が変わる場合、`doc/runbook.md` が同期されている。
- [ ] PRのCI（`test` + `build`）が成功している。
- [ ] `./scripts/arch_guard.sh` が成功している。
- [ ] Core変更時は `docs/arch/core-change.md` と契約テスト（`tests/contract/`）を同一PRで更新している。
- [ ] PR本文にロールバック手順がある。

## ガードレール
- [ ] S1-S3の挙動が不明な状態ではリリースしない。
- [ ] CI必須チェックが失敗中ならマージしない。
- [ ] runbook/evals更新前にインシデントをクローズしない。

## 対象外（既定）
- 全PRでのフルE2E（`main`/nightly/manual に逃がす）。
