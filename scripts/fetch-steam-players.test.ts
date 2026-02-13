import { describe, expect, it, vi } from 'vitest';
import { buildPlayerPayload, toLinkData, type Game, type PlayerPayload } from './fetch-steam-players';

describe('toLinkData', () => {
  it('returns null links when appid is null', () => {
    expect(toLinkData(null)).toEqual({ storeUrl: null, runUrl: null });
  });

  it('returns store and run links when appid exists', () => {
    expect(toLinkData(123)).toEqual({
      storeUrl: 'https://store.steampowered.com/app/123/',
      runUrl: 'steam://run/123',
    });
  });
});

describe('buildPlayerPayload', () => {
  it('keeps fixed order and sets null for disabled or missing appid', async () => {
    const games: Game[] = [
      { id: 'a', name: 'A', appid: 100, enabled: true },
      { id: 'b', name: 'B', appid: null, enabled: true },
      { id: 'c', name: 'C', appid: 300, enabled: false },
    ];

    const fetcher = vi.fn(async (appid: number) => appid * 2);
    const saleFetcher = vi.fn(async () => ({ isOnSale: true, discountPercent: 50 }));
    const payload = await buildPlayerPayload(games, null, fetcher, saleFetcher);

    expect(payload.items.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(payload.items[0].playerCount).toBe(200);
    expect(payload.items[0].isOnSale).toBe(true);
    expect(payload.items[0].discountPercent).toBe(50);
    expect(payload.items[1].playerCount).toBeNull();
    expect(payload.items[1].isOnSale).toBeNull();
    expect(payload.items[1].discountPercent).toBeNull();
    expect(payload.items[2].playerCount).toBeNull();
    expect(payload.items[2].isOnSale).toBeNull();
    expect(payload.items[2].discountPercent).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(saleFetcher).toHaveBeenCalledTimes(1);
  });

  it('falls back to previous playerCount when fetch fails', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const games: Game[] = [{ id: 'sf6', name: 'Street Fighter 6', appid: 1364780, enabled: true }];
    const previous: PlayerPayload = {
      updatedAt: '2026-02-12T00:00:00.000Z',
      items: [
        {
          id: 'sf6',
          name: 'Street Fighter 6',
          appid: 1364780,
          playerCount: 999,
          isOnSale: true,
          discountPercent: 35,
          storeUrl: 'https://store.steampowered.com/app/1364780/',
          runUrl: 'steam://run/1364780',
        },
      ],
    };

    const fetcher = vi.fn(async () => {
      throw new Error('network failed');
    });

    const saleFetcher = vi.fn(async () => {
      throw new Error('store failed');
    });

    const payload = await buildPlayerPayload(games, previous, fetcher, saleFetcher);

    expect(payload.items[0].playerCount).toBe(999);
    expect(payload.items[0].isOnSale).toBe(true);
    expect(payload.items[0].discountPercent).toBe(35);
  });
});


describe('games catalog integrity', () => {
  it('uses the correct appid for AQUAPAZZA: Aquaplus Dream Match', async () => {
    const { readFile } = await import('node:fs/promises');
    const { resolve } = await import('node:path');
    const gamesPath = resolve(process.cwd(), 'public/data/games.json');

    const games = JSON.parse(await readFile(gamesPath, 'utf8')) as Game[];
    const aquapazza = games.find((game) => game.id === 'aquapazza-aquaplus-dream-match');

    expect(aquapazza).toBeTruthy();
    expect(aquapazza?.appid).toBe(3229260);
  });
});
