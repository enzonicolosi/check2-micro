'use strict';

/**
 * Orquestrador de transacao.
 * Recebe uma lista de cartoes e processa uma compra em cada um.
 *
 * Uso tipico: uma compra parcelada em multiplos cartoes do mesmo cliente.
 */
class TransactionProcessor {
  constructor(cards) {
    this.cards = cards;
  }

  /**
   * Estorna uma compra em todos os cartoes da lista.
   * Se algum cartao falhar no estorno, o processamento para.
   */
  refundAll(amountPerCard) {
    const results = [];
    for (const card of this.cards) {
      const result = card.refund(amountPerCard);
      results.push({ holder: card.holder, result });
      if (!result.refunded) {
        break;
      }
    }
    return results;
  }
}

module.exports = { TransactionProcessor };
