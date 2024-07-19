import fastifyPlugin from "fastify-plugin";
import auth, { FastifyAuthPluginOptions } from "@fastify/auth";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export default fastifyPlugin<FastifyAuthPluginOptions>(
  async (server: FastifyInstance) => {
    server.register(auth);

    server.decorate(
      "authorize",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const allowedRoles = request.routeOptions.config.allowedRoles;

        if (allowedRoles && request.user) {
          const userRoles = request.user ? request.user.roles : [];

          if (!allowedRoles.some((role: string) => userRoles.includes(role))) {
            throw server.httpErrors.unauthorized();
          }
        } else if (!request.user) {
          throw server.httpErrors.unauthorized();
        }
      }
    );
  }
);
