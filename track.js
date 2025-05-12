const db = require("./db");
const scrapeFlightPrice = require("./scrapper");

const routes = [
  {
    route: "DEL-BOM",
    url: "https://www.ixigo.com/search/result/flight?from=DEL&to=BOM&date=24042025&adults=1&children=0&infants=0&class=e&source=Search+Form&hbs=true&sort_type=cheapest",
  },
  {
    route: "DEL-BLR",
    url: "https://www.ixigo.com/search/result/flight?from=DEL&to=BLR&date=24042025&adults=1&children=0&infants=0&class=e&source=Search+Form&sort_type=cheapest",
  },
];

async function trackFlights() {
  console.log("🔍 Tracking flights...");

  for (const { route, url } of routes) {
    try {
      const price = await scrapeFlightPrice(url);
      console.log(`✅ Scraped ${route}: ₹${price}`);

      if (!price) {
        console.log(`⚠️ No price found for ${route}`);
        continue;
      }

      db.query(
        "SELECT price FROM flight_prices WHERE route = ? ORDER BY timestamp DESC LIMIT 1",
        [route],
        (err, results) => {
          if (err) return console.error(err);

          const lastPrice = results[0]?.price || Infinity;

          if (price < lastPrice) {
            console.log(
              `💸 Price dropped for ${route}: ₹${lastPrice} → ₹${price}`
            );
          }

          db.query(
            "INSERT INTO flight_prices (route, price) VALUES (?, ?)",
            [route, price],
            (err) => {
              if (err)
                console.error(`Error inserting price for ${route}:`, err);
              else console.log(`📦 Saved price for ${route}: ₹${price}`);
            }
          );
        }
      );
    } catch (err) {
      console.error(`❌ Error tracking ${route}:`, err);
    }
  }
}

// 👉 Call it when this file is run directly
trackFlights();
