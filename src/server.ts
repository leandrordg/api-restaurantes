import "dotenv/config";

import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./env";
import { tableRoute } from "./routes/table-route";
import { userRoute } from "./routes/user-route";
import { reservationRoute } from "./routes/reservation-route";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });
app.register(fastifyJwt, { secret: env.JWT_SECRET });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "API - Plataforma de Reservas",
      description: "Uma API para gerenciamento de mesas e reservas para restaurantes.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(userRoute, { prefix: "/usuarios" });
app.register(tableRoute, { prefix: "/mesas" });
app.register(reservationRoute, { prefix: "/reservas" });
app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
});
