# evals: {PROJECT_NAME}

## 目的
聖域（S1-S3）に対する最小の回帰チェックを管理する。

## 対応表
| Zone | Flow | 必須チェック | コマンド / 手順 | Owner |
|---|---|---|---|---|
| S1 | {CRITICAL_FLOW_1} | {CHECK_S1} | `{TEST_CMD_S1}` | {OWNER_TEAM} |
| S2 | {CRITICAL_FLOW_2} | {CHECK_S2} | `{TEST_CMD_S2}` | {OWNER_TEAM} |
| S3 | {CRITICAL_FLOW_3} | {CHECK_S3} | `{TEST_CMD_S3}` | {OWNER_TEAM} |

## PR更新ルール
- S1-S3の挙動変更がある場合は、この表を同じPRで更新する。
- 表更新が不要な場合は、PR本文に理由を書く。

## インシデント再発防止ルール
- インシデントごとに最低1本の再発防止チェックを追加する。
- 追加したチェックをrunbookのエントリIDに関連付ける。

## Core契約の回帰聖域（例）
- 例1: use-caseの入力境界値で不変条件が維持される。
- 例2: port境界が守られ、coreからadapter依存が生じない。
- 例3: time/env注入時に契約が破壊されない。

## 任意E2Eポリシー
- 既定のPRゲートは軽量CI（`test` + `build`）。
- E2Eは次のいずれかでのみ実行する:
  - `push` to `main`
  - scheduled nightly
  - manual trigger (`workflow_dispatch`)
