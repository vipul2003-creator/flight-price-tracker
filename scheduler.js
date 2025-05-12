const cron = require("node-cron");
const trackFlights = require("./track");
console.log("scheduler started");
// Run every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log("Running flight price tracker...");
  trackFlights();
});
