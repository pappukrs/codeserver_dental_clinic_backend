const express = require("express");
const { createAppointment, getAllPendingAppointments, scheduleAppointment, getAppointmentsByStatus } = require("../controllers/appointmentController");
const router = express.Router();

// Create a new appointment
router.post("/appointment", createAppointment);

// Get all appointments
router.get("/appointment", getAllPendingAppointments);

// Schedule an appointment based on id
router.put("/appointment/schedule/:id", scheduleAppointment);

// Get appointments based on status (pending, confirmed, waiting)
router.get("/appointment/status/:status", getAppointmentsByStatus);

module.exports = router;
