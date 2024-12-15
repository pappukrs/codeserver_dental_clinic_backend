const express = require("express");
const { createAppointment ,getAllAppointment} = require("../controllers/appointmentController");
const router = express.Router();

router.post("/appointment", createAppointment);
router.get("/appointment", getAllAppointment);

module.exports = router;
