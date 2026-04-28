'use strict';

const { CreditCard } = require('./credit-card');

class StandardCreditCard extends CreditCard {
  calculateFees(amount) {
    return amount * 0.025;
  }
}

class PremiumCreditCard extends CreditCard {
  constructor(props) {
    super(props);
    this.cashbackRate = 0.01;
  }

  calculateFees(amount) {
    return amount * 0.015;
  }

  cashback(amount) {
    return amount * this.cashbackRate;
  }
}

/**
 * Cartao pre-pago.
 *
 * Regra de negocio: cartao pre-pago nao aceita estorno.
 * Se o cliente pedir refund, o sistema deve recusar.
 */
class PrepaidCreditCard extends CreditCard {
  refund(amount) {
    throw new Error('Operacao nao suportada: cartao pre-pago nao aceita estorno');
  }

  calculateFees(amount) {
    return 0;
  }
}

module.exports = { StandardCreditCard, PremiumCreditCard, PrepaidCreditCard };
