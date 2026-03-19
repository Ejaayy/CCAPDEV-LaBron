const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/students', userController.fetchStudents);

module.exports = router;