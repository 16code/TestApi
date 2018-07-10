const express = require('express');
const router = express();
const { getHotArtist, getSongsByArtist, getAlbumsByArtist, getArtistImg } = require('./controller');
router.get('/', getHotArtist);
router.get('/artistimg', getArtistImg);
router.get('/:id([0-9]{3,12})/songs', getSongsByArtist);
router.get('/:id([0-9]{3,12})/albums', getAlbumsByArtist);
module.exports = router;
