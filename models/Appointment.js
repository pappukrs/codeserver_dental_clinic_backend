const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
