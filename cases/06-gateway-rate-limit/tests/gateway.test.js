'use strict';

const { TokenBucket, RoundRobinBalancer, Gateway } = require('../src');

function fixedClock(initial = 0) {
  let t = initial;
  return {
    now: () => t,
    advance: ms => { t += ms; }
  };
}

describe('TokenBucket', () => {
  test('capacidade inicial permite rajada ate o limite', () => {
    const clock = fixedClock();
    const bucket = new TokenBucket({ capacity: 10, refillPerSecond: 1, clock });
    for (let i = 0; i < 10; i += 1) {
      expect(bucket.consume()).toBe(true);
    }
    expect(bucket.consume()).toBe(false);
  });

  test('apos esgotar, 5 segundos reabastece 5 tokens', () => {
    const clock = fixedClock();
    const bucket = new TokenBucket({ capacity: 10, refillPerSecond: 1, clock });
    for (let i = 0; i < 10; i += 1) bucket.consume();
    clock.advance(5000);
    expect(bucket.consume()).toBe(true);
    expect(bucket.consume()).toBe(true);
    expect(bucket.consume()).toBe(true);
    expect(bucket.consume()).toBe(true);
    expect(bucket.consume()).toBe(true);
    expect(bucket.consume()).toBe(false);
  });

  test('refill nao ultrapassa a capacidade', () => {
    const clock = fixedClock();
    const bucket = new TokenBucket({ capacity: 10, refillPerSecond: 5, clock });
    clock.advance(60_000);
    expect(bucket.available()).toBe(10);
  });
});

describe('RoundRobinBalancer', () => {
  test('distribui em ordem circular entre tres servidores', () => {
    const balancer = new RoundRobinBalancer(['boleto-1', 'boleto-2', 'boleto-3']);
    const picks = [balancer.pick(), balancer.pick(), balancer.pick(), balancer.pick()];
    expect(picks).toEqual(['boleto-1', 'boleto-2', 'boleto-3', 'boleto-1']);
  });

  test('quando um servidor e removido apos varias chamadas, a distribuicao pula posicoes', () => {
    const balancer = new RoundRobinBalancer(['boleto-1', 'boleto-2', 'boleto-3']);
    balancer.pick();
    balancer.pick();
    balancer.pick();
    balancer.pick();
    balancer.pick();
    balancer.remove('boleto-2');
    const next = [balancer.pick(), balancer.pick(), balancer.pick(), balancer.pick()];
    expect(next[0]).not.toBe('boleto-2');
    expect(next[1]).not.toBe('boleto-2');
  });
});

describe('Gateway', () => {
  test('responde 429 quando bucket esgota', () => {
    const clock = fixedClock();
    const bucket = new TokenBucket({ capacity: 3, refillPerSecond: 1, clock });
    const balancer = new RoundRobinBalancer(['s1']);
    const gw = new Gateway({ bucket, balancer });
    for (let i = 0; i < 3; i += 1) expect(gw.handle({ id: i }).status).toBe(200);
    expect(gw.handle({ id: 4 }).status).toBe(429);
  });
});
