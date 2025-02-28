import { integer } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  email: text("email").unique().notNull(),
  senha: text("senha").notNull(),
  role: text("role").notNull().default("cliente"),
  created_at: timestamp("created_at").defaultNow(),
});

export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  capacidade: integer("capacidade").notNull(),
  status: text("status").notNull().default("disponivel"),
  created_at: timestamp("created_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: uuid("usuario_id").notNull().references(() => users.id),
  mesa_id: uuid("mesa_id").notNull().references(() => tables.id),
  data_reserva: timestamp("data_reserva").notNull(),
  status: text("status").notNull().default("ativo"),
  created_at: timestamp("created_at").defaultNow(),
});
