const request = require('../../util/request');
const getProxyList = require('../../util/proxy');
const crypto = require('crypto');
function errorCallBack(error, res) {
    res.status(error.code).json(error);
}
const inputValidRules = {
    username: {
        notEmpty: true,
        matches: {
            options: /^1\d{10}/,
            errorMessage: '手机号不正确'
        },
        errorMessage: '请输入用户名'
    },
    password: {
        notEmpty: true,
        errorMessage: '请输入密码'
    }	
};

// 用户登录
function login(req, res) {
    req.checkBody(inputValidRules);
    const errors = req.validationErrors(true);
    if (errors) {
        return res.status(400).json(errors);
    }
    const md5sum = crypto.createHash('md5');
    const { username, password } = req.body;
    md5sum.update(password);
    const data = {
        phone: username,
        password: md5sum.digest('hex'),
        rememberLogin: 'true',
        clientToken: '1_jVUMqWEPke0/1/Vu56xCmJpo5vP1grjn_SOVVDzOc78w8OKLVZ2JH7IfkjSXqgfmh'
    };
    getProxyList().then(function (proxyList) {
        const ip = proxyList[Math.floor(Math.random() * proxyList.length)];
        new request('/login/cellphone', req, {
            proxy: 'http://' + ip
        }).save(data)
            .then(({ body, cookie } )=> {
                res.set({
                    'Set-Cookie': cookie&&cookie.map(x => x.replace('Domain=.music.163.com', ''))
                });
                res.json(body);
            })
            .catch(error => {
                res.status(error.code || 500).json(error);
            });
    }).catch(error => {
        res.status(500).json(error);
    });

}
function refreshToken(req, res) {
    const data = {
        csrf_token: ''
    };
    new request('/login/token/refresh/', req).save(data)
        .then(({ body, cookie } )=> {
            res.set({
                'Set-Cookie': cookie&&cookie.map(x => x.replace('Domain=.music.163.com', ''))
            });
            res.json(body);
        })
        .catch(error => errorCallBack(error, res));
}

module.exports = { login, refreshToken };