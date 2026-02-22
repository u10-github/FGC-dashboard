## 目的
- このPRを作成する理由:

## 変更点
- 主な変更:

## 聖域への影響（必須）
- [ ] S1（{CRITICAL_FLOW_1}）に影響あり
- [ ] S2（{CRITICAL_FLOW_2}）に影響あり
- [ ] S3（{CRITICAL_FLOW_3}）に影響あり
- 影響内容:

## SSoT同期チェック（必須）
- [ ] `doc/DoD.md` を確認
- [ ] `doc/evals.md` を確認
- [ ] `doc/runbook.md` を確認
- [ ] 必要なドキュメントをこのPRで更新、または「更新不要」の理由を記載

## Core&Extensionsチェック（必須）
- [ ] coreを変更していない
- [ ] coreを変更した場合、理由/影響範囲/契約テスト更新/回帰結果/`docs/arch/core-change.md` 更新を記載
- [ ] `./scripts/arch_guard.sh` 実行結果を記載

## テスト / 検証
- CI: `test` + `build`
- 証跡:
  - [ ] test結果
  - [ ] build結果
  - [ ] 手動再現手順またはスクリーンショット（任意）

## 失敗時の挙動
- 想定される失敗モード:
- ユーザー影響:

## ロールバック
- トリガー:
- 手順:

## Incident to Harness
- [ ] このPRがインシデント対応なら、runbook/evals（必要ならDoD）を更新済み
