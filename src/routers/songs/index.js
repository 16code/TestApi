const express = require('express');
const router = express();
const { getNewSongs, getTopSongs, getSongDetails, getSongUrls, getLyric, getRecommendSongs, getSimiSong, likeSong } = require('./controller');
router.get('/', getNewSongs);
router.get('/new', getNewSongs);
router.get('/top', getTopSongs);
router.get('/recommend', getRecommendSongs);
router.get('/simi/:id([0-9]{3,12})', getSimiSong);
router.get('/like/:id([0-9]{3,12})', likeSong);
router.get('/lyric/:id([0-9]{3,12})', getLyric);
router.get('/:id([0-9]{3,12})', getSongDetails);

module.exports = router;
