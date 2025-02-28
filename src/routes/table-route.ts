import { and, asc, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { db } from "../database/client";
import { tables } from "../database/schema";
import { verifyAdmin } from "../middlewares/verify-admin";
import { verifyJwt } from "../middlewares/verify-jwt";
import { FastifyInstanceWithZod } from "../types";

export async function tableRoute(app: FastifyInstanceWithZod) {
  app.get(
    "/",
    {
      schema: {
        tags: ["Mesas"],
        summary: "Listar todas as mesas",
        description: "Listar todas as mesas disponíveis",
      },
    },
    async (request, reply) => {
      const availableTables = await db
        .select()
        .from(tables)
        .orderBy(asc(tables.nome));

      return reply.status(200).send({
        statusCode: 200,
        message: "Mesas disponíveis",
        data: availableTables,
      });
    }
  );

  app.post(
    "/",
    {
      onRequest: [verifyJwt, verifyAdmin],
      schema: {
        tags: ["Mesas"],
        summary: "Criar mesa",
        description: "Criar uma nova mesa",
        body: z.object({
          nome: z.string(),
          capacidade: z.coerce.number(),
          status: z.enum(["disponivel", "reservada", "inativa"]),
        }),
      },
    },
    async (request, reply) => {
      const { nome, capacidade, status } = request.body;

      const [tableExists] = await db
        .select()
        .from(tables)
        .where(eq(tables.nome, nome));

      if (tableExists) {
        return reply.status(400).send({
          statusCode: 400,
          message: `Mesa (${nome}) já existe.`,
        });
      }

      const [newTable] = await db
        .insert(tables)
        .values({
          nome,
          capacidade,
          status,
        })
        .returning();

      return reply.status(201).send({
        statusCode: 201,
        message: "Mesa criada com sucesso.",
        data: newTable,
      });
    }
  );

  app.patch(
    "/:id",
    {
      onRequest: [verifyJwt, verifyAdmin],
      schema: {
        tags: ["Mesas"],
        summary: "Atualizar mesa",
        description: "Atualizar uma mesa existente",
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          nome: z.string(),
          capacidade: z.coerce.number(),
          status: z.enum(["disponivel", "reservada", "inativa"]),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { nome, capacidade, status } = request.body;

      const [table] = await db.select().from(tables).where(eq(tables.id, id));

      if (!table) {
        return reply.status(404).send({
          statusCode: 404,
          message: "Mesa não encontrada.",
        });
      }

      const [tableExists] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.nome, nome), ne(tables.id, id)));

      if (tableExists) {
        return reply.status(400).send({
          statusCode: 400,
          message: `Mesa (${nome}) já existe.`,
        });
      }

      const [updatedTable] = await db
        .update(tables)
        .set({ nome, capacidade, status })
        .where(eq(tables.id, id))
        .returning();

      return reply.status(200).send({
        statusCode: 200,
        message: "Mesa atualizada com sucesso.",
        data: updatedTable,
      });
    }
  );

  app.delete(
    "/:id",
    {
      onRequest: [verifyJwt, verifyAdmin],
      schema: {
        tags: ["Mesas"],
        summary: "Deletar mesa",
        description: "Deletar uma mesa existente pelo ID",
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const [table] = await db.select().from(tables).where(eq(tables.id, id));

      if (!table) {
        return reply.status(404).send({
          statusCode: 404,
          message: "Mesa não encontrada.",
        });
      }

      const [deletedTable] = await db
        .delete(tables)
        .where(eq(tables.id, id))
        .returning();

      return reply.status(200).send({
        statusCode: 200,
        message: "Mesa deletada com sucesso.",
        data: deletedTable,
      });
    }
  );
}
