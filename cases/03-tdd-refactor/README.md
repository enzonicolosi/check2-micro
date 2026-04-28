# Case 03 - TDD Refactor

Aula de referência: Aula 08 (Testes de Unidade e Integração) e princípios SOLID (OCP e DIP).

## Cenário de negócio

O módulo de desconto da PagaFácil decide qual porcentagem de desconto aplicar no checkout com base no tipo de cliente (silver, gold, platinum, partner). Toda vez que marketing cria uma nova categoria de cliente, o time precisa alterar a classe `DiscountCalculator` e subir uma nova versão. Na última campanha de Black Friday isso causou um incidente: a PR do novo tier "diamond" quebrou o cálculo do tier "gold".

Além disso, a classe instancia diretamente a conexão com o banco para buscar o histórico do cliente, o que torna os testes unitários mais lentos e acoplados.

## Estrutura

```
src/
  discount-calculator.js    Classe atual, com switch por tier
  customer-repository.js    Conexao simulada com banco
tests/
  discount.test.js          Suite existente (happy path apenas)
```

## Como rodar

```bash
npm install
npm test
```

## Pergunta guia

Ao ler o código, identifique: qual princípio SOLID é violado por cada ponto do código, como o design atual dificulta testes unitários rápidos, e qual refatoração resolveria os dois problemas simultaneamente.
