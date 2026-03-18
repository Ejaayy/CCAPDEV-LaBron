const express = require("express");
const router = express.Router();
const labController = require("../controllers/lab.controller");

router.get("/", labController.getAllLabs);
router.post("/", labController.createLab);

module.exports = router;
