let express = require('express');
let router = express.Router();
let steem = require('steem');
var config = require('../config').default;

router.get('/', (req, res, next) => {
    res.render('main/main.pug', {blogger: req.session.blogger});
});

router.get('/about', (req, res, next) => {
    res.render('main/about.pug', {blogger: req.session.blogger});
});

router.get('/how-to-earn', (req, res, next) => {
    res.render('main/how-to-earn.pug', {blogger: req.session.blogger});
});

router.get('/create', (req, res, next) => {
    res.render('main/create.pug', {blogger: req.session.blogger});
});

router.get('/configure', (req, res, next) => {
    res.render('main/configure.pug', {blogger: req.session.blogger});
});

module.exports = router;