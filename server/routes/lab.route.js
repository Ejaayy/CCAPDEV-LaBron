const express = require("express");
const router = express.Router();
const labController = require("../controllers/lab.controller");

router.get("/", labController.getAllLabs);
router.post("/", labController.createLab);
router.patch("/:id", labController.updateLab);
router.delete("/:id", labController.deleteLab);

module.exports = router;
