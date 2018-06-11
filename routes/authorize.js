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

router.get('/tier/basic', (req, res) => {

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

router.get('/tier/standard', (req, res) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger && !blogger.tier) {
                blogger.tier = 12;
                blogger.save(function(err) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/extended', (req, res) => {

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

router.get('/tier/cancel', (req, res) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger && !blogger.configured) {
                blogger.tier = null;
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
        if(req.query.blog) {
            req.session.blog_redirect = req.query.blog;
        }
        let uri = steem.getLoginURL();
        res.redirect(uri);
    } else if (req.session.blog_redirect) {
        let redirect = req.session.blog_redirect;
        req.session.blog_redirect = null;
        res.redirect('http://' + redirect + '/authorize?access_token=' + req.query.access_token);
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
                        theme: 'clean-blog',
                        blog_title: 'Steem Blog',
                        blog_slogan: 'Personal Steem Powered Blog',
                        categories: [{steem_tag: 'blog', slug: 'blog', name: 'Default category'}]
                    });
                    req.session.blogger = user;
                    user.save(function (err) {
                        if(err) {
                            console.log(" * Jakiś błąd podczas zapisu nowego użytkownika");
                            res.redirect('/');
                        } else {
                            console.log(" * Dodano nowego użytkownika do bazy: " + user.steem_username)

                            res.redirect('/configure');
                        }
                    })
                }
            })

        });
    }
});

module.exports = router;