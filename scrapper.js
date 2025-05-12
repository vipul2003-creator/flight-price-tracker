const puppeteer = require("puppeteer");

async function scrapeFlightPrice(url) {
  const browser = await puppeteer.launch({ headless: false }); // Turn true when stable
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`🌐 Navigating to: ${url}`);

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await autoScroll(page);

    await page.waitForSelector(".flex.items-start.w-full", { timeout: 15000 });

    const flightInfo = await page.evaluate(() => {
      const flightCard = document.querySelector(".flex.items-start.w-full");
      if (!flightCard) return null;

      const priceElement =
        flightCard.querySelector('h6[data-testid="pricing"]') ||
        flightCard.querySelector(".text-right");
      const airlineElement = flightCard.querySelector(".airlineTruncate");
      const timeElement = flightCard.querySelector(
        ".timeTileList h6.h6.text-primary.font-medium"
      );

      const price = priceElement
        ? parseFloat(priceElement.innerText.replace(/[^0-9]/g, ""))
        : null;
      const airline = airlineElement
        ? airlineElement.innerText.trim()
        : "Unknown Airline";
      const time = timeElement ? timeElement.innerText.trim() : "Unknown Time";

      return {
        price,
        airline,
        time,
      };
    });

    if (!flightInfo || !flightInfo.price) {
      console.log("⚠️ No flight data found.");
      return null;
    }

    console.log("✈️ First Flight Info:");
    console.log(`🛩 Airline: ${flightInfo.airline}`);
    console.log(`🕓 Time: ${flightInfo.time}`);
    console.log(`💰 Price: ₹${flightInfo.price}`);

    return flightInfo;
  } catch (err) {
    console.error("❌ Scraping error:", err);
    return null;
  } finally {
    await browser.close();
  }
}

// Scroll just once to load dynamic content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const scrollHeight = document.body.scrollHeight;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

module.exports = scrapeFlightPrice;
