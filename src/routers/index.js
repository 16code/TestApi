const express = require('express');
const router = express.Router();
router.use('/post', function (req, res) {
	res.json({ok: true})
});
router.use('/auth', require('./auth/index'));
router.use('/user', require('./user/index'));
router.use('/songs', require('./songs/index'));
router.use('/artist', require('./artist/index'));
router.use('/album', require('./album/index'));
router.use('/search', require('./search/index'));
router.use('/playlist', require('./playlist/index'));
router.use('/banners', require('./banners/index'));
router.use('/play-urls', require('./play-urls/index').getPlayUrls);

module.exports = router;