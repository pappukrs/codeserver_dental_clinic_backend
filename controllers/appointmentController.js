const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transport error:", error);
  } else {
    console.log("Email transporter ready.");
  }
});

module.exports.createAppointment = async (req, res) => {
  const { name, phone, email, date, message } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !date || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Save appointment to the database
    const appointment = new Appointment({ name, phone, email, date, message });
    await appointment.save();

    // Email to clinic
    const clinicMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL, // Clinic email from environment variable
      subject: "New Appointment Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">You have a new appointment request:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    // Email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Email from request body
      subject: "Appointment Booked",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for booking an appointment with us. Here are the details:</p>
          <ul>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>Our team will contact you shortly. If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>Clinic Team</p>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(clinicMailOptions);
    console.log("Email sent to clinic.");

    try {
      await transporter.sendMail(userMailOptions);
      console.log("Email sent to user.");
    } catch (emailError) {
      console.error("Failed to send email to user:", emailError.message);
      // Log this or notify admin if user email fails
    }

    res.status(201).json({ success: "Appointment created and emails sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all appointments
module.exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments from the database
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};
