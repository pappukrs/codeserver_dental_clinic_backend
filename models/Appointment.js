const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
  appointmentStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'waiting'], 
    default: 'pending' 
  },
  scheduleTime: { 
    type: Date, 
    default: null 
  },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
