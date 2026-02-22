---
name: approval-rules
description: 実行前にユーザー承認が必要な操作の一覧。
---

# Approval Rules

## 要承認
- 依存関係の追加/更新（npm/pnpm/yarn add、lockfile大変更、major upgrade）
- DB/ストレージのマイグレーション、データ削除、reset、seed
- `.env` / シークレット/鍵/トークンを扱う作業（表示・コミット禁止）
- OSやWSL環境に影響する操作（sudo、apt upgrade、権限変更）
- 大量ファイル変更（例: 100ファイル超、または自動生成の一括書き換え）
