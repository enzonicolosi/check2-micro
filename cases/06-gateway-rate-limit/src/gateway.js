'use strict';

const { TokenBucket } = require('./token-bucket');
const { RoundRobinBalancer } = require('./round-robin-balancer');

/**
 * Funcao que encapsula a logica do gateway para um unico cliente.
 * Em producao esta funcao seria invocada por um middleware Express.
 */
class Gateway {
  constructor({ bucket, balancer }) {
    this.bucket = bucket;
    this.balancer = balancer;
    this.accepted = 0;
    this.rejected = 0;
  }

  handle(request) {
    if (!this.bucket.consume(1)) {
      this.rejected += 1;
      return { status: 429, message: 'rate_limited' };
    }
    const server = this.balancer.pick();
    if (!server) {
      return { status: 503, message: 'no_backends' };
    }
    this.accepted += 1;
    return { status: 200, server, payload: request };
  }
}

module.exports = { Gateway };
