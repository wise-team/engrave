let express = require('express');
let router = express.Router();
let steem = require('steem');
var config = require('../config').default;

router.get('/', (req, res, next) => {
    res.render('main/main.pug');
});

router.get('/about', (req, res, next) => {
    res.render('main/about.pug');
});

router.get('/how-to-earn', (req, res, next) => {
    res.render('main/how-to-earn.pug');
});

router.get('/create', (req, res, next) => {
    res.render('main/create.pug');
});

router.get('/create/10', (req, res, next) => {
    res.render('main/create_partial.pug');
});

router.get('/create/15', (req, res, next) => {
    res.render('main/create_partial.pug');
});

router.get('/create/20', (req, res, next) => {
    res.render('main/create_partial.pug');
});


module.exports = router;