import t from "tap";
import { buildServer } from "../../server";

t.test("Auth Endpoint - unit", async (t) => {
  const server = await buildServer();

  t.teardown(async () => {
    await server.close();
  });

  t.test("GET a jwt token", async (t) => {
    const response = await server.inject({
      url: "/jwt",
      method: "GET",
    });

    t.equal(response.statusCode, 200, "Expected code should be returned");

    const result = response.json();
    t.matchStrict(
      result,
      {
        token: String,
      },
      "Token should be returned"
    );
  });
});
