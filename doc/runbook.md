# runbook: FGC-dashboard

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

## 更新ポリシー
- runbook + evals更新前にインシデントをクローズしない。
- 記録は短く保つ: 症状 -> 確認 -> 対処 -> 恒久対応。
