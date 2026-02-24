# FGC-dashboard

FGC向けのSteam同時接続数ダッシュボードです。  
`public/data/players.json` を読み込み、タイトルごとの同接数とセール情報を一覧表示します。

## 技術スタック

- React 18
- TypeScript
- Vite
- Vitest

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

## テスト

```bash
npm test
```

## ビルド

```bash
npm run build
```

## データ更新

Steam API / Store API から最新データを取得して `public/data/players.json` を更新します。

```bash
npm run fetch:players
```

## 主要ディレクトリ

- `src/`: UI本体
- `public/data/`: 表示データ（`games.json`, `players.json`）
- `scripts/`: データ取得スクリプト
- `doc/`: 運用ドキュメント（runbook/evals/DoD）
