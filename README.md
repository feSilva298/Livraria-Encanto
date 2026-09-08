# Livraria Encanto

E-commerce de livros full-stack: catálogo, autenticação de usuários e editoras, carrinho e pedidos.

## Sumário

- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configuração](#configuração)
- [Instalação e execução](#instalação-e-execução)
- [Endpoints da API](#endpoints-da-api)

---

## Stack

| Camada | Tecnologias |
|---|---|
| **Frontend** | React, TypeScript, Vite, TailwindCSS, React Router, Axios |
| **Backend** | Fastify, TypeScript, Zod (validação), JWT + bcryptjs (autenticação) |
| **Banco de dados** | MySQL (via `mysql2`) — com fallback para um mock em memória |
| **Upload de arquivos** | `@fastify/multipart` + `@fastify/static` |
| **Integração externa** | API pública da Open Library |

---

## Arquitetura

O client (porta `5173`) fala apenas com o server (porta `3333`) via REST, nunca com o banco diretamente.

O ponto mais importante para rodar o projeto é o interruptor em `server/src/config.ts`:

```ts
export const USE_DATABASE = false; // true = MySQL | false = mock em memória
```

- **`false` (padrão):** usa `server/src/database/mockStore.ts`, um banco fictício em memória, já populado com dados de exemplo. Não exige MySQL nem `.env`, mas os dados somem a cada restart do server. Ideal para testar ou apresentar o projeto.
- **`true`:** usa MySQL de verdade, via `server/src/database/connection.ts`. Exige o `.env` do server configurado e as tabelas já criadas.

Autenticação é feita com **JWT**: no login, o server devolve um token (válido por 3 dias) que o client guarda no `localStorage` e reenvia em `Authorization: Bearer <token>`. Um middleware (`authUserMiddleware` / `authPublisherMiddleware`) valida esse token e libera o acesso às rotas protegidas.

---

## Estrutura do projeto

```
Livraria-Encanto/
├── server/
│   └── src/
│       ├── config.ts          # Interruptor USE_DATABASE
│       ├── controllers/       # Recebe a request, valida, chama o service
│       ├── services/          # Regras de negócio
│       ├── database/          # Conexão MySQL + mock em memória
│       ├── middlewares/       # Autenticação (usuário / editora)
│       ├── uploads/           # Capas enviadas (runtime)
│       ├── routes.ts
│       └── server.ts
└── client/
    └── src/
        ├── pages/              # Uma tela por arquivo
        ├── components/
        ├── hooks/              # Autenticação de usuário / editora
        └── service/api.ts      # Instância do axios
```

---

## Configuração

### `server/.env`

Necessário apenas quando `USE_DATABASE = true`.

| Variável | Descrição |
|---|---|
| `PORT` | Porta do server (padrão `3333`) |
| `DBHOST`, `DBUSER`, `DBPASS`, `DBPORT`, `DBNAME` | Conexão com o MySQL |
| `JWTPASS` | Segredo de assinatura dos tokens JWT |
| `TABLE1` … `TABLE7` | Nomes das tabelas: livros, usuários, carrinhos, itens de carrinho, editoras, pedidos, itens de pedido |

### `client/.env`

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL base da API (ex.: `http://localhost:3333`) |

---

## Instalação e execução

Requisitos: Node.js e npm.

```bash
# 1. Server
cd server
npm install
npm run dev          # http://localhost:3333

# 2. Client (em outro terminal)
cd client
npm install
npm run dev           # http://localhost:5173
```

O client depende do server no ar para qualquer chamada funcionar — suba o server primeiro.

**Build de produção:**

```bash
# server
npm run build && npm run start

# client
npm run build && npm run preview
```

---

## Endpoints da API

Base: `http://localhost:3333`. Rotas marcadas em **Auth** exigem `Authorization: Bearer <token>`.

### Livros

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/list-book` | — | Lista todos os livros |
| `GET` | `/book/:id` | — | Detalhes de um livro |
| `GET` | `/search-books?search=` | — | Busca por título, autor ou categoria |
| `GET` | `/external-books?search=` | — | Busca na Open Library, para auxiliar o cadastro |
| `POST` | `/insert-book` | — | Cadastra um livro (corpo validado com Zod) |
| `POST` | `/upload-book-image/:id_livro` | — | Envia a capa do livro (`multipart/form-data`) |
| `DELETE` | `/delete-book?id=` | — | Remove um livro |

### Usuários e editoras

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/create-user` | — | Cadastra usuário |
| `POST` | `/login-user` | — | Login de usuário → `{ user, token }` |
| `GET` | `/user-profile` | Usuário | Dados do usuário logado |
| `POST` | `/create-publisher` | — | Cadastra editora |
| `POST` | `/login-publisher` | — | Login de editora → `{ publisher, token }` |
| `GET` | `/publisher-profile` | Editora | Dados da editora logada |

### Carrinho e pedidos

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/carrinho/adicionar` | Usuário | Adiciona item ao carrinho (soma se já existir) |
| `GET` | `/carrinho/listar` | Usuário | Lista os itens do carrinho |
| `DELETE` | `/carrinho/remover` | Usuário | Remove um item do carrinho |
| `POST` | `/pedido/finalizar` | Usuário | Fecha pedido com os itens do carrinho e o esvazia |
| `GET` | `/pedido/visualizar` | Usuário | Histórico de pedidos do usuário |

### Outras

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/setup` | Checagem simples de que a API está no ar |
| `GET` | `/uploads/:arquivo` | Serve as capas enviadas como estático |
