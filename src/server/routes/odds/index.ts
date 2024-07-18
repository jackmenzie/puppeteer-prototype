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
        reply.status(200).send(message);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        reply.send({
          statusCode: 400,
          error: "Bad Request",
          message: errorMessage,
        });
      }

      browser.close();
    },
  });
}
