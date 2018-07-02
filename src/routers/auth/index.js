const express = require('express');
const router = express();
const { login, refreshToken } = require('./controller');
router.post('/login', login);
router.get('/refresh', refreshToken);
module.exports = router;
