# 🍽️ API Restaurantes

## 📝 Sobre o Projeto
A **API Restaurantes** é um sistema de gerenciamento de mesas e reservas para restaurantes. Permite que usuários façam cadastro, login, visualizem mesas disponíveis e realizem reservas. Administradores possuem permissões adicionais para gerenciar mesas e reservas, garantindo um controle eficiente do restaurante.

## 🚀 Tecnologias Utilizadas
- **🦕 Linguagem:** TypeScript
- **⚡ Framework:** Fastify
- **🗄️ ORM:** Drizzle ORM
- **✅ Validação:** Zod
- **🔐 Autenticação:** JSON Web Token (JWT)
- **🛡️ Middlewares de Segurança:** verifyJWT e verifyAdmin
- **🐘 Banco de Dados:** PostgreSQL
- **📦 Containerização:** Docker

---

## 🏗️ Estrutura do Banco de Dados

```sql
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"mesa_id" uuid NOT NULL,
	"data_reserva" timestamp NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"capacidade" integer NOT NULL,
	"status" text DEFAULT 'disponivel' NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"role" text DEFAULT 'cliente' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "reservations" ADD CONSTRAINT "reservations_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "users"("id");
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_mesa_id_tables_id_fk" FOREIGN KEY ("mesa_id") REFERENCES "tables"("id");
```

---

## 🔗 Endpoints Principais

### 🧑‍💼 Usuários
- **`POST /usuarios/registrar`** - Registrar um novo usuário
- **`POST /usuarios/login`** - Fazer login

### 🍽️ Mesas *(Requer verifyJWT para acesso e [verifyJWT, verifyAdmin] para modificações)*
- **`GET /mesas`** - Listar todas as mesas *(verifyJWT)*
- **`POST /mesas`** - Criar uma nova mesa *([verifyJWT, verifyAdmin])*
- **`PATCH /mesas/:id`** - Atualizar uma mesa *([verifyJWT, verifyAdmin])*
- **`DELETE /mesas/:id`** - Excluir uma mesa *([verifyJWT, verifyAdmin])*

### 📆 Reservas *(Requer verifyJWT para acesso)*
- **`GET /reservas`** - Listar todas as reservas *(verifyJWT)*
- **`POST /reservas`** - Criar uma nova reserva *(verifyJWT)*
- **`PATCH /reservas/:id/cancelar`** - Cancelar uma reserva *(verifyJWT)*

---

## ⚙️ Como Rodar o Projeto

1️⃣ Clone o repositório:
```sh
git clone https://github.com/leandrordg/api-restaurantes.git
cd api-restaurantes
```

2️⃣ Instale as dependências com pnpm:
```sh
pnpm install
```

3️⃣ Configure o Docker e inicie o banco de dados:
```sh
docker-compose up -d
```

4️⃣ Inicie o servidor:
```sh
pnpm dev
```

---

## 🎯 Funcionalidades

👥 **Clientes podem:**
✅ Criar conta e fazer login
✅ Visualizar mesas disponíveis
✅ Consultar suas reservas
✅ Realizar novas reservas
✅ Cancelar reservas

🛠️ **Administradores podem:**
✅ Fazer tudo que um cliente pode
✅ Criar, editar e excluir mesas
✅ Gerenciar reservas

---

## 💡 Decisões Técnicas
As tecnologias foram escolhidas por sua eficiência e velocidade:
- **Fastify**: Framework rápido e leve para APIs.
- **Drizzle ORM**: ORM moderno e flexível.
- **PostgreSQL**: Banco de dados robusto e confiável.
- **Docker**: Facilita a gestão de dependências.
- **Zod**: Validação segura de dados.
- **JWT**: Autenticação baseada em tokens para maior segurança.
- **Middlewares verifyJWT e verifyAdmin**: Utilizados como `[verifyJWT, verifyAdmin]` para proteger rotas administrativas.

---

🚀 **Feito com 💙 para restaurantes e desenvolvedores!**

