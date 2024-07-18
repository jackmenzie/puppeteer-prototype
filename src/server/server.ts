import type { FastifyInstance } from "fastify";
import fastify from "fastify";
import odds from "./routes/odds";
import puppeteer from "puppeteer";

export const buildServer = async () => {
  const server: FastifyInstance = fastify();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  server.decorate("browser", function () {
    return browser;
  });

  await server.register(odds);

  return server;
};
