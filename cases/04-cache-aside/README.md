# Case 04 - Cache Aside

Aula de referência: Aula 06 (Cache com Redis).

## Cenário de negócio

A PagaFácil lança uma campanha relâmpago de cashback toda terça-feira às 20h. Nesse horário, 50 mil clientes acessam a página do produto simultaneamente. O time de infra implementou um cache aside na frente do banco de dados do catálogo para reduzir carga.

Duas ocorrências foram abertas nos últimos 30 dias:

1. Às 20h em ponto, o banco de dados recebeu 12 mil leituras em 200 ms. O cache parecia "furado" mesmo com o item recém-cadastrado.
2. Um produto que foi atualizado no banco continuou retornando o preço antigo até meia noite, muito além do TTL configurado.

Seu trabalho é entender o código do cache e identificar onde estão os dois bugs.

## Estrutura

```
src/
  fake-redis.js        Simula um cliente Redis com Map in memory
  product-repository.js  Fonte de verdade (latencia simulada)
  product-cache.js     Implementacao cache aside
tests/
  cache.test.js        Suite com cenarios basicos
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Compare o valor passado para `setex` no `product-cache.js` com a unidade usada por `fake-redis.js` na verificação de expiração. Em seguida, observe a sequência de chamadas quando duas requisições chegam antes do primeiro miss terminar.
