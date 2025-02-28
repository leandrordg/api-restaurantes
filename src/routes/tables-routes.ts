import { verifyAdmin } from "../middlewares/verify-admin";
import { verifyJwt } from "../middlewares/verify-jwt";
import { FastifyInstanceWithZod } from "../types";

export async function tableRoute(app: FastifyInstanceWithZod) {
  app.get(
    "/",
    {
      onRequest: verifyJwt,
      schema: {
        tags: ["Mesas"],
        summary: "Listar todas as mesas",
        description: "Listar todas as mesas disponíveis",
      },
    },
    async (request, reply) => {}
  );

  app.post(
    "/",
    {
      onRequest: [verifyJwt, verifyAdmin],
      schema: {
        tags: ["Mesas"],
        summary: "Criar mesa",
        description: "Criar uma nova mesa",
      },
    },
    async (request, reply) => {}
  );

  app.patch(
    "/:id",
    {
      onRequest: verifyJwt,
      schema: {
        tags: ["Mesas"],
        summary: "Atualizar mesa",
        description: "Atualizar uma mesa existente",
      },
    },
    async (request, reply) => {}
  );

  app.delete(
    "/:id",
    {
      onRequest: [verifyJwt, verifyAdmin],
      schema: {
        tags: ["Mesas"],
        summary: "Deletar mesa",
        description: "Deletar uma mesa existente pelo ID",
      },
    },
    async (request, reply) => {}
  );
}
