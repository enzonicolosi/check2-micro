# Case 01 - Credit Card SOLID

Aulas de referência: Aula 08 (Testes de Unidade e Integração) e princípios SOLID.

## Cenário de negócio

A PagaFácil opera três produtos de cartão de crédito: Standard, Premium e Prepaid. O time de pagamentos criou uma classe base `CreditCard` e três subclasses concretas para representar cada produto. O código passou em produção na semana passada, porém o time de atendimento registrou três ocorrências:

1. Clientes de cartão Prepaid estão recebendo erro 500 ao solicitar reembolso de uma compra não aprovada.
2. O arquivo de log da aplicação cresceu 40% em uma semana sem que o volume transacional tenha mudado.
3. A equipe de fraude não consegue desabilitar notificações para testes A/B sem alterar o código da transação.

Seu trabalho nesta prova é analisar o código e os testes desta pasta para responder perguntas objetivas sobre violações SOLID e qualidade de testes.

## Estrutura

```
src/
  credit-card.js        Classe abstrata com violacoes intencionais
  cards.js              Tres subclasses concretas (Standard, Premium, Prepaid)
  notifier.js           Modulo de notificacao (acoplamento indesejado)
  logger.js             Modulo de log
  transaction.js        Orquestrador de transacao
tests/
  credit-card.test.js   Bateria existente (alguns passam, outros falham)
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia para sua leitura

Ao ler o código, identifique: qual princípio SOLID cada classe viola, onde os testes existentes deixam lacuna, e por que a subclasse Prepaid quebra o contrato da classe base.
