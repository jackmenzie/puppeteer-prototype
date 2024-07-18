import { Browser } from "puppeteer";

export class Betano {
  browser: Browser;
  url: string = "https://www.betano.co.uk";
  horseRacingPageUrl: string = "https://www.betano.co.uk/en-gb/sports/364";

  horseRacingCode: number = 364;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  // Required for testing as active/complete races use a different URL
  async getNextHorseRaceUrl() {
    const page = await this.browser.newPage();
    await page.goto(this.horseRacingPageUrl, { waitUntil: "networkidle2" });

    // Returns -> /en-gb/sports/364/meetings/129590298/events/2252983000
    const nextHorseRaceUrlSuffix = await page.$eval(
      ".upcoming-races__see-all.bvs-button.is-primary",
      (element: Element) => element.getAttribute("href")
    );

    const nextHorseRaceUrl = this.url + nextHorseRaceUrlSuffix;
    return nextHorseRaceUrl;
  }

  validateHorseRaceUrl(url: string) {
    const pattern =
      /^https:\/\/www\.betano\.co\.uk\/en-gb\/sports\/364\/meetings\/\d+\/events\/\d+$/;

    if (!pattern.test(url)) {
      throw new Error(`invalid Betano horse racing URL supplied: '${url}'`);
    }
  }

  async getHorseRaceOutcomes(url: string) {
    this.validateHorseRaceUrl(url);

    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const raceOutcomes = await page.$$eval(
      ".racecard-outcome",
      (elements: Element[]) => {
        return elements.map((element) => {
          const infoParagraphs = element.querySelectorAll(
            ".racecard-outcome-info p"
          );
          const name = infoParagraphs[0]?.querySelector("h3")?.textContent;
          const trainer = infoParagraphs[1]?.textContent?.replace("T: ", "");
          const jockey = infoParagraphs[2]?.textContent?.replace("J: ", "");
          const form = infoParagraphs[3]?.textContent?.replace("Form: ", "");
          const weight = infoParagraphs[4]?.textContent?.replace(
            "Weight: ",
            ""
          );
          const odds = element.querySelector(
            ".bvs-button-sport.racecard-outcome-button span"
          )?.textContent;

          return {
            name,
            trainer,
            jockey,
            form,
            weight,
            odds,
          };
        });
      }
    );

    return raceOutcomes;
  }
}
