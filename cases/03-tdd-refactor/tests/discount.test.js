'use strict';

const { DiscountCalculator } = require('../src');

describe('DiscountCalculator (suite existente)', () => {
  test('cliente fake retorna desconto gold sobre carrinho de 1000', () => {
    const calc = new DiscountCalculator();
    // Como nao conseguimos injetar historico, este teste depende do retorno fake do repo.
    const value = calc.calculate('qualquer-id', 1000);
    expect(value).toBe(100);
  });

  test('calculo com cartTotal zero retorna zero', () => {
    const calc = new DiscountCalculator();
    const value = calc.calculate('c1', 0);
    expect(value).toBe(0);
  });
});
