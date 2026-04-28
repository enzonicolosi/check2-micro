'use strict';

class IdempotencyStore {
  constructor() {
    this.seen = new Map();
  }

  /**
   * Registra a chave e retorna true se for a primeira vez.
   * Se ja foi vista, retorna false.
   */
  register(key, ttlSeconds = 300) {
    const now = Date.now();
    const existing = this.seen.get(key);
    if (existing && existing.expiresAt > now) {
      return false;
    }
    this.seen.set(key, { expiresAt: now + ttlSeconds * 1000 });
    return true;
  }

  clear() {
    this.seen.clear();
  }
}

module.exports = { IdempotencyStore };
