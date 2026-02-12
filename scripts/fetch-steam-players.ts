import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Game = {
  id: string;
  name: string;
  appid: number | null;
  enabled: boolean;
};

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const gamesPath = path.resolve(repoRoot, 'public/data/games.json');
const playersPath = path.resolve(repoRoot, 'public/data/players.json');

async function readJson<T>(filepath: string): Promise<T> {
  const raw = await readFile(filepath, 'utf8');
  return JSON.parse(raw) as T;
}

async function getCurrentPlayers(appid: number): Promise<number> {
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

function toLinkData(appid: number | null): Pick<PlayerItem, 'storeUrl' | 'runUrl'> {
  if (!appid) {
    return { storeUrl: null, runUrl: null };
  }
  return {
    storeUrl: `https://store.steampowered.com/app/${appid}/`,
    runUrl: `steam://run/${appid}`,
  };
}

async function main(): Promise<void> {
  const games = await readJson<Game[]>(gamesPath);

  let previousMap = new Map<string, number | null>();
  try {
    const previous = await readJson<PlayerPayload>(playersPath);
    previousMap = new Map(previous.items.map((item) => [item.id, item.playerCount]));
  } catch {
    previousMap = new Map();
  }

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
      const playerCount = await getCurrentPlayers(game.appid);
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

  const payload: PlayerPayload = {
    updatedAt: new Date().toISOString(),
    items,
  };

  await mkdir(path.dirname(playersPath), { recursive: true });
  await writeFile(playersPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${items.length} items to ${path.relative(repoRoot, playersPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
