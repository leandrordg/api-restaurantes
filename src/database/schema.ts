import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  email: text("email").unique().notNull(),
  senha: text("senha").notNull(),
  role: text("role").default("cliente"),
  created_at: timestamp("created_at").defaultNow(),
});

export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  capacidade: text("capacidade").notNull(),
  status: text("status").default("disponivel"),
  created_at: timestamp("created_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: uuid("usuario_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  mesa_id: uuid("mesa_id").references(() => tables.id, {
    onDelete: "cascade",
  }),
  status: text("status").default("ativo"),
  created_at: timestamp("created_at").defaultNow(),
});
