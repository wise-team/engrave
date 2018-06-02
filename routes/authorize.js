let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

let Blogs = require('../database/blogs.js');
let nginx = require('../modules/nginx.js');
let nodeapps = require('../modules/nodeapps.js');

router.get('/logout', (req, res) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});

router.get('/tier/5', (req, res) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger && !blogger.tier) {
                blogger.tier = 5;
                blogger.save(function(err) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/10', (req, res) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger && !blogger.tier) {
                blogger.tier = 10;
                blogger.save(function(err) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/15', (req, res) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger && !blogger.tier) {
                blogger.tier = 15;
                blogger.save(function(err) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/', (req, res, next) => {
    
    if(!req.query.access_token) {
        let uri = steem.getLoginURL();
        res.redirect(uri);
    } else {
        req.session.access_token = req.query.access_token;
        steem.setAccessToken(req.session.access_token);
        steem.me((err, steemResponse) => {
            req.session.steemconnect = steemResponse.account;
            console.log("Steemconnect logged in: " + req.session.steemconnect.name);

            Blogs.findOne({ steem_username: req.session.steemconnect.name}, function (err, user) {
                if(user) {
                    req.session.blogger = user;
                    console.log("Witamy ponownie: ", user.steem_username);
                    if(user.tier) {
                        res.redirect('/dashboard');
                    } else {
                        res.redirect('/configure');
                    }
                } else {
                    user =  new Blogs({
                        steem_username: req.session.steemconnect.name,
                        created: Date(),
                        configured: false,
                        posts_per_category_page: 15,
                        load_more_posts_quantity: 9,
                        author_image_url: "",
                        theme: 'default',
                        blog_title: 'Personal Blog',
                        categories: [{steem_tag: 'blog', slug: 'blog', name: 'Default category'}]
                    });
                    req.session.blogger = user;
                    user.save(function (err) {
                        if(err) {
                            console.log("Jakiś błąd podczas zapisu nowego użytkownika");
                            res.redirect('/');
                        } else {
                            console.log("Dodano nowego użytkownika do bazy: " + user.steem_username)

                            res.redirect('/configure');
                        }
                    })
                }
            })

        });
    }
});

module.exports = router;