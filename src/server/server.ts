import type { FastifyInstance } from "fastify";
import { fastify } from "fastify";
import odds from "./routes/odds";
import fastifySensible from "@fastify/sensible";
import authentication from "./plugins/authentication";
import authorisation from "./plugins/authorization";
import auth from "./routes/auth";

export const buildServer = async () => {
  const server: FastifyInstance = fastify();

  // Plugins
  server.register(fastifySensible);
  await server.register(authentication);
  await server.register(authorisation);

  // Routes
  await server.register(auth);
  await server.register(odds);

  return server;
};
