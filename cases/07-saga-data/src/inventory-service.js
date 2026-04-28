'use strict';

class InventoryService {
  constructor() {
    this.reservations = new Map();
  }

  async reserve(orderId, sku, qty) {
    this.reservations.set(orderId, { sku, qty });
    return { ok: true, reservationId: `R-${orderId}` };
  }

  async release(orderId) {
    this.reservations.delete(orderId);
    return { ok: true };
  }
}

module.exports = { InventoryService };
