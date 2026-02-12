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

## 再起テスト（回帰テスト）

```bash
npm test
```

テストケース:

- `scripts/fetch-steam-players.test.ts`
  - `appid` あり/なしでリンク生成が正しい
  - `games.json` の固定順で `players.json` を生成する
  - API失敗時に前回 `players.json` の人数へフォールバックする
- `src/App.test.tsx`
  - 一覧・人数・起動/Storeリンクを描画する
  - 取得失敗時にエラーメッセージを表示する
  - 60秒間隔の自動更新タイマーを登録する

## デプロイ（GitHub Pages）

- `main` へのpush
- 手動実行 `workflow_dispatch`
- 10分ごとの定期実行

で `.github/workflows/pages.yml` が動作し、人数更新後にPagesへ再デプロイします。

## 注意

表示指標は「Steamにログイン中の人数」ではなく、Steam APIで取得できる「そのゲームをプレイ中の同時接続数」です。
