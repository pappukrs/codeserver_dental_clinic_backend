const express = require("express");
const { createAppointment, getAllAppointments } = require("../controllers/appointmentController");
const router = express.Router();

router.post("/appointment", createAppointment);
router.get("/appointment", getAllAppointments);

module.exports = router; // Directly export the router
