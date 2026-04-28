'use strict';

const STATES = Object.freeze({
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN'
});

/**
 * Circuit Breaker classico com tres estados.
 */
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeoutMs = options.resetTimeoutMs || 1000;
    this.state = STATES.CLOSED;
    this.failures = 0;
    this.openedAt = null;
  }

  async exec(...args) {
    if (this.state === STATES.OPEN) {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed >= this.resetTimeoutMs) {
        this.state = STATES.HALF_OPEN;
      } else {
        throw new Error('circuit_open');
      }
    }

    try {
      const result = await this.fn(...args);
      if (this.state === STATES.HALF_OPEN) {
        this.state = STATES.CLOSED;
        // NOTA: o contador de falhas nao e zerado nesta transicao.
      }
      return result;
    } catch (err) {
      this.failures += 1;
      if (this.failures >= this.failureThreshold) {
        this.state = STATES.OPEN;
        this.openedAt = Date.now();
      }
      throw err;
    }
  }

  getState() {
    return this.state;
  }

  getFailures() {
    return this.failures;
  }
}

module.exports = { CircuitBreaker, STATES };
