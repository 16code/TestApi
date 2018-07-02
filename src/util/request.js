const request = require('request');
const Encrypt = require('./crypto.js');
const querystring = require('querystring');

function randomUserAgent() {
    const userAgentList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
        'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
    ];
    const num = Math.floor(Math.random() * userAgentList.length);
    return userAgentList[num];
}
const errorsD = {
    500: {
        code: 500,
        msg: '服务器内部错误'
    }
};
const API_PREFIXE = 'http://music.163.com/weapi';
class createRequest {
    constructor(uri, req, opts) {
        const url = uri.indexOf('http') === -1 ? API_PREFIXE + uri : uri;
        const cookie = req.get('Cookie') || '';
        const optionsDefault = {
            url,
            headers: {
                Accept: '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                Referer: 'http://music.163.com',
                Host: 'music.163.com',
                Cookie: cookie,
                'User-Agent': randomUserAgent()
            }
        };
        this.options = Object.assign(optionsDefault, opts);
    }
    get(parms = {}) {
        const keys = Object.keys(parms).filter(key => !!parms[key]);
        const data = keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parms[key])}`);
        return new Promise((resolve, reject) => {
            request(this.options.url + '?' + data.join('&'), (error, res, body) => {
                if (error) {
                    reject(errorsD[500]);
                } else {
                    try {
                        const bodyData = JSON.parse(body);
                        resolve(bodyData);
                    } catch (error) {
                        resolve(body);
                    }
                }
            });
        });
    }
    save(data) {
        const cryptoreq = Encrypt(data);
        this.options.method = 'POST';
        this.options.body = querystring.stringify(cryptoreq);
        return new Promise((resolve, reject) => {
            request(this.options, (error, res, body) => {
                if (error) {
                    reject(errorsD[500]);
                } else {
                    const cookie = res.headers['set-cookie'];
                    const bodyData = res.headers['content-type'] !== 'text/plain' && JSON.parse(body);
                    const statusCode = bodyData.code;
                    if (!statusCode) {
                        reject(errorsD[500]);
                        return;
                    }
                    switch (true && statusCode > 0) {
                        case statusCode >= 200 && statusCode < 300:
                            if (this.options.url.includes('login')) {
                                resolve({ body: bodyData, cookie });
                            } else {
                                resolve(bodyData);
                            }
                            break;
                        case statusCode === 301:
                            reject({ code: 401, msg: 'Unauthorized' });
                            break;
                        default:
                            reject(bodyData);
                            break;
                    }
                }
            });
        });
    }
}

module.exports = createRequest;
