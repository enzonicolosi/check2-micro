'use strict';

const { SystemClock } = require('./clock');
const { IdempotencyStore } = require('./idempotency-store');

class FraudDetector {
  constructor(options = {}) {
    this.clock = options.clock || new SystemClock();
    this.store = options.store || new IdempotencyStore();
    this.velocityWindowMs = options.velocityWindowMs || 60_000;
    this.maxValue = options.maxValue || 5000;
    this.recent = [];
  }

  /**
   * Avalia uma transacao.
   * Retorna { decision: 'approve' | 'review' | 'reject' | 'duplicate', reason? }
   */
  evaluate(transaction) {
    const { idempotencyKey, amount, customerId } = transaction;

    if (!this.store.register(idempotencyKey)) {
      return { decision: 'duplicate', reason: 'idempotency_replay' };
    }

    // BUG sutil: valores negativos sao bloqueados, mas valor zero e aprovado.
    if (amount < 0) {
      return { decision: 'reject', reason: 'invalid_amount' };
    }

    if (amount > this.maxValue) {
      return { decision: 'review', reason: 'high_value' };
    }

    const now = this.clock.now();
    this.recent = this.recent.filter(t => now - t.at < this.velocityWindowMs);
    const sameCustomer = this.recent.filter(t => t.customerId === customerId);
    if (sameCustomer.length >= 5) {
      return { decision: 'review', reason: 'velocity' };
    }

    this.recent.push({ customerId, at: now });
    return { decision: 'approve' };
  }
}

module.exports = { FraudDetector };
