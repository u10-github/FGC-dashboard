import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type Game = {
  id: string;
  name: string;
  appid: number | null;
  enabled: boolean;
};

export type PlayerItem = {
  id: string;
  name: string;
  appid: number | null;
  playerCount: number | null;
  storeUrl: string | null;
  runUrl: string | null;
};

export type PlayerPayload = {
  updatedAt: string;
  items: PlayerItem[];
};

type PlayerFetcher = (appid: number) => Promise<number>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const gamesPath = path.resolve(repoRoot, 'public/data/games.json');
const playersPath = path.resolve(repoRoot, 'public/data/players.json');

async function readJson<T>(filepath: string): Promise<T> {
  const raw = await readFile(filepath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function getCurrentPlayers(appid: number): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`,
      { signal: controller.signal },
    );
    if (!res.ok) {
      throw new Error(`Steam API error (${res.status})`);
    }

    const body = (await res.json()) as { response?: { player_count?: number } };
    const count = body.response?.player_count;
    if (typeof count !== 'number') {
      throw new Error('Steam API response missing player_count');
    }

    return count;
  } finally {
    clearTimeout(timeout);
  }
}

export function toLinkData(appid: number | null): Pick<PlayerItem, 'storeUrl' | 'runUrl'> {
  if (!appid) {
    return { storeUrl: null, runUrl: null };
  }
  return {
    storeUrl: `https://store.steampowered.com/app/${appid}/`,
    runUrl: `steam://run/${appid}`,
  };
}

export async function buildPlayerPayload(
  games: Game[],
  previous: PlayerPayload | null,
  fetcher: PlayerFetcher,
): Promise<PlayerPayload> {
  const previousMap = new Map(previous?.items.map((item) => [item.id, item.playerCount]) ?? []);
  const items: PlayerItem[] = [];

  for (const game of games) {
    const linkData = toLinkData(game.appid);

    if (!game.enabled || !game.appid) {
      items.push({
        id: game.id,
        name: game.name,
        appid: game.appid,
        playerCount: null,
        ...linkData,
      });
      continue;
    }

    try {
      const playerCount = await fetcher(game.appid);
      items.push({
        id: game.id,
        name: game.name,
        appid: game.appid,
        playerCount,
        ...linkData,
      });
    } catch (error) {
      const fallback = previousMap.get(game.id) ?? null;
      console.warn(`Failed to fetch appid=${game.appid}:`, error);
      items.push({
        id: game.id,
        name: game.name,
        appid: game.appid,
        playerCount: fallback,
        ...linkData,
      });
    }
  }

  return {
    updatedAt: new Date().toISOString(),
    items,
  };
}

export async function run(): Promise<void> {
  const games = await readJson<Game[]>(gamesPath);

  let previous: PlayerPayload | null = null;
  try {
    previous = await readJson<PlayerPayload>(playersPath);
  } catch {
    previous = null;
  }

  const payload = await buildPlayerPayload(games, previous, getCurrentPlayers);
  await mkdir(path.dirname(playersPath), { recursive: true });
  await writeFile(playersPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${payload.items.length} items to ${path.relative(repoRoot, playersPath)}`);
}

if (path.resolve(process.argv[1] ?? '') === __filename) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
