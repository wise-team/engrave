let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

let Blogs = require('../database/blogs.js');

router.get('/logout', (req, res) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});


router.get('/create', (req, res, next) => {
    
});


// router.get('/login', (req, res) => {
    
//        Blogs.findOne({steem_username: "ss"});

// });

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
                    console.log("Witamy ponownie: ", user.steem_username);
                } else {
                    user =  new Blogs({
                        steem_username: req.session.steemconnect.name,
                        created: Date(),
                        port: 81,
                        email: 'bgor91@gmail.com'
                    });
                    user.save(function (err) {
                        if(err) {
                            console.log("Jakiś błąd podczas zapisu nowego użytkownika");
                        } else {
                            console.log("Dodano nowego użytkownika do bazy: ", user.steem_username)
                        }
                    })
                }
            })

            if (req.session.current_url) {
                res.redirect('/' + req.session.current_url);
            } else {
                res.redirect('/dashboard');
            }
        });
    }
});

module.exports = router;