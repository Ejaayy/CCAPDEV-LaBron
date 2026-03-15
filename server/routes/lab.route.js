const express = require("express");
const router = express.Router();
const labController = require("../controller/lab.controller");

router.get("/", labController.getAllLabs);
router.post("/", labController.createLab);

module.exports = router;
