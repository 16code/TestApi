const express = require('express');
const router = express();
const { getHotPlaylist, getPlaylistDetail, getSimiPlaylist, getRecommendPlaylist, getPlaylistCategory } = require('./controller');
router.get('/', getPlaylistCategory);
router.get('/hot', getHotPlaylist);
router.get('/recommend', getRecommendPlaylist);
router.get('/simi/:id([0-9]{3,15})', getSimiPlaylist);
router.get('/:id([0-9]{3,15})', getPlaylistDetail);

module.exports = router;
