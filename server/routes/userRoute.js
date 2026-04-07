const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// for storing file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get('/students', userController.fetchStudents);
router.get('/:id', userController.getUserById);

router.put("/profile", userController.updateProfile);
router.delete("/profile", userController.deleteAccount);

router.post('/profile-picture', upload.single('profilePic'), userController.uploadProfilePicture);
router.delete('/profile-picture', userController.deleteProfilePicture);

module.exports = router;