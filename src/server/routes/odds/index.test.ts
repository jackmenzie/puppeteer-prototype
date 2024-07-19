import t from "tap";
import { buildServer } from "../../server";
import { Betano } from "./Betano";
import puppeteer from "puppeteer";

t.test("Odds Endpoint - integration", async (t) => {
  const server = await buildServer();

  const authResponse = await server.inject({
    url: "/jwt",
    method: "GET",
  });
  const { token } = authResponse.json();

  t.teardown(async () => {
    await server.close();
  });

  t.test("POST with an invalid token", async (t) => {
    const response = await server.inject({
      url: "/odds",
      method: "POST",
      body: {
        invalidProperty: "",
      },
      headers: {
        authorization: `Bearer INVALID`,
      },
    });

    t.equal(response.statusCode, 401, "Error code should returned");

    const result = response.json();
    t.match(
      result,
      {
        statusCode: 401,
        error: "Unauthorized",
        message: "Unauthorized",
      },
      "Error should be returned"
    );
  });

  t.test("POST an invalid object", async (t) => {
    const response = await server.inject({
      url: "/odds",
      method: "POST",
      body: {
        invalidProperty: "",
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    t.equal(response.statusCode, 400, "Error code should returned");

    const result = response.json();
    t.match(
      result,
      {
        code: "FST_ERR_VALIDATION",
        error: "Bad Request",
        message: "body must have required property 'url'",
      },
      "Error should be returned"
    );
  });

  t.test("POST an invalid URL", async (t) => {
    const url = "AN_INVALID_URL";
    const response = await server.inject({
      url: "/odds",
      method: "POST",
      body: {
        url,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    t.equal(response.statusCode, 400, "Error code should returned");

    const result = response.json();
    t.match(
      result,
      {
        error: "Bad Request",
        message: `invalid Betano horse racing URL supplied: '${url}'`,
      },
      "Error should be returned"
    );
  });

  t.test("POST a valid URL", async (t) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const betano = new Betano(browser);
    const nextHorseRaceUrl = await betano.getNextHorseRaceUrl();

    const response = await server.inject({
      url: "/odds",
      method: "POST",
      body: {
        url: nextHorseRaceUrl,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    t.equal(response.statusCode, 200, "Ok code should returned");

    const result = response.json();
    t.ok(Array.isArray(result), "Outcomes should be an array");
    t.ok(result.length > 0, "Data array should not be empty");

    browser.close();
  });
});
