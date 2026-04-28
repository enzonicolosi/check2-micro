# Case 07 - Saga de Pedidos

Aulas de referência: Aulas 04 e 05 (Dados em Microsserviços).

## Cenário de negócio

O fluxo de pedidos da PagaFácil envolve três microsserviços: Inventory (reserva do item), Payment (cobrança do cartão) e Shipping (agendamento da entrega). O time implementou uma Saga para manter consistência eventual entre os três serviços.

Auditoria financeira abriu um chamado: em 12 casos nos últimos 30 dias, a cobrança foi efetuada no cartão do cliente, mas o pedido não foi enviado e o valor não foi estornado.

## Estrutura

```
src/
  inventory-service.js   Reserva e libera estoque
  payment-service.js     Cobra e estorna cartao
  shipping-service.js    Agenda entrega (pode falhar)
  order-saga.js          Orquestrador da saga
tests/
  saga.test.js           Suite existente
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Leia o método `compensate` em `order-saga.js`. Para cada passo que já foi executado, verifique qual operação de compensação é de fato chamada e compare com o contrato do serviço correspondente.
