import fastify from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import { FastifyJwtNamespace } from "@fastify/jwt";

declare module "fastify" {
  type Authenticate = (
    request: FastifyRequest,
    reply: FastifyReply
  ) => Promise<void>;
  type Authorize = (
    request: FastifyRequest,
    reply: FastifyReply
  ) => Promise<void>;

  interface FastifyInstance {
    authenticate: Authenticate;
    authorize: Authorize;
  }

  interface FastifyInstance
    extends FastifyJwtNamespace<{
      jwtDecode: "securityJwtDecode";
      jwtSign: "securityJwtSign";
      jwtVerify: "securityJwtVerify";
    }> {}

  interface FastifyContextConfig {
    allowedRoles?: string[];
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      roles: string[];
    };
  }
}
