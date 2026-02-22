# runbook: {PROJECT_NAME}

## サービス概要
- デプロイ: {DEPLOYMENT}
- URL: {PAGES_URL}
- オーナー: {OWNER_TEAM}

## 初動トリアージ
- 症状:
  - {SYMPTOM_EXAMPLE}
- 最初の確認:
  - [ ] 最新CIステータス
  - [ ] 直近でマージされたPR
  - [ ] 障害時間帯のログ

## インシデント記録テンプレート
### ID: RB-{YYYYMMDD}-{N}
- 症状: {SYMPTOM}
- 影響範囲: {IMPACT_SCOPE}
- 再現手順: {REPRO_STEPS}
- 確認項目:
  - [ ] {CHECK_1}
  - [ ] {CHECK_2}
- 応急対応: {MITIGATION}
- 恒久対応: {PERMANENT_FIX}
- 関連eval: {EVAL_ID}
- 関連PR: {PR_LINK}

## 運用手順
### デプロイ確認
- [ ] {PAGES_URL} を開く
- [ ] 必要に応じてS1-S3のスモークフローを手動確認
- [ ] 監視/ログのベースラインを確認

### ロールバック
- トリガー: {ROLLBACK_TRIGGER}
- 手順:
  1. {ROLLBACK_STEP_1}
  2. {ROLLBACK_STEP_2}
  3. {ROLLBACK_STEP_3}
- ロールバック後の確認:
  - [ ] S1-S3が復旧している
  - [ ] インシデント記録が更新されている

## 更新ポリシー
- runbook + evals更新前にインシデントをクローズしない。
- 記録は短く保つ: 症状 -> 確認 -> 対処 -> 恒久対応。
