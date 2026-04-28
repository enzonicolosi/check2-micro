'use strict';

/**
 * Cache aside para o catalogo de produtos.
 *
 * Ordem: le do cache, se miss busca no banco, popula cache e retorna.
 */
class ProductCache {
  constructor(redis, repository, options = {}) {
    this.redis = redis;
    this.repo = repository;
    // Engenheiro original configurou TTL em segundos para ficar proximo
    // ao padrao do comando SETEX do Redis real.
    this.ttlSeconds = options.ttlSeconds || 60;
  }

  async getProduct(id) {
    const cached = await this.redis.get(`product:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }
    const product = await this.repo.findById(id);
    if (product) {
      // Passa ttl em milissegundos porque o engenheiro ficou em duvida sobre a unidade.
      await this.redis.setex(`product:${id}`, this.ttlSeconds * 1000, JSON.stringify(product));
    }
    return product;
  }

  async invalidate(id) {
    await this.redis.del(`product:${id}`);
  }
}

module.exports = { ProductCache };
