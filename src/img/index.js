const express = require('express');
const request = require('request');
const fs = require('fs');

const router = express();
router.get('/', function(req, res) {
    res.status(403).end();
});
router.get('/:id', function(req, res) {
    // res.send({ code: 'http://music.163.com/api/img/blur/' + req.params.id });
    // res.contentType('image/jpeg');
    // res.send('http://music.163.com/api/img/blur/' + req.params.id);

    request
        .get(`http://music.163.com/api/img/blur/${req.params.id}`)
        .on('error', function(err) {
            console.log(err);
            res.end(err);
        })
        .pipe(request.put('http://mysite.com/img.jpg'));
    // .pipe(fs.createWriteStream('doodle.jpg'));
});
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
module.exports = router;
