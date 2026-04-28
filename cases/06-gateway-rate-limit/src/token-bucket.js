'use strict';

/**
 * Rate limiter com algoritmo Token Bucket.
 *
 * capacity: quantidade maxima de tokens que o bucket pode armazenar.
 * refillPerSecond: tokens adicionados por segundo.
 *
 * A cada consume(n), tenta retirar n tokens. Se nao houver, recusa.
 */
class TokenBucket {
  constructor({ capacity, refillPerSecond, clock }) {
    this.capacity = capacity;
    this.refillPerSecond = refillPerSecond;
    this.tokens = capacity;
    this.clock = clock || { now: () => Date.now() };
    this.lastRefillAt = this.clock.now();
  }

  refill() {
    const now = this.clock.now();
    const elapsedSeconds = (now - this.lastRefillAt) / 1000;
    const newTokens = elapsedSeconds * this.refillPerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + newTokens);
    this.lastRefillAt = now;
  }

  consume(n = 1) {
    this.refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }

  available() {
    this.refill();
    return this.tokens;
  }
}

module.exports = { TokenBucket };
