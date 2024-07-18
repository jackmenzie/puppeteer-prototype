import puppeteer from "puppeteer";
import t from "tap";
import { Betano } from "./Betano";

t.test("Betano", { name: "integration" }, async (t) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  t.afterEach(async () => {
    await browser.close();
  });

  t.test("Horse race data extraction", async (t) => {
    const betano = new Betano(browser);
    const nextHorseRaceUrl = await betano.getNextHorseRaceUrl();

    if (!nextHorseRaceUrl) {
      t.fail("Failed to find URL for next horse race");
    } else {
      const outcomes = await betano.getHorseRaceOutcomes(nextHorseRaceUrl);

      t.ok(Array.isArray(outcomes), "Outcomes should be an array");
      t.ok(outcomes.length > 0, "Data array should not be empty");

      outcomes.forEach((outcome) => {
        t.type(outcome.name, "string", "Name should be a string");
        t.type(outcome.trainer, "string", "Trainer should be a string");
        t.type(outcome.jockey, "string", "Jockey should be a string");
        t.type(outcome.form, "string", "Form should be a string");
        // t.type(outcome.weight, "string", "Weight should be a string");
        t.type(outcome.odds, "string", "Odds should be a string");
      });
    }
  });
});
