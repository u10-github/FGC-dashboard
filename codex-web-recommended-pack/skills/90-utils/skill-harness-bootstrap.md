# skill-harness-bootstrap

## 目的
`{PROJECT_NAME}` に最小構成のHarness Kitを適用する。
対象は最小コアのみ: `doc` 3点 + PRゲート + 聖域S1-S3。

## 入力（必須）
- `{PROJECT_NAME}`
- `{DEPLOYMENT}`
- `{CRITICAL_FLOWS}`（3項目）

## 出力
次を含む1つのPR作成指示:
- 生成:
  - `templates/doc/DoD.template.md` から `doc/DoD.md`
  - `templates/doc/evals.template.md` から `doc/evals.md`
  - `templates/doc/runbook.template.md` から `doc/runbook.md`
- 追加: `templates/.github/workflows/ci.node.template.yml` から `.github/workflows/ci.yml`
  - PR必須チェックは `test` + `build`
  - E2Eは `main`/nightly/manual へ分離
- 追加: テンプレから `.github/pull_request_template.md`
- `AGENTS.md` にSSoTルール追記:
  - `doc/DoD.md`、`doc/evals.md`、`doc/runbook.md` をSSoTとする
- ブランチ保護設定手順の案内:
  - Require status checks before merge
  - `.github/workflows/ci.yml` で使用するCIチェック名を選択

## 手順
1. テンプレファイルを対象パスへコピーする。
2. プレースホルダを置換する:
   - `{PROJECT_NAME}`, `{DEPLOYMENT}`, `{CRITICAL_FLOW_1..3}`, `{PAGES_URL}`, `{TEST_CMD}`, `{BUILD_CMD}`, `{E2E_CMD}`.
3. 差分は最小に保つ。PR必須にフルE2Eは追加しない。
4. 必須セクション付きでPRを作成する:
   - Purpose / Changes / Flow / Invariants / Failure behavior / Validation / Rollback.
5. ブランチ保護を設定し、必須チェックが強制されることを確認する。

## 完了条件
- 最小コアのファイルが存在し、プレースホルダが解決されている。
- PRゲート（`test` + `build`）が有効になっている。
- AGENTSにSSoTとインシデント更新ルールがある。
