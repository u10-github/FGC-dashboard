import { useCallback, useEffect, useMemo, useState } from 'react';

type PlayerItem = {
  id: string;
  name: string;
  appid: number | null;
  playerCount: number | null;
  storeUrl: string | null;
  runUrl: string | null;
};

type PlayerPayload = {
  updatedAt: string;
  items: PlayerItem[];
};

const REFETCH_INTERVAL_MS = 60_000;
const PLAYERS_ENDPOINT = `${import.meta.env.BASE_URL}data/players.json`;

function formatCount(value: number | null): string {
  if (value === null) {
    return '--';
  }
  return new Intl.NumberFormat('ja-JP').format(value);
}

function formatJst(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function App() {
  const [payload, setPayload] = useState<PlayerPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlayers = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const cacheBuster = Date.now();
      const response = await fetch(`${PLAYERS_ENDPOINT}?t=${cacheBuster}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`データの取得に失敗しました (${response.status})`);
      }

      const body = (await response.json()) as PlayerPayload;
      setPayload(body);
    } catch (err) {
      const message = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlayers(true);

    const timer = window.setInterval(() => {
      void fetchPlayers(false);
    }, REFETCH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [fetchPlayers]);

  const rows = useMemo(() => payload?.items ?? [], [payload]);

  return (
    <main className="layout">
      <section className="card">
        <header className="header">
          <div>
            <h1>FGC Steam 同時接続ダッシュボード</h1>
            <p>Steamの「プレイ中同時接続数」を固定順で表示します。</p>
          </div>
          <div className="status-area">
            <p>
              最終更新: {payload ? `${formatJst(payload.updatedAt)} JST` : '--'}
            </p>
            <p>自動更新: 60秒ごと</p>
            <button
              type="button"
              onClick={() => void fetchPlayers(false)}
              disabled={loading || refreshing}
            >
              {refreshing ? '更新中...' : '今すぐ更新'}
            </button>
          </div>
        </header>

        {loading ? <p className="message">データを読み込み中...</p> : null}
        {error ? <p className="message error">{error}</p> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>プレイ中人数</th>
                <th>ストア</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="count">{formatCount(item.playerCount)}</td>
                    <td>
                      {item.storeUrl ? (
                        <a href={item.storeUrl} target="_blank" rel="noreferrer">
                          Store
                        </a>
                      ) : (
                        <span className="muted">AppID未設定</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
