# flight-price-tracker
Flight Price Tracker
A web application to track and compare flight prices across various routes in India, using web scraping and a MySQL database to store historical price data.
Features

Search Flights: Select departure and destination cities, and a travel date to find the lowest flight price.
Price Tracking: Automatically track prices for predefined routes every 6 hours using a cron job.
Database Storage: Store flight price data in a MySQL database for historical analysis.
Frontend Interface: User-friendly HTML form to input flight details and display results.
Backend API: Express.js server to handle scraping requests and database operations.

Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL
Scraping: Puppeteer
Scheduling: node-cron
Environment: dotenv for configuration
Other: nodemailer (not currently used), cors for cross-origin requests

Prerequisites

Node.js (v18 or higher)
MySQL (v8 or higher)
Google Chrome (for Puppeteer)

Setup Instructions

Clone the Repository
git clone <repository-url>
cd flight-price-tracker


Install Dependencies
npm install


Configure Environment VariablesCreate a .env file in the root directory with the following:
DB_HOST=localhost
DB_USER=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
DB_NAME=flight_tracker


Set Up MySQL Database

Create a database named flight_tracker.
Execute the following SQL to create the required table:CREATE TABLE flight_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route VARCHAR(10) NOT NULL,
  price DECIMAL(10, 2),
  airline VARCHAR(100),
  time VARCHAR(50),
  date DATE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




Run the Application

Start the Express Server (runs on http://localhost:3001):node server.js


Start the Scheduler (for periodic price tracking):node scheduler.js


Serve the Frontend:Open index.html in a browser or use a static server (e.g., npx serve).



Usage

Frontend:

Open index.html in a browser.
Select "From" and "To" cities, choose a travel date, and click "Get Lowest Price".
View the cheapest flight details, including airline, time, and price.
Click "Book" to visit the booking site or "View Price History Graph" for Google Flights data.


API:

Endpoint: GET /api/price?from=<from>&to=<to>&date=<date>
Example: http://localhost:3001/api/price?from=DEL&to=BOM&date=2025-05-01
Response:{
  "from": "DEL",
  "to": "BOM",
  "date": "2025-05-01",
  "price": 4500,
  "airline": "IndiGo",
  "time": "06:00 - 08:15"
}




Scheduler:

Tracks prices for routes defined in track.js every 6 hours.
Stores price data in the flight_prices table and logs price drops.



Project Structure

scrapper.js: Puppeteer script to scrape flight prices from ixigo.com.
server.js: Express.js server to handle API requests and save data to MySQL.
db.js: MySQL connection setup.
track.js: Logic to track predefined routes and detect price drops.
scheduler.js: Cron job to run track.js every 6 hours.
index.html: Frontend interface for searching flight prices.
.env: Environment variables for database configuration.
package.json: Project dependencies and scripts.

Notes

Scraping: The scraper targets ixigo.com and may break if the website's structure changes. Update selectors in scrapper.js as needed.
Puppeteer: Runs in non-headless mode (headless: false) for debugging. Set to true for production.
Date Format: The API expects dates in YYYY-MM-DD format.
Error Handling: Check console logs for scraping or database errors.
Security: Ensure .env is not committed to version control.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/new-feature).
Commit changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature/new-feature).
Open a pull request.

License
This project is licensed under the ISC License. See the package.json for details.
