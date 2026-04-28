'use strict';

class ShippingService {
  constructor() {
    this.failNextCalls = 0;
    this.scheduled = [];
  }

  failNext(n = 1) {
    this.failNextCalls = n;
  }

  async schedule(orderId, address) {
    if (this.failNextCalls > 0) {
      this.failNextCalls -= 1;
      throw new Error('shipping_unavailable');
    }
    const trackingId = `T-${orderId}`;
    this.scheduled.push({ orderId, address, trackingId });
    return { ok: true, trackingId };
  }
}

module.exports = { ShippingService };
