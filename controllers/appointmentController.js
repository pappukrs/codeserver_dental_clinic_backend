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

exports.createAppointment = async (req, res) => {
  const { name, phone, email, dob, message } = req.body;

  if (!name || !phone || !email || !dob || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Save to database
    const appointment = new Appointment({ name, phone, email, dob, message });
    await appointment.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Appointment Received",
      text: `
        You have a new appointment request:
        - Name: ${name}
        - Phone: ${phone}
        - Email: ${email}
        - Date of Birth: ${dob}
        - Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: "Appointment created and email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
