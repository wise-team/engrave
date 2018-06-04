let express = require('express');
let router = express.Router();
let steem = require('steem');
var config = require('../config')

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
    if(!req.session.blogger) {
        res.render('main/create.pug', {blogger: req.session.blogger});
    } else if(!req.session.blogger.tier) {
        res.redirect('/configure');
    } else {
        res.redirect('/');
    }
});

router.get('/configure', (req, res, next) => {
    if(req.session.blogger && !req.session.blogger.tier) {
        res.render('main/configure.pug', {blogger: req.session.blogger});
    } else {
        res.redirect('/');
    }
    
});

module.exports = router;