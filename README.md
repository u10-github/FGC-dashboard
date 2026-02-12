# FGC Steam同時接続ダッシュボード

Steamの格闘ゲーム複数タイトルについて、プレイ中同時接続数を1画面で表示するダッシュボードです。

## 開発

```bash
npm install
npm run fetch:players
npm run dev
```

- `public/data/games.json`: タイトル定義（固定順）
- `public/data/players.json`: 取得スクリプトの出力
- `scripts/fetch-steam-players.ts`: Steam APIから人数を取得

## デプロイ（GitHub Pages）

- `main` へのpush
- 手動実行 `workflow_dispatch`
- 10分ごとの定期実行

で `.github/workflows/pages.yml` が動作し、人数更新後にPagesへ再デプロイします。

## 注意

表示指標は「Steamにログイン中の人数」ではなく、Steam APIで取得できる「そのゲームをプレイ中の同時接続数」です。
