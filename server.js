const db = require("./db"); // Ensure db.js exports your MySQL connection

const express = require("express");
const scrapeFlightPrice = require("./scrapper");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/price", async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res
      .status(400)
      .json({ error: 'Missing "from", "to", or "date" query parameter' });
  }

  const formattedDate = date.split("-").reverse().join(""); // '2025-04-24' → '24042025'

  const searchUrl = `https://www.ixigo.com/search/result/flight?from=${from}&to=${to}&date=${formattedDate}&adults=1&children=0&infants=0&class=e&source=Search+Form&hbs=true&sort_type=cheapest`;

  try {
    const flightInfo = await scrapeFlightPrice(searchUrl);

    if (!flightInfo || !flightInfo.price) {
      return res.status(500).json({ error: "No flight info found" });
    }

    // Save flight data to database
    const route = `${from}-${to}`;
    db.query(
      "INSERT INTO flight_prices (route, price, airline, time, date) VALUES (?, ?, ?, ?, ?)",
      [route, flightInfo.price, flightInfo.airline, flightInfo.time, date],
      (err) => {
        if (err) {
          console.error("❌ Error saving to DB:", err);
        } else {
          console.log(
            `📦 Saved to DB: ${route} ₹${flightInfo.price} (${flightInfo.airline}, ${flightInfo.time})`
          );
        }
      }
    );

    res.json({
      from,
      to,
      date,
      price: flightInfo.price,
      airline: flightInfo.airline,
      time: flightInfo.time,
    });
  } catch (err) {
    res.status(500).json({ error: "Scraping failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
