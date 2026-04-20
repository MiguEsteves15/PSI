const express = require('express');
const artistController = require('../controllers/artistController');

const router = express.Router();

router.get('/search', artistController.searchArtists);
router.get('/:id', artistController.getArtistById);
router.get('/:id/albums', artistController.getArtistAlbums);

module.exports = router;
