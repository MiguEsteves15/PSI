const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authenticateToken = authMiddleware.authenticateToken;
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticateToken, userController.getCurrentUserProfile);

module.exports = router;