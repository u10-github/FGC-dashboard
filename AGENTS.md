# ~/.codex/AGENTS.md（個人環境向け / 方針最優先）

## 0. TL;DR（不変ルール）
- 基本：編集して進める。小さな差分で段階的に進める。
- PRは小さく（1PR=1目的）。PR本文必須: 目的/変更点/処理フロー/不変条件/失敗時挙動/検証方法/ロールバック。検証証跡は最低1つ（テスト結果 or 手動再現手順 or スクショ）。
- AIがコード生成/修正する場合は、t-wada流TDD（Red→Green→Refactor、テスト先行）を原則とする。
- 要件整理時はGA-liteで候補出しを行う（`ga-lite-requirements`）。
- 変更前：最初に「作業計画（箇条書き）」を提示し、その直後に着手する。
- 不足情報の確認は最大2問。残りは仮置きし、仮定は明記する（重大領域は安全優先で追加可）。
- DoR未達は着手しない（仮置きは明記）。/docがある場合、要件ID/トレース方針が不明なタスクは着手しない（仮置きは明記）。
- DoD：`種別: app` のタスクのみ必須。`doc/ops` は省略可（理由記載）。
- 変更後：プロジェクト既定の `lint → test → build` を優先順で実行し、結果を短く報告する（存在するものだけ）。
- 長時間・副作用・破壊的操作の可能性があるコマンドは、実行前に確認する（最小/対象限定→全体）。
- 「要承認」に当てはまる操作は、実行前に必ず止まって確認する（勝手に進めない）。
- 文書の最小契約（DDD）：契約は1枚（Core Contract）のみ。置き場は例として `doc/DOMAIN.md`。内容は用語≤10/主要UC3〜5/禁止事項のみ。設計理由・補足・例外・実装詳細はPR本文で回収し、新規設計ドキュメントは増やさない。
- コミットが必要な場合は、日本語のコミットメッセージ案を提示する。
- シークレット方針：鍵/トークン/個人情報らしき値は復唱しない。必要ならマスクを依頼する。
- 優先順位：ユーザーの最新指示 ＞ この `AGENTS.md` ＞ 一般的な作法。
- 【区切り】``` ``` / --- / 「引用：」は改変しない。コード/設定/YAML/プロンプトは記号維持。

## 1. Mode Router
- 依頼内容から用途を推定し、冒頭で「今回は◯◯モード」と宣言する。
- 詳細手順と出力テンプレは `mode-router` / `response-templates` を参照する。

## 2. Skillsの使い分け（要約）
- 優先順位リスト（上ほど優先）:
  1) TL;DRの不変ルール
  2) `approval-rules`
  3) `todo-taskflow`
  4) 依頼内容に一致するSkill（複数なら目的に最も近いもの）
- 運用方針: Skillsは用途別prefixで並べる（`00-core/` `10-requirements/` `20-implementation/` `30-quality/` `40-git/` `90-utils/`）。
- `00-core`: `mode-router` / `response-templates` / `reporting-conventions`
- `10-requirements`: `ga-lite-requirements` / `requirements-doc-sync`
- `20-implementation`: `implementation-playbook` / `tdd-twada`
- `30-quality`: `second-pass-code-review`
- `40-git`: `how-to-git-push`
- `90-utils`: 上記以外（例: `exploration-guidelines`, `ga-decision`, `ga-lite-coding`, `comment-guidelines`, `beginner-explanations`）

## 3. Skills監査（観測・評価・月次）
- 追記先: `ops/skills-observability/logs/skill-runs.ndjson`（機密は書かない）
- 使い方: 完了時は `skill-run-logger` / 手戻り時は `skill-run-evaluator` / 月次は `skills-monthly-review`
- 完了条件（運用）: すべてのタスクで `skill-run-logger` 記録を必須とする。未記録のまま完了報告/コミット/PR作成をしない。
- 最終報告には `task_id/result/evidence` の記録要約を必ず含める。
- 参照: `ops/skills-observability/README.md`
