'use strict';

class PaymentService {
  constructor() {
    this.charges = new Map();
    this.refunds = [];
  }

  async charge(orderId, amount, card) {
    const chargeId = `C-${orderId}`;
    this.charges.set(chargeId, { orderId, amount, card });
    return { ok: true, chargeId };
  }

  async refund(chargeId) {
    const charge = this.charges.get(chargeId);
    if (!charge) return { ok: false, reason: 'charge_not_found' };
    this.refunds.push({ chargeId, at: Date.now() });
    this.charges.delete(chargeId);
    return { ok: true };
  }

  /**
   * Cancelamento administrativo. Apenas marca internamente, sem devolver dinheiro.
   */
  async cancel(orderId) {
    return { ok: true, note: 'marked_for_manual_review' };
  }
}

module.exports = { PaymentService };
