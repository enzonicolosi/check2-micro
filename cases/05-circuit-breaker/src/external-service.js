'use strict';

/**
 * Servico externo programavel. Use para simular falhas em testes.
 */
class ExternalService {
  constructor() {
    this.script = [];
    this.calls = 0;
  }

  program(steps) {
    this.script = steps.slice();
  }

  async call(payload) {
    this.calls += 1;
    const step = this.script.shift();
    if (!step) {
      return { ok: true, data: `echo:${payload}` };
    }
    if (step === 'fail') {
      throw new Error('external_service_failure');
    }
    return { ok: true, data: `echo:${payload}` };
  }
}

module.exports = { ExternalService };
