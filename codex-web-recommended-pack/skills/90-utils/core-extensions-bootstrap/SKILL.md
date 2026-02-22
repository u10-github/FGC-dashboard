---
name: core-extensions-bootstrap
description: 新規プロジェクトへCore&Extensions前提の骨格を導入する。
---

# core-extensions-bootstrap

## 目的
新規プロジェクト開始時点でCore&Extensions戦略を有効化する。

## 推奨ディレクトリ
- `core/`
- `adapters/` または `extensions/`
- `tests/contract/`
- `docs/arch/`

## 互換マッピング（既存慣習がある場合）
- `src/domain` -> `core`
- `src/infrastructure` -> `adapters`
- `spec/contracts` -> `tests/contract`

## 最小生成物
- `docs/arch/README.md`
- `docs/arch/core-change.md`
- `tests/contract/README.md`
- `scripts/arch_guard.sh`

## 初回コミット手順
1. 上記ファイルを配置し、AGENTにArchitecture Contractを追記する。
2. `./scripts/arch_guard.sh` を実行する。
3. DoD/PRテンプレにcore変更時の必須項目を追加する。

## 完了条件
- Core&Extensionsの運用入口（docs/arch）が存在する。
- arch_guardをローカル実行できる。
