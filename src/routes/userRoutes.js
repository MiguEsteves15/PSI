const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authenticateToken = authMiddleware.authenticateToken;
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticateToken, userController.getCurrentUserProfile);
router.put('/me/username', authenticateToken, userController.updateUsername);
router.put('/me/email', authenticateToken, userController.updateEmail);
router.put('/me/birth-date', authenticateToken, userController.updateBirthDate);
router.put('/me/password', authenticateToken, userController.updatePassword);
router.put('/me/favorite-artist', authenticateToken, userController.setFavoriteArtist);
router.delete('/me/favorite-artist', authenticateToken, userController.removeFavoriteArtist);

module.exports = router;
