let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

let Blogs = require('../database/blogs.js');

router.get('/', (req, res, next) => {
    if (req.session.steemconnect) {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger) {
                res.render('dashboard/main.pug', {blogger: blogger});
            } else {
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
    
});

module.exports = router;