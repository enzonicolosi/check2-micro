'use strict';

const {
  StandardCreditCard,
  PremiumCreditCard,
  PrepaidCreditCard,
  TransactionProcessor
} = require('../src');

describe('StandardCreditCard', () => {
  test('aprova compra dentro do limite', () => {
    const card = new StandardCreditCard({ number: '1111', holder: 'Ana', limit: 1000 });
    const result = card.authorize(500);
    expect(result.approved).toBe(true);
    expect(card.balance).toBe(500);
  });

  test('nega compra acima do limite', () => {
    const card = new StandardCreditCard({ number: '1111', holder: 'Ana', limit: 1000 });
    const result = card.authorize(1500);
    expect(result.approved).toBe(false);
    expect(result.reason).toBe('limit_exceeded');
  });

  test('refund dentro do saldo reduz balance', () => {
    const card = new StandardCreditCard({ number: '1111', holder: 'Ana', limit: 1000 });
    card.authorize(800);
    const result = card.refund(300);
    expect(result.refunded).toBe(true);
    expect(card.balance).toBe(500);
  });

  test('calcula taxa em 2.5% para Standard', () => {
    const card = new StandardCreditCard({ number: '1111', holder: 'Ana', limit: 1000 });
    expect(card.calculateFees(100)).toBe(2.5);
  });
});

describe('PremiumCreditCard', () => {
  test('calcula cashback de 1% sobre o valor', () => {
    const card = new PremiumCreditCard({ number: '2222', holder: 'Bruno', limit: 5000 });
    expect(card.cashback(1000)).toBe(10);
  });

  test('calcula taxa em 1.5% para Premium', () => {
    const card = new PremiumCreditCard({ number: '2222', holder: 'Bruno', limit: 5000 });
    expect(card.calculateFees(100)).toBe(1.5);
  });
});

describe('PrepaidCreditCard', () => {
  test('aprova autorizacao como qualquer cartao', () => {
    const card = new PrepaidCreditCard({ number: '3333', holder: 'Carla', limit: 200 });
    const result = card.authorize(150);
    expect(result.approved).toBe(true);
  });

  test('nao cobra taxa em cartao Prepaid', () => {
    const card = new PrepaidCreditCard({ number: '3333', holder: 'Carla', limit: 200 });
    expect(card.calculateFees(100)).toBe(0);
  });

  // ATENCAO: este teste existe mas nao estava sendo executado antes.
  // O time deixou comentado. Descomente para ver o comportamento real.
  // test('refund em Prepaid deveria retornar erro controlado, nao lancar excecao', () => {
  //   const card = new PrepaidCreditCard({ number: '3333', holder: 'Carla', limit: 200 });
  //   card.authorize(100);
  //   expect(() => card.refund(50)).not.toThrow();
  // });
});

describe('TransactionProcessor', () => {
  test('estorna em lote para lista de cartoes Standard', () => {
    const cards = [
      new StandardCreditCard({ number: 'A', holder: 'Ana', limit: 1000 }),
      new StandardCreditCard({ number: 'B', holder: 'Bia', limit: 1000 })
    ];
    cards.forEach(c => c.authorize(500));
    const processor = new TransactionProcessor(cards);
    const results = processor.refundAll(200);
    expect(results).toHaveLength(2);
    expect(results[0].result.refunded).toBe(true);
    expect(results[1].result.refunded).toBe(true);
  });

  test('para de processar quando um cartao falha no estorno', () => {
    const cards = [
      new StandardCreditCard({ number: 'A', holder: 'Ana', limit: 1000 }),
      new StandardCreditCard({ number: 'B', holder: 'Bia', limit: 1000 })
    ];
    cards[0].authorize(1000);
    cards[1].authorize(50);
    const processor = new TransactionProcessor(cards);
    const results = processor.refundAll(100);
    expect(results).toHaveLength(2);
    expect(results[0].result.refunded).toBe(true);
    expect(results[1].result.refunded).toBe(false);
  });
});
