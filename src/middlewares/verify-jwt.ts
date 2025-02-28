import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { env } from "../env";
import { JWTSession } from "../types";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return reply.status(401).send({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTSession;

    request.user = {
      usuario_id: decoded.usuario_id,
      nome: decoded.nome,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    return reply.status(401).send({ message: "Token inválido ou expirado." });
  }
}
