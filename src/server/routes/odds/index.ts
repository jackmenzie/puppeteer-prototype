import { FastifyInstance, FastifyRequest } from "fastify";
import { Betano } from "./Betano";
import puppeteer from "puppeteer";

interface IOddsParams {
  url: string;
}

export default async function odds(server: FastifyInstance) {
  server.route({
    url: "/odds",
    method: "POST",
    schema: {
      body: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string" },
        },
      },
    },
    onRequest: async (
      request: FastifyRequest<{ Body: IOddsParams }>,
      reply,
      done
    ) => {
      try {
        await server.authenticate(request, reply);
        done();
      } catch (error: unknown) {
        if (error instanceof Error) {
          done(error);
        } else {
          done(new Error("An unknown error occurred"));
        }
      }
    },
    config: { allowedRoles: ["admin"] },
    preHandler: server.auth([server.authorize]),
    handler: async (request: FastifyRequest<{ Body: IOddsParams }>, reply) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const betano = new Betano(browser);

      try {
        const { url } = request.body;
        const horseRaceOutcomes = await betano.getHorseRaceOutcomes(url);

        const message = JSON.stringify(horseRaceOutcomes);
        reply.code(200).send(message);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        reply.code(400).send({
          error: "Bad Request",
          message: errorMessage,
        });
      }

      browser.close();
    },
  });
}
