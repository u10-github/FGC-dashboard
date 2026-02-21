# Codex Web Recommended Pack

このフォルダは、各プロジェクトに配置して Codex Web に読ませるための最小推奨セットです。

## 含めたもの
- `AGENTS.md`
- `skills/00-core/`
  - `mode-router`
  - `response-templates`
  - `reporting-conventions`
- `skills/90-utils/`
  - `approval-rules`
  - `todo-taskflow`
  - `skill-run-logger`
  - `skill-run-validator`
  - `task-close-checklist`

## 使い方
1. このフォルダ配下をプロジェクトルートにコピーします。
2. 追加で必要なスキル（例: `10-requirements`, `20-implementation`, `30-quality`）は用途に応じて追加してください。
