import * as express from 'express';
import { IExtendedRequest } from './IExtendedRequest';

let steem = require('../modules/steemconnect')
let router = express.Router();

let Blogs = require('../database/blogs.js');

router.get('/logout', (req: IExtendedRequest, res: express.Response) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});

router.get('/tier/basic', (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err: Error, blogger: any) {
            if(blogger && !blogger.tier) {
                blogger.tier = 10;
                blogger.save(function(err: Error) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/standard', (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err: Error, blogger: any) {
            if(blogger && !blogger.tier) {
                blogger.tier = 12;
                blogger.save(function(err: Error) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/extended', (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err: Error, blogger: any) {
            if(blogger && !blogger.tier) {
                blogger.tier = 15;
                blogger.save(function(err: Error) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/tier/cancel', (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err: Error, blogger: any) {
            if(blogger && !blogger.configured) {
                blogger.tier = null;
                blogger.save(function(err: Error) {
                    res.redirect('/dashboard');
                });
            } else {
                res.redirect('/');
            }
        }) 
    }
});

router.get('/', (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {
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
        steem.me((err: Error, steemResponse: any) => {
            req.session.steemconnect = steemResponse.account;
            console.log("Steemconnect logged in: " + req.session.steemconnect.name);

            Blogs.findOne({ steem_username: req.session.steemconnect.name}, function (err: Error, user: any) {
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
                        frontpage_language: 'en',
                        categories: [{steem_tag: 'engrave', slug: 'blog', name: 'Default category'}]
                    });
                    req.session.blogger = user;
                    user.save(function (err: Error) {
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