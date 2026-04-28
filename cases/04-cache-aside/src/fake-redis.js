'use strict';

/**
 * Cliente Redis simulado. Segue o contrato do comando SETEX do Redis real:
 * o TTL e informado em SEGUNDOS.
 *
 * Exemplo: setex('chave', 60, 'valor') mantem a chave por 60 segundos.
 */
class FakeRedis {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * setex(key, ttlSeconds, value): ttl esperado em SEGUNDOS.
   */
  async setex(key, ttlSeconds, value) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(key) {
    this.store.delete(key);
  }
}

module.exports = { FakeRedis };
