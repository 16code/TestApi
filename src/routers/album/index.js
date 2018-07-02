const express = require('express');
const request = require('../../util/request');

const router = express();
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
// 获取专辑内容
router.get('/:id([0-9]{3,12})', function (req, res) {
    const id = req.params.id;
    const data = {
        csrf_token: ''
    };
    new request(`/v1/album/${id}`, req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
});
module.exports = router;
