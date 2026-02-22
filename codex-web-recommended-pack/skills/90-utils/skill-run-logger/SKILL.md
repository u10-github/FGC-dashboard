---
name: skill-run-logger
description: Skillsの実行ログ（NDJSON）を安全に追記する
---

# SKILL: skill-run-logger

## Inputs
### 必須
- task_id: タスク識別子（例: `P1-SKILL-LOGGING`）
- mode: `implementation|bugfix|investigation|writing|other`
- skills_used: 使用したSkill名の配列（1件以上）
- result: `success|partial|fail`
- evidence: 検証証跡の要約（テスト結果/手動手順/スクショなど）
- risk: `low|medium|high`

### 任意
- notes: 補足メモ

## NDJSON schema
1行に以下のJSONオブジェクトを記録する。

- `ts` (string): ISO8601（タイムゾーン付き）
- `project` (string): リポジトリ名
- `task_id` (string)
- `mode` (enum)
- `skills_used` (array[string], minItems: 1)
- `result` (enum)
- `evidence` (string)
- `notes` (string, optional)
- `risk` (enum)

## Actions
1) 必須項目を埋める。
2) JSONオブジェクトを1行で生成する。
3) スキーマと許容値を満たす場合のみ `ops/skills-observability/logs/skill-runs.ndjson` に追記する。

## Rules
- 不正フォーマット（必須欠落/enum不一致/skills_used空配列）は追記しない。
- 機密っぽいものは記録しない。不明ならユーザーにマスクを依頼する。
- `evidence` は再現可能性を保ちつつ機密を含めない。

## Examples
### OK
```json
{"ts":"2026-01-21T10:30:00+09:00","project":"codex-surface4-260107","task_id":"P1-SKILL-LOGGER-IMPROVE","mode":"implementation","skills_used":["skill-run-logger","todo-taskflow"],"result":"success","evidence":"AGENTS.mdとSKILL.mdを更新し、lint相当の目視確認を実施","notes":"small diff","risk":"low"}
```

### NG（機密を含むため不可）
```json
{"task_id":"P1","evidence":"api_key=sk-xxxx"}
```

## Output
- 追記した1行（または要約）
- ファイルパス: ops/skills-observability/logs/skill-runs.ndjson
