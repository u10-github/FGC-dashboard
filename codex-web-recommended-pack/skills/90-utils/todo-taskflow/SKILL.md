---
name: todo-taskflow
description: TODO.mdで計画 → 実装 → 検証の流れを運用し、Definition of Ready (DoR)、受け入れ条件、Definition of Done (DoD)を扱う。TODO.mdの作成/更新、TODO.mdに基づく実行、作業ログ更新が必要なときに使う。DoDはアプリ作成タスクのみ適用する。
---

# TODOタスクフロー

## 概要
TODO.mdを基点に、計画、実装、検証、ログ更新を行うためのスキルです。既存フォーマットは保持し、必要最小限の項目だけを追加します。

## ワークフロー（計画 → 実装 → 検証）

1) TODO.mdを特定して読む
- 複数ある場合はどれを使うか確認する。
- 既存の見出しとタスク形式を維持する。

2) タスクを「Ready」にする（DoR）
- 種別、目的、受け入れ条件、変更対象、検証手順、リスク/不確実点、承認要否が揃っていることを確認する。
- 欠けている場合は仮置きで追記し、前提を明記する。

3) 変更前に計画を書く
- コード編集の前にTODO.mdへ計画を追記/更新する。
- テスト不能または大きすぎるタスクは分割する。

4) 実装
- AGENTS.mdのルールに従う。
- 無関係なタスクやセクションは編集しない。

5) 検証して完了
- `種別: app` は `references/dod-app.md` のDoDを満たしてから完了にする。
- `種別: doc/ops` はDoD省略可。省略理由を記載する。
- 作業ログに日付と結果を追記する。

## ルール
- 既存の作業ログや完了タスクは削除しない。
- 新規タスクは該当セクション末尾に追加する。
- 作業ログの日付はYYYY-MM-DD（可能ならAsia/Tokyo）にする。
- `承認要否: Yes` の場合は実行前に必ず確認する。
 - 実装の一般原則や流れの補助は `implementation-playbook` を参照する。

## 参照
- `references/todo-template.md` - テンプレートと項目例
- `references/dor-checklist.md` - Readyチェックリスト
- `references/dod-app.md` - appタスク用DoDチェック
- `references/acceptance-criteria.md` - 検証可能な受け入れ条件の書き方
- `references/logging.md` - 作業ログの書式
