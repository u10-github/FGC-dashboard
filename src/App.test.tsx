import { cleanup, render, screen } from '@testing-library/react';
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
      isOnSale: true,
      discountPercent: 35,
      storeUrl: 'https://store.steampowered.com/app/1364780/',
      runUrl: 'steam://run/1364780',
    },
  ],
};

describe('App', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('renders title as store link and count when fetch succeeds', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as typeof fetch;

    render(<App />);

    expect(await screen.findByRole('link', { name: 'Street Fighter 6' })).toBeInTheDocument();
    expect(screen.getByText('30,905')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Street Fighter 6' })).toHaveAttribute(
      'href',
      'https://store.steampowered.com/app/1364780/',
    );
    expect(screen.getByText('SALE -35%')).toBeInTheDocument();
  });

  it('shows two columns without Store column', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as typeof fetch;

    render(<App />);

    expect(await screen.findByText('同接数')).toBeInTheDocument();
    expect(screen.queryByText('ストア')).not.toBeInTheDocument();
  });

  it('highlights rows when game is on sale', async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as typeof fetch;

    const { container } = render(<App />);
    await screen.findByText('Street Fighter 6');

    const saleRow = container.querySelector('tr.sale-row');
    expect(saleRow).toBeTruthy();
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(async () => new Response('error', { status: 500 })) as typeof fetch;

    render(<App />);

    expect(await screen.findByText('データの取得に失敗しました (500)')).toBeInTheDocument();
  });

  it('does not show manual refresh controls', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify(okPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    render(<App />);
    await screen.findByText('Street Fighter 6');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: '今すぐ更新' })).not.toBeInTheDocument();
    expect(screen.queryByText('自動更新: 60秒ごと')).not.toBeInTheDocument();
  });
});
