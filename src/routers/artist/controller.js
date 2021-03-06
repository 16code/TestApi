/* eslint-disable */
const request = require('../../util/request');
const requestOrigin = require('request');

function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
// 获取热门歌手
function getHotArtist(req, res) {
    const data = {
        type: req.query.type,
        csrf_token: '',
        offset: req.query.offset || 0,
        total: true,
        limit: req.query.limit || 20
    };
    const offsetStart = data.offset * data.limit;
    const offsetEnd = offsetStart + data.limit;

    new request(
        'http://music.163.com/eapi/toplist/artist?params=B5CAE4715306477C2EFA74D383640F01BF227BF8E889F80E2E2A442958463A7E589CC99878CFCE88D165B64712332AF39EC61B7E68903B2F9F079E8D1AB99FC61049A6D5B97AF8E6FFE8DA16ED540D2CFA80205B889ACA39F8B05AE593FDF5A094F118FF4600C2025094ECF6EB58F6D424B7A97B21A8C1D7CF0609AF2FBE9FDD88826E1667C889757BA920684C5C425FF01B5514AF1EB08AB7D298DB4D65187829E315F9FFBBEB43C2AE3DC21222B31CEC6FF337957AC122FBCB3E793FC1960151B0BDEBB1565BFD835E7A7D6A2D034A5591070D42C32DA4B69E0061C46D61239221A1C64EF676D891B44D7B855E27C82A7EB376F0B0C27952F2006E302B47DA1DE86C3488D53FD98ED9FDC6AA341DF0ECF92BA2E8F77E41811BF9447973C5C34FFED13E28AC544347F9E6ADF4B0008C371FC41C4490D3C9E1A225791D2170326231C40662633AA93D5CEF9AABC777AF268A4B13C560157339478DFAD5D910C966B43E1F017410DBF06D189E2BD6D0CD2682F343A83994E66CA73B5E2A67A122842BF945F2B434CBDE4C5A589A3A90F70DF1A8B63E7BAFBEB624956C62CFB1114AB841379541E5BB4625F2C28CAEA6A67E77A7EEAA1149D9D0F7E190D3A3408DF88B62FBF27996ABC925A93E5A67B4B0D1D931214BB07064F2BA4DCBA2E548E5A110E9B992C21E3930EB488172929C02C06D76BB193EF923D1906E0A0C4D75F5EB909AE77B0A2E55539A182D0B2533C654F2C90A038406B8850BFC022639F2B3FB7EDF40FD74AEA0B9119E9987D2909C01C587794F53459DB8EE83AA8D15FBEAC71EB3A00D8E40E78FE9A9A4068495D9257B39D8F825086F391FD5E7A48AACA96BC261E334A1929C81633234A0B22C573AEAD05BC8B4216283ACFD9E022950AEC812F554B913B4457FDF68AA2CC5E476922C2670D49154BC1DEB6D464F60DBFAD2BB4144762CD3721F52D42FDAE56DB9C529EDB6FB946CD725B3E2EA2AFDCF3F759D384B4F7F75AAA6F01F8093C8A140B3B388FF57272A6A7E10274290A79CDCA69E37BC066CE8CCD5B4BB4E12DA841B',
        req
    )
        .save(data)
        .then(({ list }) => res.json({ data: list.artists.slice(offsetStart, offsetEnd) }))
        .catch(error => {
            res.status(error.code).json(error);
        });
}
const cats = `入驻歌手|5001, 华语男歌手|1001
  , 华语女歌手|1002
  , 华语组合|1003
  , 欧美男歌手|2001
 , 欧美女歌手|2002
  , 欧美组合|2003
  , 日本男歌手|6001
  , 日本女歌手|6002
  , 日本组合|6003
  , 韩国男歌手|7001
  , 韩国女歌手|7002
  , 韩国组合|7003
  , 其他男歌手|4001
  , 其他女歌手|4002
  , 其他组合|4003`
    .replace(/[\r\n\s+]/g, '')
    .split(',')
    .map(item => {
        const [name, id] = item.split('|');
        return { id: +id, name };
    });
function getCategories(req, res) {
    res.json({
        data: cats
    });
}
function getCategorieArtist(req, res) {
    const data = {
        categoryCode: req.params.id || 1001,
        offset: req.query.offset || 0,
        total: 'true',
        limit: req.query.limit || 30
    };
    if (req.query.initial && /[A-Za-z]/.test(req.query.initial)) {
        data.initial = req.query.initial.toUpperCase().charCodeAt();
    }
    new request('/artist/list', req)
        .save(data)
        .then(response =>
            res.json({
                data: response.artists,
                meta: {
                    more: response.more,
                    category: +data.categoryCode,
                    offset: data.offset,
                    limit: data.limit
                }
            })
        )
        .catch(error => errorCallBack(error, res));
}

// 获取歌手单曲
function getAlbumsByArtist(req, res) {
    const id = req.params.id;
    const data = {
        offset: req.query.offset || 0,
        total: true,
        limit: req.query.limit || 30,
        csrf_token: ''
    };
    new request(`/artist/albums/${id}`, req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}
// 获取歌手专辑
function getSongsByArtist(req, res) {
    const data = {
        csrf_token: ''
    };
    const id = req.params.id;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 50;
    new request(`/v1/artist/${id}?offset=${offset}&limit=${limit}`, req)
        .save(data)
        .then(data => res.json(data))
        .catch(error => errorCallBack(error, res));
}

function getArtistImg(req, res) {
    const url = req.query.url;
    const fileStream = requestOrigin.get(url);
    if (fileStream) {
        fileStream.pipe(res);
    } else {
        res.status(500).end({ msg: "Can't open file" });
    }
}
module.exports = {
    getHotArtist,
    getSongsByArtist,
    getAlbumsByArtist,
    getCategories,
    getCategorieArtist,
    getArtistImg
};
