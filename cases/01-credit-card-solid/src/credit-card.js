'use strict';

const { Logger } = require('./logger');
const { Notifier } = require('./notifier');

/**
 * Classe base de cartao de credito.
 *
 * ATENCAO: este codigo foi escrito sob pressao e contem violacoes
 * intencionais que serao cobradas na prova. Nao refatore.
 */
class CreditCard {
  constructor({ number, holder, limit }) {
    if (new.target === CreditCard) {
      throw new Error('CreditCard e abstrata e nao deve ser instanciada diretamente');
    }
    this.number = number;
    this.holder = holder;
    this.limit = limit;
    this.balance = 0;
    this.logger = new Logger();
    this.notifier = new Notifier();
  }

  authorize(amount) {
    if (amount <= 0) {
      throw new Error('Valor invalido');
    }
    if (this.balance + amount > this.limit) {
      this.logger.error('Autorizacao negada por limite', { amount, balance: this.balance });
      this.notifier.sendSms(this.holder, `Compra de R$ ${amount} negada por limite.`);
      return { approved: false, reason: 'limit_exceeded' };
    }
    this.balance += amount;
    this.logger.info('Autorizacao aprovada', { amount, balance: this.balance });
    this.notifier.sendEmail(this.holder, 'Compra aprovada', `Compra de R$ ${amount} aprovada.`);
    return { approved: true, authorizationCode: `AUTH-${Date.now()}` };
  }

  refund(amount) {
    if (amount <= 0) {
      throw new Error('Valor invalido');
    }
    if (amount > this.balance) {
      this.logger.error('Refund maior que saldo', { amount, balance: this.balance });
      return { refunded: false, reason: 'amount_exceeds_balance' };
    }
    this.balance -= amount;
    this.logger.info('Refund aprovado', { amount, balance: this.balance });
    this.notifier.sendEmail(this.holder, 'Estorno realizado', `Estorno de R$ ${amount} efetuado.`);
    return { refunded: true };
  }

  calculateFees(amount) {
    return amount * 0.02;
  }
}

module.exports = { CreditCard };
