import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../database/client";
import { reservations, tables } from "../database/schema";
import { verifyJwt } from "../middlewares/verify-jwt";
import { FastifyInstanceWithZod, JWTSession } from "../types";

export async function reservationRoute(app: FastifyInstanceWithZod) {
  app.get(
    "/",
    {
      onRequest: verifyJwt,
      schema: {
        tags: ["Reservas"],
        summary: "Listar reservas.",
        description: "Lista todas as reservas do usuário autenticado.",
      },
    },
    async (request, reply) => {
      const user = request.user as JWTSession;

      const availableReservations = await db
        .select()
        .from(reservations)
        .where(eq(reservations.usuario_id, user.usuario_id))
        .orderBy(asc(reservations.status), desc(reservations.data_reserva));

      return reply.status(200).send({
        statusCode: 200,
        message: "Reservas listadas com sucesso.",
        data: availableReservations,
      });
    }
  );

  app.post(
    "/",
    {
      onRequest: verifyJwt,
      schema: {
        tags: ["Reservas"],
        summary: "Criar reserva.",
        description:
          "Cria uma nova reserva, validando disponibilidade e a capacidade da mesa.",
        body: z.object({
          mesa_id: z.string().uuid(),
          capacidade: z.coerce.number(),
          data_reserva: z.coerce.date(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user as JWTSession;
      const { mesa_id, capacidade, data_reserva } = request.body;

      const [availableTable] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.id, mesa_id)));

      if (!availableTable) {
        return reply.status(400).send({
          statusCode: 400,
          message: "Mesa não encontrada.",
        });
      }

      if (availableTable.capacidade < capacidade) {
        return reply.status(400).send({
          statusCode: 400,
          message: `Mesa não comporta ${capacidade} pessoas.`,
        });
      }

      const existingReservation = await db
        .select()
        .from(reservations)
        .where(
          and(
            eq(reservations.mesa_id, mesa_id),
            eq(reservations.data_reserva, data_reserva),
            eq(reservations.status, "ativo")
          )
        );

      if (!!existingReservation) {
        return reply.status(400).send({
          statusCode: 400,
          message: "Mesa já reservada para esse horário.",
        });
      }

      // Criando a nova reserva
      const [newReservation] = await db
        .insert(reservations)
        .values({
          mesa_id,
          usuario_id: user.usuario_id,
          data_reserva,
        })
        .returning();

      // Alterando o status da mesa para "reservada"
      await db
        .update(tables)
        .set({ status: "reservada" })
        .where(eq(tables.id, mesa_id));

      return reply.status(201).send({
        statusCode: 201,
        message: "Reserva criada com sucesso.",
        data: newReservation,
      });
    }
  );

  app.patch(
    "/:id/cancelar",
    {
      onRequest: verifyJwt,
      schema: {
        tags: ["Reservas"],
        summary: "Cancelar reserva.",
        description: "Cancela uma reserva ativa.",
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user as JWTSession;
      const { id } = request.params;

      const [reservation] = await db
        .select()
        .from(reservations)
        .where(
          and(
            eq(reservations.id, id),
            eq(reservations.usuario_id, user.usuario_id)
          )
        );

      if (reservation.usuario_id !== user.usuario_id) {
        return reply.status(403).send({
          statusCode: 403,
          message: "Usuário não autorizado a cancelar essa reserva.",
        });
      }

      if (reservation.status === "cancelado") {
        return reply.status(400).send({
          statusCode: 400,
          message: "Reserva já foi cancelada.",
        });
      }

      if (!reservation) {
        return reply.status(404).send({
          statusCode: 404,
          message: "Reserva não encontrada.",
        });
      }

      const [cancelledReservation] = await db
        .update(reservations)
        .set({ status: "cancelado" })
        .where(eq(reservations.id, id))
        .returning();

      await db
        .update(tables)
        .set({ status: "disponivel" })
        .where(eq(tables.id, cancelledReservation.mesa_id));

      return reply.status(200).send({
        statusCode: 200,
        message: "Reserva cancelada com sucesso.",
        data: cancelledReservation,
      });
    }
  );
}
