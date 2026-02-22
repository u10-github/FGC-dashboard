# Harness Kit適用手順

## 目的
最小コアで対象プロジェクトをレベル3 -> 4 -> 5へ引き上げる:
- `doc/DoD.md`
- `doc/evals.md`
- `doc/runbook.md`
- PR gate (`test` + `build`)
- Sacred Zones (S1-S3)

## 適用手順
1. テンプレファイルをコピーする:
   - `templates/doc/DoD.template.md` -> `doc/DoD.md`
   - `templates/doc/evals.template.md` -> `doc/evals.md`
   - `templates/doc/runbook.template.md` -> `doc/runbook.md`
   - `templates/.github/pull_request_template.md` -> `.github/pull_request_template.md`
   - `templates/.github/workflows/ci.node.template.yml` -> `.github/workflows/ci.yml`
   - `templates/AGENTS.harness.template.md` -> `AGENTS.md`（既存ルールにマージ）
2. プレースホルダを置換する:
   - `{PROJECT_NAME}`, `{DEPLOYMENT}`, `{PAGES_URL}`
   - `{CRITICAL_FLOW_1}`, `{CRITICAL_FLOW_2}`, `{CRITICAL_FLOW_3}`
   - `{TEST_CMD}`, `{BUILD_CMD}`, `{E2E_CMD}`, `{NODE_VERSION}`, `{PACKAGE_MANAGER}`
3. 差分調整ポイント:
   - PRゲートは軽量（`test` + `build`）に限定する。
   - 重いE2Eは `main` push、nightly、manual trigger へ分離する。
   - 聖域はまず3本に固定し、必要時のみ拡張する。
4. ブランチ保護を設定する:
   - リポジトリ設定 -> `main` のBranch protection rulesを開く。
   - `Require status checks to pass before merging` を有効化。
   - `.github/workflows/ci.yml` のチェック名（`Test`、`Build` またはジョブ名）を必須に設定。
5. 最初のbootstrap PRを作成する:
   - S1-S3影響判定を記載する。
   - 証跡（`test`/`build` 結果）を記載する。
   - ロールバック手順を記載する。

## 自然な成長ループ
- 各PRで `skill-harness-grow` を実行する。
- 各インシデントで `skill-incident-to-harness` を実行する。
- ルール: ドキュメント更新なしにインシデントをクローズしない。

## 適用例（架空）
- プロジェクト: `{PROJECT_NAME}=acme-notes-web`
- デプロイ: `{DEPLOYMENT}=GitHub Pages main push auto deploy`
- 聖域:
  - `{CRITICAL_FLOW_1}=create note`
  - `{CRITICAL_FLOW_2}=edit note`
  - `{CRITICAL_FLOW_3}=delete note`
- コマンド:
  - `{TEST_CMD}=npm test -- --runInBand`
  - `{BUILD_CMD}=npm run build`
  - `{E2E_CMD}=npm run test:e2e`
- 結果:
  - PR必須チェックは `test` + `build` になった。
  - E2Eは nightly と manual 実行へ分離した。
  - インシデント対応時に runbook/evals を同一PRで更新する運用になった。
