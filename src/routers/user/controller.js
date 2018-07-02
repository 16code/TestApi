const request = require('../../util/request');
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
// 获取用户资料
function getUserProfile(req, res) {
    const data = {
        csrf_token: ''
    };
    const id = req.params.id;
    new request(`/v1/user/detail/${id}`, req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取用户订阅信息数量
function getUserSubcount(req, res) {
    const data = {
        csrf_token: ''
    };
    new request('/subcount', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取用户歌单
function getUserPlaylist(req, res) {
    const data = {
        offset: 0,
        uid: req.params.id,
        limit: 1000,
        csrf_token: ''
    };
    new request('/user/playlist', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取用户电台
function getUserDj(req, res) {
    const data = {
        offset: req.query.offset || '0',
        limit: req.query.limit || 30,
        csrf_token: ''
    };
    const id = req.params.id;
    new request(`/dj/program/${id}`, req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取用户关注列表
function getUserFollows(req, res) {
    const data = {
        userId: req.params.id,
        offset: 0,
        limit: 1000,
        csrf_token: ''
    };
    new request('/user/getfolloweds', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取用户播放记录
function getUserPlayRecord(req, res) {
    const data = {
        uid: req.params.id,
       	type: req.query.type || 0,
        csrf_token: ''
    };
    new request('/v1/play/record', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}

// 喜欢的音乐列表
function getUserLikedSongs(req, res) {
    const data = {
        uid: req.params.id,
        csrf_token: ''
    };
    new request('/song/like/get', req).save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}

module.exports = {
    getUserProfile,
    getUserSubcount,
    getUserPlaylist,
    getUserDj,
    getUserFollows,
    getUserPlayRecord,
    getUserLikedSongs
};