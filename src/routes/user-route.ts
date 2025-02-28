import { z } from "zod";

import { verifyJwt } from "../middlewares/jwt";
import { FastifyInstanceWithZod } from "../types";

export async function userRoute(app: FastifyInstanceWithZod) {
  app.post(
    "/sign-in",
    {
      schema: {
        tags: ["User"],
        summary: "Sign in",
        description: "Sign in with email and password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
    }
  );

  app.post(
    "/sign-up",
    {
      schema: {
        tags: ["User"],
        summary: "Sign up",
        description: "Sign up with email and password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
    }
  );

  app.delete(
    "/sign-out",
    { onRequest: verifyJwt },
    async (request, reply) => {}
  );
}
