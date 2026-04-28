'use strict';

// Logger sincrono acoplado a console. Em producao grava em arquivo.
class Logger {
  constructor() {
    this.entries = [];
  }

  info(message, meta = {}) {
    const entry = { level: 'info', message, meta, at: Date.now() };
    this.entries.push(entry);
    return entry;
  }

  error(message, meta = {}) {
    const entry = { level: 'error', message, meta, at: Date.now() };
    this.entries.push(entry);
    return entry;
  }

  flush() {
    const copy = [...this.entries];
    this.entries = [];
    return copy;
  }
}

module.exports = { Logger };
