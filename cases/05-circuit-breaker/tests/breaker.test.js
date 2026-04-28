'use strict';

const { CircuitBreaker, STATES, ExternalService } = require('../src');

function build(programSteps, options = {}) {
  const service = new ExternalService();
  service.program(programSteps);
  const breaker = new CircuitBreaker(payload => service.call(payload), options);
  return { service, breaker };
}

describe('CircuitBreaker', () => {
  test('abre o circuito apos atingir o failureThreshold', async () => {
    const { breaker } = build(['fail', 'fail', 'fail'], { failureThreshold: 3 });
    await expect(breaker.exec('x')).rejects.toThrow('external_service_failure');
    await expect(breaker.exec('x')).rejects.toThrow('external_service_failure');
    await expect(breaker.exec('x')).rejects.toThrow('external_service_failure');
    expect(breaker.getState()).toBe(STATES.OPEN);
  });

  test('chamada em OPEN falha imediatamente sem tocar no servico', async () => {
    const { service, breaker } = build(['fail', 'fail', 'fail'], { failureThreshold: 3 });
    for (let i = 0; i < 3; i += 1) {
      try { await breaker.exec('x'); } catch (_) {}
    }
    const callsBefore = service.calls;
    await expect(breaker.exec('x')).rejects.toThrow('circuit_open');
    expect(service.calls).toBe(callsBefore);
  });

  test('apos resetTimeout entra em HALF_OPEN e tenta chamada real', async () => {
    const { service, breaker } = build(['fail', 'fail', 'fail', 'ok'], {
      failureThreshold: 3,
      resetTimeoutMs: 20
    });
    for (let i = 0; i < 3; i += 1) {
      try { await breaker.exec('x'); } catch (_) {}
    }
    await new Promise(r => setTimeout(r, 25));
    const result = await breaker.exec('x');
    expect(result.ok).toBe(true);
    expect(breaker.getState()).toBe(STATES.CLOSED);
  });

  test('apos recuperar, uma unica falha reabre o circuito imediatamente', async () => {
    const { breaker } = build(['fail', 'fail', 'fail', 'ok', 'fail'], {
      failureThreshold: 3,
      resetTimeoutMs: 20
    });
    for (let i = 0; i < 3; i += 1) {
      try { await breaker.exec('x'); } catch (_) {}
    }
    await new Promise(r => setTimeout(r, 25));
    await breaker.exec('x');
    expect(breaker.getState()).toBe(STATES.CLOSED);
    await expect(breaker.exec('x')).rejects.toThrow('external_service_failure');
    expect(breaker.getState()).toBe(STATES.OPEN);
  });
});
