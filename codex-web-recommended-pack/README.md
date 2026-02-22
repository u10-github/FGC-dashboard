# Codex Web Recommended Pack

このフォルダは、各プロジェクトに配置して Codex Web に読ませるための最小推奨セットです。

## 含めたもの
- `AGENTS.md`
- `agents/base/AGENT.md`
- `doc/how-to-apply-harness-kit.md`
- `scripts/arch_guard.sh`
- `templates/`
  - `templates/doc/DoD.template.md`
  - `templates/doc/evals.template.md`
  - `templates/doc/runbook.template.md`
  - `templates/docs/arch/README.template.md`
  - `templates/docs/arch/core-change.template.md`
  - `templates/tests/contract/README.template.md`
  - `templates/.github/pull_request_template.md`
  - `templates/.github/workflows/ci.node.template.yml`
  - `templates/AGENTS.harness.template.md`
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
  - `arch_guard`
  - `core-extensions-bootstrap`
  - `skill-harness-bootstrap`
  - `skill-harness-grow`
  - `skill-incident-to-harness`

## 使い方
1. このフォルダ配下をプロジェクトルートにコピーします。
2. ハーネス導入時は `doc/how-to-apply-harness-kit.md` の手順で最小コアを適用します。
3. 追加で必要なスキル（例: `10-requirements`, `20-implementation`, `30-quality`）は用途に応じて追加してください。
