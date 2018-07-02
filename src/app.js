const express = require('express');
const apicache = require('apicache');
const path = require('path');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const app = express();
const cache = apicache.middleware;
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8585');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

const onlyStatus200 = (req, res) => res.statusCode === 200 && req.method.toLowerCase() === 'get';
const docPath = path.resolve(__dirname + '/../docs/');

app.use(allowCrossDomain);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: true }));
// app.use(cache('2 minutes', onlyStatus200));
// app.use(express.static(docPath));

app.use(function(req, res, next) {
    const proxy = req.query.proxy;
    if (proxy) {
        req.headers.cookie = req.headers.cookie + `__proxy__${proxy}`;
    }
    next();
});

app.use(
    validator({
        errorFormatter(param, msg, value) {
            return { param, msg, value };
        }
    })
);

app.use('/api', require('./routers'));
// app.use('/img', require('./img'));
app.use(function(req, res, next) {
    res.status(404).send({ code: 404, msg: 'Not Found' });
});
app.use(function(err, req, res, next) {
    const status = err.status || 500;
    res.status(status).send({ code: status, msg: err.stack });
});

const port = process.env.PORT || 3000;
app.listen(port);
