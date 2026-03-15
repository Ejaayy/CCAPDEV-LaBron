const express = require("express");
const router = express.Router();
const slotController = require("../controller/slot.controller");

// Specific routes must come before /:id
router.get("/overview", slotController.getWeeklyOverview);
router.get("/", slotController.getAvailableSlots);
router.post("/", slotController.createSlot);
router.get("/:id/occupancy", slotController.getSlotOccupancy);
router.patch("/:id", slotController.updateSlot);

module.exports = router;