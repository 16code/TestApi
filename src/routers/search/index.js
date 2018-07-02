const request = require('../../util/request');

function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
function search(req, res) {
    const keywords = req.query.keywords;
    const type = req.query.type || 1;
    const limit = req.query.limit || 30;
    const offset = req.query.offset || 0;
    // *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
    const data = {
        csrf_token: '',
        limit,
        type,
        s: keywords,
        offset
    }; 
    new request('/search/get', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
function searchMultimatch(req, res) {
    const data = {
        csrf_token: '',
        type: req.query.type || 1,
        s: req.query.keywords || ''
    };
    new request('/search/suggest/multimatch', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}

module.exports = search;