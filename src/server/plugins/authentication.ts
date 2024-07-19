import fastifyPlugin from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export default fastifyPlugin<FastifyJWTOptions>(
  async (server: FastifyInstance) => {
    server.register(fastifyJwt, {
      secret: "supersecret",
    });

    server.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (error) {
          throw server.httpErrors.unauthorized();
        }
      }
    );
  }
);
