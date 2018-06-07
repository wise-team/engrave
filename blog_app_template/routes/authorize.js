let express = require('express');
let steem = require('../modules/steemconnect')
let router = express.Router();

let Users = require('../models/users.js');

router.get('/logout', (req, res) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});

router.get('/', (req, res, next) => {
    if(!req.query.access_token) {
        var host = req.get('host');
        console.log(host);
        // let uri = steem.getLoginURL();
        res.redirect('https://engrave.website/authorize?blog=' + host);
    } else {
        req.session.access_token = req.query.access_token;
        steem.setAccessToken(req.session.access_token);
        steem.me((err, steemResponse) => {
            req.session.steemconnect = steemResponse.account;

            Users.findOne({ username: req.session.steemconnect.name}, function (err, user) {
                if(user) {
                    console.log("Witamy ponownie: ", user.username);
                } else {
                    user =  new Users({
                        username: req.session.steemconnect.name,
                        permissions: "user"
                    });
                    user.save(function (err) {
                        if(err) {
                            console.log("Jakiś błąd podczas zapisu nowego użytkownika");
                        } else {
                            console.log("Dodano nowego użytkownika do bazy: ", user.username)
                        }
                    })
                }
            })

            if (req.session.current_url) {
                res.redirect('/' + req.session.current_url);
            } else {
                res.redirect('/');
            }
            
        });
    }
});

module.exports = router;