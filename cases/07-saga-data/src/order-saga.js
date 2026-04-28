'use strict';

class OrderSaga {
  constructor({ inventory, payment, shipping }) {
    this.inventory = inventory;
    this.payment = payment;
    this.shipping = shipping;
    this.executed = [];
  }

  async run(order) {
    this.executed = [];
    try {
      const reservation = await this.inventory.reserve(order.id, order.sku, order.qty);
      this.executed.push({ step: 'inventory', result: reservation });

      const charge = await this.payment.charge(order.id, order.amount, order.card);
      this.executed.push({ step: 'payment', result: charge });

      const shipment = await this.shipping.schedule(order.id, order.address);
      this.executed.push({ step: 'shipping', result: shipment });

      return { ok: true, orderId: order.id, steps: this.executed };
    } catch (err) {
      await this.compensate(order);
      return { ok: false, error: err.message, steps: this.executed };
    }
  }

  async compensate(order) {
    for (const step of [...this.executed].reverse()) {
      if (step.step === 'inventory') {
        await this.inventory.release(order.id);
      }
      if (step.step === 'payment') {
        // Compensacao de pagamento: cancela administrativamente.
        await this.payment.cancel(order.id);
      }
      if (step.step === 'shipping') {
        // Shipping nao tem compensacao: entrega nao foi criada.
      }
    }
  }
}

module.exports = { OrderSaga };
