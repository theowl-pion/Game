/* eslint-disable no-await-in-loop */
const mongoose = require("mongoose");
const crypto = require("crypto"); // For generating random numbers/strings
const WinningTicket = require("../src/models/winningTicket"); // Corrected path: ../src/models/
require("dotenv").config({ path: "../.env" }); // Load environment variables from backend root

// --- Configuration ---
const TOTAL_TICKETS = 1000; // Total number of tickets to generate (adjust as needed)
const TICKET_LENGTH = 10; // Length of the unique ticket number

const prizes = [
  { name: "Infuseur à thé", value: 5, percentage: 60 },
  { name: "Thé Détox/Infusion", value: 10, percentage: 20 },
  { name: "Thé Signature", value: 15, percentage: 10 },
  { name: "Coffret 39€", value: 39, percentage: 6 },
  { name: "Coffret 69€", value: 69, percentage: 4 },
];

// Verify percentages add up to 100
const totalPercentage = prizes.reduce((sum, p) => sum + p.percentage, 0);
if (totalPercentage !== 100) {
  console.error("Error: Prize percentages do not add up to 100!");
  process.exit(1);
}

// --- Helper Functions ---

/**
 * Generates a random alphanumeric string of a given length.
 * @param {number} length - The desired length of the string.
 * @returns {string} The random string.
 */
function generateTicketNumber(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length)
    .toUpperCase(); // return required number of characters
}

/**
 * Selects a prize based on the defined percentages.
 * @returns {object} The selected prize object { name, value }.
 */
function selectPrize() {
  const rand = Math.random() * 100;
  let cumulativePercentage = 0;

  for (const prize of prizes) {
    cumulativePercentage += prize.percentage;
    if (rand < cumulativePercentage) {
      return { prizeWon: prize.name, prizeValue: prize.value };
    }
  }
  // Fallback in case of floating point issues (shouldn't happen if percentages = 100)
  return { prizeWon: prizes[0].name, prizeValue: prizes[0].value };
}

// --- Main Generation Logic ---

async function generateTickets() {
  // Check for DB connection string
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI environment variable not set.");
    console.error(
      "Please ensure you have a .env file in the backend directory with MONGO_URI defined."
    );
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected.");

    // Optional: Clear existing tickets (use with caution!)
    // console.log('Clearing existing tickets...');
    // await WinningTicket.deleteMany({});
    // console.log('Existing tickets cleared.');

    console.log(`Generating ${TOTAL_TICKETS} tickets...`);
    const ticketsToInsert = [];
    const generatedNumbers = new Set(); // Keep track of generated numbers to ensure uniqueness

    while (ticketsToInsert.length < TOTAL_TICKETS) {
      const ticketNumber = generateTicketNumber(TICKET_LENGTH);

      // Ensure uniqueness within this batch (DB index handles ultimate uniqueness)
      if (!generatedNumbers.has(ticketNumber)) {
        generatedNumbers.add(ticketNumber);
        const prizeDetails = selectPrize();
        ticketsToInsert.push({
          ticketNumber,
          isUsed: false,
          ...prizeDetails,
        });

        // Log progress periodically
        if (ticketsToInsert.length % 100 === 0) {
          console.log(
            `Generated ${ticketsToInsert.length}/${TOTAL_TICKETS}...`
          );
        }
      }
    }

    console.log("Bulk inserting tickets into the database...");
    // Insert tickets in bulk for better performance
    await WinningTicket.insertMany(ticketsToInsert, { ordered: false }); // ordered: false allows inserting valid ones even if duplicates are found

    console.log(
      `Successfully generated and inserted ${TOTAL_TICKETS} tickets.`
    );
  } catch (error) {
    console.error("Error generating tickets:", error);
    if (error.code === 11000) {
      console.error(
        "Duplicate key error encountered. Some tickets might not have been inserted due to duplicate numbers. " +
          "Consider increasing TICKET_LENGTH or running the script again if needed."
      );
    }
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("MongoDB Disconnected.");
  }
}

// Run the generation function
generateTickets();
