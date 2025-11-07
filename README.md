# 🚚 API Example

Api de controle para CRM

## 💡 Autores

Projeto criado por João Pedro Fonseca Rodrigues

## 🛠️ Tecnologias

-   [TypesScript](https://www.typescriptlang.org/) `v5.2.2`
-   [Express](https://expressjs.com/pt-br/) `v4.18.2`
-   [Axios](https://axios-http.com/ptbr/docs/intro) `v1.6.2`
-   [Winston](https://www.npmjs.com/package/winston) `v3.11.0`
-   [Jest](https://www.npmjs.com/package/jest) `v29.7.0`

## 📋 Pré-requisitos

Acesso ao gitLab do projeto.

## 🎲 Rodando o Back-end

-   Clone o repositório e acesse a pasta
-   Configure o seu `.env` a partir do `.env.example`
-   Instale as dependencias com o comando `npm install` ou `yarn`
-   Rode o comando `npm run dev` ou `yarn dev` para iniciar o servidor na porta `:3000`

## 🐳 Rodando o Back-end em um container Docker

-   Clone o repositório e acesse a pasta
-   Rode o comando `docker-compose build`
-   Após finalizado o build rode o comando `docker-compose up`
-   Ou se preferir pode utilizar ambos juntos `docker-compose build && docker-compose up`

## 🔬 Rodando os testes unitários

-   Clone o repositório e acesse a pasta
-   Configure o seu `.env` a partir do `.env.example`
-   É obrigatório que a variável `NODE_ENV` do arquivo `.env` esteja com o valor `development`
-   Instale as dependencias com o comando `npm install` ou `yarn`
-   Rode o comando `npm run test` ou `yarn test` para iniciar os testes automatizados
