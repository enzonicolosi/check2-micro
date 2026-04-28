'use strict';

class ProductRepository {
  constructor() {
    this.callCount = 0;
    this.data = new Map();
  }

  save(product) {
    this.data.set(product.id, { ...product });
  }

  async findById(id) {
    this.callCount += 1;
    // Simula latencia do banco.
    await new Promise(resolve => setTimeout(resolve, 20));
    const product = this.data.get(id);
    if (!product) return null;
    return { ...product };
  }
}

module.exports = { ProductRepository };
