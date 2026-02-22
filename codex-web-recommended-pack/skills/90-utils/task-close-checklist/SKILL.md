---
name: task-close-checklist
description: タスク完了前の最終チェックを標準化し、記録漏れと報告漏れを防ぐ
---

# SKILL: task-close-checklist

## 目的
タスク完了時の最終ゲートを統一し、完了品質を一定化する。

## Checklist（完了前）
- [ ] 変更目的と差分が最終報告に記載されている
- [ ] 必要な検証（lint/test/build の存在分）を実施した
- [ ] `skill-run-logger` を記録した
- [ ] 最終報告に `task_id/result/evidence` 要約を含めた
- [ ] 機密情報を含んでいない

## 運用
- 1つでも未達がある場合は完了扱いにしない。
- 未達項目は「次アクション」として明記する。
