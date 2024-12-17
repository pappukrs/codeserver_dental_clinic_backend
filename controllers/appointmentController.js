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

// Create a new appointment
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

    // Send emails to clinic and user (as shown earlier)
    const clinicMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CLINIC_EMAIL,
      subject: "New Appointment Received",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>You have a new appointment request:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Booked",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Appointment Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for booking an appointment. Here are the details:</p>
          <ul>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
        </div>
      `,
    };

    // Send emails
    await transporter.sendMail(clinicMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(201).json({ success: "Appointment created and emails sent!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all appointments
module.exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments from the database
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};

// Schedule an appointment (update status and schedule time)
module.exports.scheduleAppointment = async (req, res) => {
  const { appointmentStatus, scheduleTime,clinicMsg } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Update the status and schedule time
    appointment.appointmentStatus =appointmentStatus || appointment?.appointmentStatus;
    appointment.scheduleTime = scheduleTime || appointment?.scheduleTime;
    appointment.clinicMsg = clinicMsg || appointment?.clinicMsg
    await appointment.save();

    // Send confirmation email to both clinic and user
    const clinicMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CLINIC_EMAIL,
      subject: "Appointment Scheduled",
      html: `
        <div>
          <h2>Appointment has been Successfully scheduled:</h2>
          <p><strong>Name:</strong> ${appointment.name}</p>
           <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Status:</strong> ${appointment.appointmentStatus}</p>
          <p><strong>Scheduled Time:</strong> ${appointment.scheduleTime}</p>
          <p><strong>Msg:</strong> ${appointment.clinicMsg}</p>
        </div>
      `,
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: "Appointment Scheduled",
      html: `
        <div>
          <h2>Your appointment has been scheduled:</h2>
          <p><strong>Name:</strong> ${appointment.name}</p>
           <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Status:</strong> ${appointment.appointmentStatus}</p>
          <p><strong>Scheduled Time:</strong> ${appointment.scheduleTime}</p>
          <p><strong>Msg:</strong> ${appointment.clinicMsg}</p>
        </div>
      `,
    };

    await transporter.sendMail(clinicMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: "Appointment scheduled and emails sent!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule appointment." });
  }
};

// Get appointments by status
module.exports.getAppointmentsByStatus = async (req, res) => {

  console.log("getAppointmentsByStatus gets called")
  const { status } = req.params;

  try {
    const appointments = await Appointment.find({ appointmentStatus: status });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments by status." });
  }
};
