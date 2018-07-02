const request = require('../../util/request');

function getSongUrl(req, ids) {
    const br = req.query.br || 999000;
    const data = {
        ids: [ids],
        br: br,
        csrf_token: ''
    };
    return new request('/song/enhance/player/url', req).save(data);
}
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
function getPlayUrls(req, res) {
    const { id, type } = req.query;
    if(id && type && type === 'song') {
        getSongUrl(req, id)
            .then(data => res.json(data))
            .catch(error => errorCallBack(error, res));
    } else {
        res.status(400).json({
            code: 400,
            msg: '参数错误'
        });
    }
}

module.exports = { getPlayUrls, getSongUrl };