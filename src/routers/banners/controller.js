const request = require('../../util/request');

// 获取banner图片
function banners(req, res) {
    const data = {};
    new request('/v2/banner/get', req).save(data)
        .then(data => {
            const banners = data.banners || [];
            res.json(banners);
        })
        .catch(error => {
            res.status(error.code).json(error);
        });
}
module.exports = banners;