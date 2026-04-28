# Case 02 - Test Quality Suite

Aula de referência: Aula 08 (Testes de Unidade e Integração).

## Cenário de negócio

O módulo `fraud-detector` da PagaFácil avalia transações em tempo real e decide se aprova ou envia para revisão manual. O time anterior deixou uma bateria de testes com 100% de aprovação no CI e cobertura de linha em 95%. Mesmo assim, três bugs passaram para produção na última sprint:

1. Transação com valor zero foi aprovada em todos os gateways, causando prejuízo de conciliação.
2. Uma transação que deveria ser aprovada caiu em revisão porque o relógio do servidor estava adiantado em 30 segundos.
3. Uma mesma chave idempotente foi aprovada duas vezes em duas madrugadas consecutivas.

O time de qualidade suspeita que os testes existentes não capturam os cenários reais. Seu trabalho é analisar os testes em `tests/fraud-detector.test.js` e decidir quais problemas estão presentes.

## Estrutura

```
src/
  fraud-detector.js     Servico de deteccao de fraude (funcional, com um bug sutil)
  clock.js              Provedor de tempo
  idempotency-store.js  Store in memory para idempotencia
tests/
  fraud-detector.test.js  Suite com multiplos anti-padroes
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Para cada teste da suíte, questione: ele falharia se o código estivesse errado? Ele mede comportamento ou implementação? Ele depende de tempo externo, ordem de execução ou estado compartilhado?
