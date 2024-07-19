import { FastifyInstance } from "fastify";

export default async function auth(server: FastifyInstance) {
  server.get("/jwt", async function (request, reply) {
    const token = server.jwt.sign({
      roles: ["admin"],
    });
    reply.send({ token });
  });
}
