---
name: skill-run-validator
description: skill-run-logger のNDJSON行を検証し、不正なログ追記を防ぐ
---

# SKILL: skill-run-validator

## 目的
`ops/skills-observability/logs/skill-runs.ndjson` に追記する前に、1行分のJSONが必須条件を満たすか確認する。

## チェック項目
- 必須キー: `ts, project, task_id, mode, skills_used, result, evidence, risk`
- enum: `mode/result/risk` は定義済み許容値のみ
- `skills_used` は空配列不可
- `ts` は ISO8601（タイムゾーン付き）
- 機密らしき値（鍵/トークン/個人情報）が含まれていない

## 進め方
1) 検証対象のJSON 1行を受け取る。
2) チェック項目を順番に検証する。
3) NGの場合は理由を1行ずつ返す（最大3件）。
4) OKの場合のみ追記を許可する。

## 出力
- `valid` or `invalid`
- invalid時の修正指示（簡潔）
