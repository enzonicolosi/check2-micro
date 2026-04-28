'use strict';

/**
 * Balanceador Round Robin. Mantem uma lista de servidores
 * e um cursor interno que avanca a cada pick().
 */
class RoundRobinBalancer {
  constructor(servers) {
    this.servers = servers.slice();
    this.cursor = 0;
  }

  pick() {
    if (this.servers.length === 0) return null;
    const server = this.servers[this.cursor % this.servers.length];
    this.cursor += 1;
    return server;
  }

  /**
   * Remove um servidor da rotacao.
   * Nao ajusta o cursor apos remocao.
   */
  remove(server) {
    this.servers = this.servers.filter(s => s !== server);
  }

  add(server) {
    this.servers.push(server);
  }

  snapshot() {
    return this.servers.slice();
  }
}

module.exports = { RoundRobinBalancer };
