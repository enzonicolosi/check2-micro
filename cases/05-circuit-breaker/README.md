# Case 05 - Circuit Breaker

Aula de referência: Aula 03 (Padrões de Resiliência).

## Cenário de negócio

A PagaFácil chama um serviço externo de consulta de CPF para enriquecer transações de alto valor. Quando o serviço externo fica instável, o time implementou um Circuit Breaker para evitar que toda a PagaFácil fique degradada.

Depois do último incidente, os engenheiros notaram que:

1. Logo após o circuito "se recuperar" e voltar a permitir chamadas, a primeira falha intermitente abre o circuito de novo imediatamente.
2. O serviço externo fica mais tempo bloqueado do que esperado.

## Estrutura

```
src/
  circuit-breaker.js   Implementacao com estados CLOSED, OPEN e HALF_OPEN
  external-service.js  Servico externo com falhas simuladas
tests/
  breaker.test.js      Bateria existente
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Observe o que o Circuit Breaker faz quando está em HALF_OPEN e recebe uma chamada bem sucedida. Compare com a definição canônica do padrão: na transição de HALF_OPEN para CLOSED, qual informação precisa ser reinicializada?
