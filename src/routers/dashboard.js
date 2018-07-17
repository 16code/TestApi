const express = require('express');
const request = require('request');
const router = express();

const port = process.env.PORT || 3000;
const url = `http://localhost:${port}/api`;

router.get('/', async function getDashboard(req, res) {
    // const latest = await getSong('new');
    // const topboard = await getSong('top');
    // const playlist = await getPlaylist('hot');
    // const artists = await getArtist();
    const [latest, topboard, playlist, artists] = await Promise.all([getSong('new'), getSong('top'), getPlaylist('hot'), getArtist()]);
    res.send({
        data: {
            latest: latest.data,
            topboard: topboard.data,
            playlist: playlist.playlists,
            artists: artists.data
        }
    });
});
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}

function getSong(cat = 'new') {
    return new Promise((resolve, reject) => {
        request(`${url}/songs/${cat}?offset=0&limit=6`, function(error, response, body) {
            if (error) {
                error.code = (response && response.statusCode) || 500;
                return reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}
function getPlaylist(cat = 'hot') {
    return new Promise((resolve, reject) => {
        request(`${url}/playlist/${cat}?offset=0&limit=5`, function(error, response, body) {
            if (error) {
                error.code = (response && response.statusCode) || 500;
                return reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}
function getArtist() {
    return new Promise((resolve, reject) => {
        request(`${url}/artist?offset=0&limit=15`, function(error, response, body) {
            if (error) {
                error.code = (response && response.statusCode) || 500;
                return reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}

module.exports = router;
