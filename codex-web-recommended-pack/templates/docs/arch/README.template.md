# Core & Extensions Architecture

## 目的
Coreの不変条件を外部依存から切り離し、拡張はExtensions/Adaptersに閉じ込める。

## ルール
- 許可: `extensions|adapters -> core`
- 禁止: `core -> extensions|adapters`
- Core禁止: DB/HTTP/fs/env/time/framework依存

## Core変更時の必須項目
1. 変更理由（契約/不変条件）
2. 影響範囲
3. 契約テスト更新
4. 回帰実行
5. `docs/arch/core-change.md` 更新

## 検問
- `./scripts/arch_guard.sh` をPR前に実行する。
