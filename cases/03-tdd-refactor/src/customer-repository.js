'use strict';

// Repositorio simulado. Em producao conecta em Postgres.
class CustomerRepository {
  constructor() {
    this.connected = false;
    this.connect();
  }

  connect() {
    // Simula uma conexao custosa.
    this.connected = true;
  }

  getHistory(customerId) {
    // Retorna dados fake para exemplificar.
    return {
      customerId,
      lifetimeValue: 5000,
      purchases: 5
    };
  }
}

module.exports = { CustomerRepository };
