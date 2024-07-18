import { FastifyInstance } from "fastify";

export default async function odds(server: FastifyInstance) {
  server.route({
    method: "POST",
    url: "/odds",
    handler: async () => {},
  });
}
