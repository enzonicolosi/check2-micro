'use strict';

const { FraudDetector, IdempotencyStore } = require('../src');

// Estado compartilhado entre testes. Nao foi inicializado dentro do describe.
const sharedStore = new IdempotencyStore();
const sharedDetector = new FraudDetector({ store: sharedStore });

describe('FraudDetector - suite existente da PagaFacil', () => {
  // Teste T1: mocka o metodo avaliado para "provar" que ele retorna approve.
  // Nao exerce logica real.
  test('T1 aprova transacao simples', () => {
    const detector = new FraudDetector();
    detector.evaluate = jest.fn().mockReturnValue({ decision: 'approve' });
    const result = detector.evaluate({ idempotencyKey: 'k1', amount: 100, customerId: 'c1' });
    expect(result.decision).toBe('approve');
  });

  // Teste T2: usa estado compartilhado. Se a ordem de execucao mudar, quebra.
  test('T2 bloqueia replay da mesma chave', () => {
    const first = sharedDetector.evaluate({ idempotencyKey: 'shared-key', amount: 10, customerId: 'x' });
    const second = sharedDetector.evaluate({ idempotencyKey: 'shared-key', amount: 10, customerId: 'x' });
    expect(first.decision).toBe('approve');
    expect(second.decision).toBe('duplicate');
  });

  // Teste T3: faz assercao fraca que passa para qualquer decisao nao nula.
  test('T3 retorna alguma decisao quando transacao e valida', () => {
    const detector = new FraudDetector();
    const result = detector.evaluate({ idempotencyKey: 'k3', amount: 50, customerId: 'c3' });
    expect(result.decision).toBeDefined();
  });

  // Teste T4: usa Date.now real dentro do assert. Falha quando rodado muito rapido.
  test('T4 janela de velocity usa tempo real do sistema', () => {
    const detector = new FraudDetector({ velocityWindowMs: 10 });
    for (let i = 0; i < 5; i += 1) {
      detector.evaluate({ idempotencyKey: `kv-${i}`, amount: 1, customerId: 'same' });
    }
    const startTs = Date.now();
    while (Date.now() - startTs < 15) {
      // espera passiva para a janela expirar
    }
    const result = detector.evaluate({ idempotencyKey: 'kv-after', amount: 1, customerId: 'same' });
    expect(result.decision).toBe('approve');
  });

  // Teste T5: testa que valor zero e tratado, mas afirma approve sem justificativa.
  test('T5 valor zero e processado como transacao valida', () => {
    const detector = new FraudDetector();
    const result = detector.evaluate({ idempotencyKey: 'kz', amount: 0, customerId: 'cz' });
    expect(result.decision).toBe('approve');
  });

  // Teste T6: usa mock do Date. Boa pratica aplicada parcialmente.
  test('T6 decisao independe de mudanca do relogio quando clock e injetado', () => {
    const fakeClock = { now: () => 1_000 };
    const detector = new FraudDetector({ clock: fakeClock });
    const result = detector.evaluate({ idempotencyKey: 'kc', amount: 100, customerId: 'cc' });
    expect(result.decision).toBe('approve');
  });
});
