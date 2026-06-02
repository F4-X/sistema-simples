# Sistema Simples - Frontend e Backend

Sistema simples com login, receitas/clientes, despesas e resumo mensal.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

A API roda em: http://localhost:3001

## Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em: http://localhost:5173

## Banco de dados

O banco será feito separado. O backend espera as tabelas:
- usuarios
- receitas
- despesas

Campos esperados:

usuarios: id, nome, email, senha_hash, criado_em
receitas: id, cliente, servico, valor, data, observacao, user_id, criado_em
despesas: id, descricao, categoria, valor, data, observacao, user_id, criado_em
