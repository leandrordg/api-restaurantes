import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { db } from "../database/client";
import { users } from "../database/schema";
import { env } from "../env";
import { FastifyInstanceWithZod } from "../types";

export async function userRoute(app: FastifyInstanceWithZod) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Fazer login",
        description: "Fazer login com email e senha",
        body: z.object({
          email: z.string().email(),
          senha: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, senha } = request.body;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        return reply.status(401).send({ message: "Usuário não encontrado." });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: "Senha incorreta." });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return reply.send({ token });
    }
  );

  app.post(
    "/registrar",
    {
      schema: {
        tags: ["Usuários"],
        summary: "Cadastro de usuário",
        description: "Cadastro de usuário com email e senha",
        body: z.object({
          nome: z.string(),
          email: z.string().email(),
          senha: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { nome, email, senha } = request.body;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        return reply.status(400).send({ message: "Email já cadastrado." });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      await db.insert(users).values({
        nome,
        email,
        senha: hashedPassword,
      });

      return reply.status(201).send({ message: "Usuário criado com sucesso." });
    }
  );
}
