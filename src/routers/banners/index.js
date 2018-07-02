const express = require('express');
const router = express();
const banners = require('./controller');
router.get('/', banners);
module.exports = router;
