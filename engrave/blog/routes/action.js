let express = require('express');
let router = express.Router();
let utils = require('../modules/utils.js');
let steem = require('../modules/steemconnect')
let steemhelper = require("steem");
var cfg = require('../config');
let articles = require('../modules/articles');

router.post('/vote', utils.isAuthenticated, (req, res) => {
    console.log("Vote from session: " + req.session.steemconnect.name);

    var author = cfg.get_config().steem_username;
    var voter = req.session.steemconnect.name;
    var permlink = req.session.current_url;
    let weight = 10000

    steem.setAccessToken(req.session.access_token);
    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
        if (err) {
            console.log(err.error_description);
            if (err.error_description.indexOf("You have already voted in a similar way") > -1)  {
                res.json({ error: "Już głosowałeś!" }) 
            } else {
                res.json({ error: err.error_description }) 
            }
            
        } else {
            console.log("Vote sent successfully");
            
            steemhelper.api.getContent(author, permlink, function (err, result) {
                res.json({ success: "Głos został oddany, dzięki!", net_votes: result.net_votes, value: parseFloat(parseFloat(result.pending_payout_value.replace(" SBD", "")) + parseFloat(result.total_payout_value.replace(" SBD", ""))).toFixed(2) });
            });
        }
    });
});

/// editor musi miec wieksze prawa: error_description: 'The access_token scope does not allow the following operation(s): comment_options' }
// https://github.com/steemit/steemconnect/wiki/OAuth-2

router.post('/comment', utils.isAuthenticated, (req, res) => {
    let title = 'RE: ' + req.body.title;
    let body = req.body.comment_body;
    let parentAuthor = req.body.parent_author ? req.body.parent_author : cfg.get_config().steem_username;
    let parentPermlink = req.body.permlink;
    let author = req.session.steemconnect.name;
    let commentPermlink = steemhelper.formatter.commentPermlink(parentAuthor, parentPermlink);

    steem.setAccessToken(req.session.access_token);
    steem.comment(parentAuthor, parentPermlink, author, commentPermlink, title, body, "", (err, steemResponse) => {
        if(err) {
            console.log(err);
            if (err.error_description) {
                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                if (errorstring.length > 0) {
                    res.json({ error: errorstring });
                } else {
                    res.json({ error: "Error" });
                }
                
            } else {
                res.json({ error: err.message });
            }
        } else {
            console.log("Comment posted on steem");
            res.json({ success: "Komentarz dodany", permlink: commentPermlink, body: body, author: author});
        }
    });
});

router.post('/comment-vote', utils.isAuthenticated, (req, res) => {

    var author = req.body.comment_author;
    var voter = req.session.steemconnect.name;
    var permlink = req.body.comment_permlink;
    let power =  req.body.power;
    if(power < 1) {
        power = 1;
    } else if (power > 100) {
        power = 100;
    }
    let weight = power * 100;

    steem.setAccessToken(req.session.access_token);
    steem.vote(voter, author, permlink, weight, function (err, steemResponse) {
        if (err) {
            console.log(err.error_description);
            if (err.error_description.indexOf("You have already voted in a similar way") > -1) {
                res.json({ error: "Już głosowałeś!" })
            } else {
                res.json({ error: err.error_description })
            }

        } else {
            console.log("Vote sent successfully");           

            steemhelper.api.getContent(author, permlink, function (err, result) {
                if(err) {
                    res.json({ error: "Wystąpił jakiś błąd" })
                } else {
                    res.json({ success: "Głos został oddany, dzięki!", net_votes: result.net_votes, value: parseFloat(parseFloat(result.pending_payout_value.replace(" SBD", "")) + parseFloat(result.total_payout_value.replace(" SBD", ""))).toFixed(2) });
                }
            });
        }
    });
});

router.post('/more', (req, res) => {

    var start_permlink = req.body.start_permlink.substr(1);

    if (req.body.author) {
        // var author = req.body.author;
        var posts = articles.getArticlesByAuthor(req.body.author, parseInt(cfg.get_config().load_more_quantity), start_permlink)
        res.json({ success: "ha! ok!", more: posts });
    } else {
        var posts = articles.getArticlesByCategory(req.body.category, parseInt(cfg.get_config().load_more_quantity), start_permlink)
        res.json({ success: "ha! ok!", more: posts });
    }

    // if (req.body.category) {
    //     // var category = req.body.category;
    //     var posts = articles.getArticlesByCategory(req.body.category, parseInt(cfg.get_config().load_more_quantity), start_permlink)
    //     res.json({ success: "ha! ok!", more: posts });
    // } else if(req.body.author) {
    //     // var author = req.body.author;
    //     var posts = articles.getArticlesByAuthor(req.body.author, parseInt(cfg.get_config().load_more_quantity), start_permlink)
    //     res.json({ success: "ha! ok!", more: posts });
    // } else {
    //     var posts = articles.getArticlesByCategory(null, parseInt(cfg.get_config().load_more_quantity), start_permlink)
    //     res.json({ success: "ha! ok!", more: posts });
    // }
   
    // let test = articles.getArticlesByCategory('', parseInt(cfg.get_config().load_more_quantity), start_permlink)

    // utils.getUserFeed(parseInt(cfg.get_config().load_more_quantity), start_permlink, category, author, function (results) {
    //     var posts = utils.prepareCategoryListing(null, results);
    //     res.json({ success: "ha! ok!", more: posts.latest });
       
    // })
});

router.post('/offchain-comment', (req, res) => {

    var body = req.body.comment_body;
    var author = req.body.comment_author;
    var email = req.body.comment_email;
    var followReplies = req.body.comment_follow_replies; // should you get information about replies

    comments.add_comment(author, body, parent_author, parent_permlink, cb);
    
});

module.exports = router;