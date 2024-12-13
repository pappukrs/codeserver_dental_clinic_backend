const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'hotmail', 'yahoo', depending on your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your email password from .env
  },
});

// Test the transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages.");
  }
});

// API Endpoint
app.post("/api/appointment", async (req, res) => {
  const { name, phone, email, dob, msg } = req.body;

  // Input validation (basic example)
  if (!name || !phone || !email || !dob || !msg) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email
    to: process.env.RECIPIENT_EMAIL, // Owner's email
    subject: "New Appointment Received",
    text: `
      You have a new appointment request:
      - Name: ${name}
      - Phone: ${phone}
      - Email: ${email}
      - Date of Birth: ${dob}
      - Message: ${msg}
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Appointment email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send appointment email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
