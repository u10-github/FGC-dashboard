import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const okPayload = {
  updatedAt: '2026-02-12T00:00:00.000Z',
  items: [
    {
      id: 'street-fighter-6',
      name: 'Street Fighter 6',
      appid: 1364780,
      playerCount: 30905,
      storeUrl: 'https://store.steampowered.com/app/1364780/',
      runUrl: 'steam://run/1364780',
    },
  ],
};

describe('App', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('renders title, count and store link when fetch succeeds', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as typeof fetch;

    render(<App />);

    expect(await screen.findByText('Street Fighter 6')).toBeInTheDocument();
    expect(screen.getByText('30,905')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Store' })).toHaveAttribute(
      'href',
      'https://store.steampowered.com/app/1364780/',
    );
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(async () => new Response('error', { status: 500 })) as typeof fetch;

    render(<App />);

    expect(await screen.findByText('データの取得に失敗しました (500)')).toBeInTheDocument();
  });

  it('registers auto refresh interval as 60 seconds', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    global.fetch = fetchMock as typeof fetch;

    render(<App />);
    await screen.findByText('Street Fighter 6');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy.mock.calls.length).toBeGreaterThanOrEqual(1);

    const intervalArgs = setIntervalSpy.mock.calls.map((call) => call[1]);
    expect(intervalArgs).toContain(60_000);
  });
});
