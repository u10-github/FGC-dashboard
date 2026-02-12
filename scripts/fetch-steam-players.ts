import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type Game = {
  id: string;
  name: string;
  appid: number | null;
  enabled: boolean;
};

export type SaleInfo = {
  isOnSale: boolean;
  discountPercent: number;
};

export type PlayerItem = {
  id: string;
  name: string;
  appid: number | null;
  playerCount: number | null;
  isOnSale: boolean | null;
  discountPercent: number | null;
  storeUrl: string | null;
  runUrl: string | null;
};

export type PlayerPayload = {
  updatedAt: string;
  items: PlayerItem[];
};

type PlayerFetcher = (appid: number) => Promise<number>;
type SaleFetcher = (appid: number) => Promise<SaleInfo>;

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

export async function getSaleInfo(appid: number): Promise<SaleInfo> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=JP&l=japanese`, {
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Steam Store API error (${res.status})`);
    }

    const body = (await res.json()) as Record<
      string,
      {
        success?: boolean;
        data?: {
          is_free?: boolean;
          price_overview?: {
            discount_percent?: number;
          };
        };
      }
    >;

    const app = body[String(appid)];
    if (!app?.success || !app.data) {
      throw new Error('Steam Store API response missing data');
    }

    const discountPercent = app.data.price_overview?.discount_percent ?? 0;
    if (typeof discountPercent !== 'number') {
      throw new Error('Steam Store API response missing discount_percent');
    }

    return {
      isOnSale: discountPercent > 0,
      discountPercent,
    };
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
  saleFetcher: SaleFetcher,
): Promise<PlayerPayload> {
  const previousMap = new Map(previous?.items.map((item) => [item.id, item]) ?? []);
  const items: PlayerItem[] = [];

  for (const game of games) {
    const linkData = toLinkData(game.appid);

    if (!game.enabled || !game.appid) {
      items.push({
        id: game.id,
        name: game.name,
        appid: game.appid,
        playerCount: null,
        isOnSale: null,
        discountPercent: null,
        ...linkData,
      });
      continue;
    }

    let playerCount: number | null = null;
    try {
      playerCount = await fetcher(game.appid);
    } catch (error) {
      const fallback = previousMap.get(game.id)?.playerCount ?? null;
      console.warn(`Failed to fetch appid=${game.appid}:`, error);
      playerCount = fallback;
    }

    let isOnSale: boolean | null = null;
    let discountPercent: number | null = null;

    try {
      const saleInfo = await saleFetcher(game.appid);
      isOnSale = saleInfo.isOnSale;
      discountPercent = saleInfo.discountPercent;
    } catch (error) {
      const previousItem = previousMap.get(game.id);
      isOnSale = previousItem?.isOnSale ?? null;
      discountPercent = previousItem?.discountPercent ?? null;
      console.warn(`Failed to fetch sale info appid=${game.appid}:`, error);
    }

    items.push({
      id: game.id,
      name: game.name,
      appid: game.appid,
      playerCount,
      isOnSale,
      discountPercent,
      ...linkData,
    });
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

  const payload = await buildPlayerPayload(games, previous, getCurrentPlayers, getSaleInfo);
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
