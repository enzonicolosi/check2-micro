# Minimundo PagaFácil - Checkpoint II

Disciplina: Microservice and Web Engineering
Turma: 3SIZ - FIAP - 2026.1
Professor: José Romualdo da Costa Filho

Você foi contratado como analista desenvolvedor da PagaFácil, uma fintech que processa pagamentos em uma arquitetura de microsserviços. Ao chegar no time, você recebe sete casos reais do backlog para investigar, e as perguntas da prova estão todas ancoradas no que você encontrar nesses casos.

## Pré-requisitos

Node.js versão 18 ou superior.

```bash
node --version
npm --version
```

## Setup inicial (faça isso antes da prova começar)

```bash
git clone <URL do repositório>
cd fiap-2026-1-cp2
npm install
```

O `npm install` baixa todas as dependências dos sete casos via npm workspaces. Leva entre um e três minutos, dependendo da conexão.

## Estrutura dos casos

Os casos ficam em `cases/`. Cada pasta tem um `README.md` próprio com o cenário de negócio, um diretório `src/` com o código do sistema e um diretório `tests/` com a bateria de testes existente.

```
cases/
  01-credit-card-solid/       Aula 08 + SOLID
  02-test-quality-suite/      Aula 08
  03-tdd-refactor/            Aula 08 + SOLID
  04-cache-aside/             Aula 06 Cache com Redis
  05-circuit-breaker/         Aula 03 Padrões de Resiliência
  06-gateway-rate-limit/      Aulas 01 e 02
  07-saga-data/               Aulas 04 e 05
```

## Como rodar os testes

Para rodar todos os testes dos sete casos de uma vez:

```bash
npm test
```

Para rodar apenas um caso específico, use o script correspondente:

```bash
npm run test:case1
npm run test:case2
npm run test:case3
npm run test:case4
npm run test:case5
npm run test:case6
npm run test:case7
```

Você também pode entrar na pasta do caso e rodar direto:

```bash
cd cases/01-credit-card-solid
npm test
```

## Como executar código de um caso (sem rodar testes)

Alguns cases têm um entrypoint executável em `src/index.js`. Use:

```bash
cd cases/06-gateway-rate-limit
node src/index.js
```

O `README.md` de cada case descreve o que o executável faz.

## Leia antes de começar

Antes de responder qualquer questão no Microsoft Forms, leia o arquivo `INSTRUCOES.md` na raiz do repositório. Ele contém as regras da prova, a duração, a política de consulta e o que fazer em caso de problema técnico.
