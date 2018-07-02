const request = require('../../util/request');
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
// 全部歌单分类
function getPlaylistCategory(req, res) {
    const data = {
        cat: req.query.cat || '全部',
        order: req.query.order || 'hot',
        offset: req.query.offset || 0,
        limit: req.query.limit || 50,
        total: 'true'
    };
    new request('/playlist/list', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取推荐歌单
function getRecommendPlaylist(req, res) {
    const data = {
        limit: req.query.limit || 30,
        offset: req.query.limit || 0,
        total: true,
        n: 1000,
        total: true
    };
    new request('/personalized/playlist', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取精品歌单
function getHotPlaylist(req, res) {
    const data = {
        cat: req.query.cat || '全部',
        order: 'hot',
        offset: req.query.offset || 0,
        limit: req.query.limit || 10,
        total: 'true'
    };
    new request('/playlist/list', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取相似歌单
function getSimiPlaylist(req, res) {
    const data = {
        songid: req.params.id,
        offset: req.query.offset || 0,
        limit: req.query.limit || 50
    };
    new request('/discovery/simiPlaylist', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取歌单详情
function getPlaylistDetail(req, res) {
    const data = {
        id: req.params.id,
        offset: 0,
        total: true,
        limit: 1000,
        n: 1000,
        csrf_token: ''
    };
    new request('/v3/playlist/detail', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
module.exports = {
    getHotPlaylist,
    getSimiPlaylist,
    getPlaylistDetail,
    getRecommendPlaylist,
    getPlaylistCategory
};
