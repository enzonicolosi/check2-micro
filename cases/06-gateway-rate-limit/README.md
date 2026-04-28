# Case 06 - Gateway, Load Balancer e Rate Limiter

Aulas de referência: Aula 01 (API Gateway e Proxy Reverso) e Aula 02 (Load Balancer, Rate Limiting e Throttling).

## Cenário de negócio

O gateway da PagaFácil concentra a entrada de tráfego de parceiros externos, aplica rate limiting por cliente e distribui requisições entre três instâncias de microsserviço de emissão de boletos. O time recebeu duas reclamações:

1. Um parceiro diz que mesmo respeitando o limite configurado de 10 requisições por segundo, recebeu HTTP 429 depois de 10 requisições em rajada.
2. A terceira instância do microsserviço (`boleto-3`) está recebendo menos tráfego do que as outras duas.

## Estrutura

```
src/
  token-bucket.js          Implementacao de rate limit
  round-robin-balancer.js  Distribuidor de requisicoes
  gateway.js               Funcao que orquestra rate limit e balanceamento
tests/
  gateway.test.js          Suite existente
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Para o Token Bucket, entenda a diferença entre "capacity" e "refill rate". Para o balanceador, observe como o índice do próximo servidor é atualizado quando um servidor é removido da lista durante execução.
