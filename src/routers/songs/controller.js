const request = require('../../util/request');
const requestOrigin = require('request');
const topListMapper = {
    0: ['云音乐新歌榜', '3779629', '//p1.music.126.net/N2HO5xfYEqyQ8q6oxCw8IQ==/18713687906568048.jpg'],
    1: ['云音乐热歌榜', '3778678', '//p1.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg'],
    2: ['原创歌曲榜', '2884035', '//p1.music.126.net/sBzD11nforcuh1jdLSgX7g==/18740076185638788.jpg'],
    3: ['云音乐飙升榜', '19723756', '//p1.music.126.net/DrRIg6CrgDfVLEph9SNh7w==/18696095720518497.jpg'],
    4: ['云音乐电音榜', '10520166', '//p1.music.126.net/qN-sDLqehN1oHGyov-0EZw==/109951163068669685.jpg'],
    5: ['抖音排行榜', '2250011882', '//p1.music.126.net/bZvjH5KTuvAT0YXlVa-RtQ==/109951163326845001.jpg'],
    6: ['内地TOP榜', '64016', '//p1.music.126.net/2klOtThpDQ0CMhOy5AOzSg==/18878614648932971.jpg'],
    7: ['港台TOP榜', '112504', '//p1.music.126.net/JPh-zekmt0sW2Z3TZMsGzA==/18967675090783713.jpg'],
    8: ['iTunes榜', '11641012', '//p1.music.126.net/83pU_bx5Cz0NlcTq-P3R3g==/18588343581028558.jpg'],
    9: ['Billboard榜', '60198', '//p1.music.126.net/EBRqPmY8k8qyVHyF8AyjdQ==/18641120139148117.jpg'],
    10: ['KTV嗨榜', '21845217', '//p1.music.126.net/H4Y7jxd_zwygcAmPMfwJnQ==/19174383276805159.jpg']
};

function topListCategories(req, res) {
    const cats = Object.keys(topListMapper).map(key => ({
        id: key,
        name: topListMapper[key][0],
        coverImgUrl: topListMapper[key][2]
    }));
    res.send({ data: cats });
}

function errorCallBack(error, res) {
    error.code = error.code || 500;
    res.status(error.code).json(error);
}
// 推荐新音乐
function filterNewSongData(data = {}) {
    const { result = [] } = data;
    return result.map(item => {
        const {
            name,
            id,
            song: { artists: ar, album: al, duration: dt }
        } = item;
        return {
            name,
            id,
            ar,
            al,
            dt
        };
    });
}
function getNewSongs(req, res) {
    const data = {
        type: 'recommend',
        offset: req.query.offset || 0,
        limit: req.query.limit || 1000,
        total: true,
        csrf_token: ''
    };
    new request('/personalized/newsong', req)
        .save(data)
        .then(d =>
            res.json({
                data: filterNewSongData(d),
                total: d.result.length
            })
        )
        .catch(error => errorCallBack(error, res));
}
// 歌曲排行榜
function filterTopSongData(data = {}) {
    const {
        playlist: {
            tracks = [],
            description,
            playCount,
            trackCount,
            shareCount,
            commentCount,
            subscribedCount,
            coverImgUrl,
            updateTime,
            subscribed,
            coverImgId_str
        }
    } = data;
    const list = tracks.map(item => {
        const { name, id, ar, al, dt } = item;
        return {
            name,
            id,
            ar,
            al,
            dt
        };
    });
    return {
        data: list,
        meta: {
            subscribed,
            description,
            playCount,
            trackCount,
            shareCount,
            commentCount,
            subscribedCount,
            coverImgUrl,
            coverImgId: coverImgId_str,
            updateTime
        }
    };
}
function getTopSongs(req, res) {
    const queryId = +req.query.id || 0;
    const id = topListMapper[queryId][1];
    const limit = req.query.limit || 1000;
    const data = {
        id,
        total: true,
        n: limit,
        csrf_token: ''
    };
    new request('/v3/playlist/detail', req)
        .save(data)
        .then(data => res.json(filterTopSongData(data)))
        .catch(error => errorCallBack(error, res));
}
// 每日推荐
function filterRecommendSongData(data = {}) {
    const { recommend = [] } = data;
    return recommend.map(item => {
        const { name, id, artists: ar, album: al, duration: dt } = item;
        return {
            name,
            id,
            ar,
            al,
            dt
        };
    });
}
function getRecommendSongs(req, res) {
    const queryId = req.query.id || 1;
    const data = {
        offset: 0,
        total: true,
        limit: 20,
        csrf_token: ''
    };
    new request('/v1/discovery/recommend/songs', req)
        .save(data)
        .then(data => res.json(filterRecommendSongData(data)))
        .catch(error => errorCallBack(error, res));
}
// 歌曲详情
function getSongDetails(req, res) {
    const idx = req.params.id;
    const data = {
        idx,
        c: JSON.stringify([{ id: idx }]),
        csrf_token: ''
    };
    const detail = new request('/v3/song/detail', req).save(data);
    const getSongUrl = __songUrl(req, res, idx); // eslint-disable-line
    const getSongLyric = __getLyric(req, res, idx); // eslint-disable-line
    return Promise.all([detail, getSongUrl, getSongLyric])
        .then(data => {
            const [song, media, lyric] = data;
            const { id: SongID, name, ar, alia, al, mv, h, m, l } = song.songs[0];
            al.blurUrl = al.pic_str ? `/api/songs/${al.pic_str}/blur` : null;
            al.picUrl = al.picUrl.replace(/^https?:/, '');
            const adjustData = { id: SongID, name, artist: ar, album: al, alia: alia && alia[0] ? alia[0] : null, mv: mv !== 0 ? mv : null };
            let { url } = media;
            url = (url && url.replace(/^https?/, 'http')) || null;
            if (url) {
                url = url.replace('.mp3', '');
                url = `/api/songs/${idx}/media?url=${encodeURIComponent(url)}`;
            }
            adjustData.media = url;
            adjustData.lyric = lyric.lrc.lyric || '';
            adjustData.quality = (h ? h.br : m.br || 96000) / 1000;
            res.json(adjustData);
        })
        .catch(error => errorCallBack(error, res));
}
// 歌词
function __getLyric(req, res, idx) {
    // const idx = req.params.id;
    const id = idx;
    const data = {};
    return new request(`/song/lyric?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`, req).save(data);
}
function getLyric(req, res) {
    const id = req.params.id;
    const data = {};
    new request(`/song/lyric?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`, req)
        .save(data)
        .then(data =>
            res.json({
                data: data.lrc.lyric,
                code: data.code
            })
        )
        .catch(error => errorCallBack(error, res));
}
// 相似歌曲
function getSimiSong(req, res) {
    const data = {
        songid: req.params.id,
        offset: req.query.offset || 0,
        limit: req.query.limit || 50
    };
    new request('/v1/discovery/simiSong', req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 喜欢音乐
function likeSong(req, res) {
    const trackId = req.params.id;
    const like = req.query.like || true;
    const alg = req.query.alg || 'itembased';
    const time = req.query.time || 25;
    const data = {
        csrf_token: '',
        trackId,
        like
    };
    new request(`/radio/like?alg=${alg}&trackId=${trackId}&like=${like}&time=${time}`, req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
function __songUrl(req, res, idx) {
    // const idx = req.params.id;
    const id = idx || req.query.id;
    const br = req.query.br || 999000;
    const data = {
        ids: [id],
        br: br,
        csrf_token: ''
    };
    return new Promise((resolve, reject) => {
        new request('/song/enhance/player/url', req)
            .save(data)
            .then(resp => {
                resolve(resp.data && resp.data[0]);
            })
            .catch(reject);
    });
}

function getMedia(req, res) {
    const url = req.query.url;
    const file = 'http://119.23.73.114/media?url=' + encodeURIComponent(url) + '.mp3';
    const fileStream = requestOrigin.get(file);
    if (fileStream) {
        req.pipe(fileStream);
        fileStream.pipe(res);
    } else {
        res.status(500).end({ msg: 'Can\'t open file' });
    }
}

function getBlurImg(req, res) {
    const id = req.params.id;
    const file = `http://music.163.com/api/img/blur/${id}`;
    const fileStream = requestOrigin.get(file);
    if (fileStream) {
        req.pipe(fileStream);
        fileStream.pipe(res);
    } else {
        res.status(500).end({ msg: 'Can\'t open file' });
    }
}

module.exports = {
    getNewSongs,
    getTopSongs,
    getRecommendSongs,
    getSongDetails,
    getSimiSong,
    likeSong,
    getLyric,
    getMedia,
    getBlurImg,
    topListCategories
};
