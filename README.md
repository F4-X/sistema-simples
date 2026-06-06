# Sistema Financeiro

Sistema feito para o banco PostgreSQL com as tabelas `usuarios` e `lancamentos`.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure o `.env` com a conexão correta do PostgreSQL.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Banco esperado

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lancamentos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('gasto', 'lucro')),
  ano INTEGER NOT NULL CHECK (ano BETWEEN 1 AND 10),
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  dia INTEGER NOT NULL CHECK (dia BETWEEN 1 AND 31),
  descricao VARCHAR(255) NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
