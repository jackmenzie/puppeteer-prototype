import type { FastifyInstance } from "fastify";
import fastify from "fastify";
import odds from "./routes/odds";

export const buildServer = async () => {
  const server: FastifyInstance = fastify();

  await server.register(odds);

  return server;
};
