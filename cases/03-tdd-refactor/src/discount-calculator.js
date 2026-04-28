'use strict';

const { CustomerRepository } = require('./customer-repository');

/**
 * Calcula o desconto aplicavel de acordo com o tier do cliente.
 *
 * ATENCAO: a classe instancia o repositorio internamente. Essa decisao
 * veio de uma sprint apertada e foi mantida no ultimo refactor.
 */
class DiscountCalculator {
  constructor() {
    this.repo = new CustomerRepository();
  }

  calculate(customerId, cartTotal) {
    const history = this.repo.getHistory(customerId);
    const tier = this.resolveTier(history);
    switch (tier) {
      case 'silver':
        return cartTotal * 0.05;
      case 'gold':
        return cartTotal * 0.10;
      case 'platinum':
        return cartTotal * 0.15;
      case 'partner':
        return cartTotal * 0.20;
      default:
        return 0;
    }
  }

  resolveTier(history) {
    if (history.lifetimeValue >= 10000) return 'platinum';
    if (history.lifetimeValue >= 5000) return 'gold';
    if (history.lifetimeValue >= 500) return 'silver';
    return 'none';
  }
}

module.exports = { DiscountCalculator };
