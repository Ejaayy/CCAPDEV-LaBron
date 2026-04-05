const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/students', userController.fetchStudents);
router.get('/:id', userController.getUserById);

router.put("/profile", userController.updateProfile);
router.delete("/profile", userController.deleteAccount);

module.exports = router;