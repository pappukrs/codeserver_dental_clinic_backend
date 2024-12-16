const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointmentRoutes.js"); // Import as is
// console.log("appointmentRoutes ",appointmentRoutes )

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Allow all origins
app.use(cors());

// Handle preflight requests for all routes
app.options('*', cors()); // This will handle OPTIONS requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send("hello world");
});

// Routes
app.use("/api", appointmentRoutes); // Use the router directly

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
