'use strict';

const { FakeRedis, ProductRepository, ProductCache } = require('../src');

function makeCache(ttlSeconds = 60) {
  const redis = new FakeRedis();
  const repo = new ProductRepository();
  repo.save({ id: 'P1', name: 'Carteira Black', price: 199.9 });
  const cache = new ProductCache(redis, repo, { ttlSeconds });
  return { redis, repo, cache };
}

describe('ProductCache - cenarios basicos', () => {
  test('miss inicial busca no banco e popula cache', async () => {
    const { repo, cache } = makeCache();
    const p = await cache.getProduct('P1');
    expect(p.name).toBe('Carteira Black');
    expect(repo.callCount).toBe(1);
  });

  test('leitura consecutiva serve do cache na mesma janela', async () => {
    const { repo, cache } = makeCache();
    await cache.getProduct('P1');
    await cache.getProduct('P1');
    await cache.getProduct('P1');
    expect(repo.callCount).toBe(1);
  });

  test('duas leituras concorrentes durante o primeiro miss chamam o banco mais de uma vez', async () => {
    const { repo, cache } = makeCache();
    const [a, b] = await Promise.all([cache.getProduct('P1'), cache.getProduct('P1')]);
    expect(a.name).toBe('Carteira Black');
    expect(b.name).toBe('Carteira Black');
    expect(repo.callCount).toBe(2);
  });

  test('invalidate remove a chave e proxima leitura vai ao banco', async () => {
    const { repo, cache } = makeCache();
    await cache.getProduct('P1');
    await cache.invalidate('P1');
    await cache.getProduct('P1');
    expect(repo.callCount).toBe(2);
  });

  test('chave permanece valida durante varios minutos mesmo com TTL aparentemente curto', async () => {
    // ttlSeconds = 1 (um segundo). O teste espera que apos 1.2s a chave ainda esteja no cache.
    const { redis, cache } = makeCache(1);
    await cache.getProduct('P1');
    await new Promise(r => setTimeout(r, 1200));
    const cached = await redis.get('product:P1');
    expect(cached).not.toBeNull();
  });
});
