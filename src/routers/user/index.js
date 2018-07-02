const express = require('express');
const router = express();
const { getUserProfile, getUserSubcount, getUserPlaylist, getUserDj, getUserFollows, getUserPlayRecord, getUserLikedSongs } = require('./controller');
router.get('/:id([0-9]{3,12})', getUserProfile);
router.get('/:id([0-9]{3,12})/playlist', getUserPlaylist);
router.get('/:id([0-9]{3,12})/dj', getUserDj);
router.get('/:id([0-9]{3,12})/record', getUserPlayRecord);
router.get('/:id([0-9]{3,12})/follow', getUserFollows);
router.get('/:id([0-9]{3,12})/liked', getUserLikedSongs);

router.get('/subcount', getUserSubcount);

module.exports = router;
