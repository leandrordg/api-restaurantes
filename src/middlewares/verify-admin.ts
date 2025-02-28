import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../env";

export async function verifyAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return reply.status(401).send({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    if (decoded.role !== "administrador") {
      return reply
        .status(403)
        .send({ message: "Acesso restrito a administradores." });
    }
  } catch (err) {
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}
