let express = require('express');
let router = express.Router();
let utils = require('../modules/utils.js');
let steem = require('steem');
var config = require('../config');
let moment = require('moment');
let getUrls = require('get-urls');
const isImage = require('is-image');
var getSlug = require('speakingurl');
const notifications = require('../modules/notifications');
let authors = require('../modules/authors');
let sitemap = require('../modules/sitemap');
let articles = require('../modules/articles');

let Articles = require('../models/articles.js');
let Users = require('../models/users.js');

router.get('/', (req, res, next) => {
    req.session.current_url = "dashboard";
    res.redirect('cockpit');
});

router.get('/request', (req, res) => {
    req.session.current_url = "request";

    if (req.session.steemconnect) {
        Users.findOne({ username: req.session.steemconnect.name }, function (err, user) {
            if (user && !err) {
                if(user.permissions == 'requested') {
                    res.redirect('/dashboard/requested');
                } else if (user.permissions == 'user'){
                    res.render('dashboard/default/request');
                } else {
                    res.redirect('/dashboard');
                }
            }
        });
        
    } else {
        res.redirect('/');
    }
});

router.get('/requested', (req, res) => {
    req.session.current_url = "requested";

    if (req.session.steemconnect) {
        Users.findOne({ username: req.session.steemconnect.name }, function (err, user) {
            if (user && !err) {
                if (user.permissions == 'requested') {
                    res.render('dashboard/default/requested');
                } else {
                    res.redirect('/dashboard');
                }
            }
        });
    } else {
        res.redirect('/');
    }
});

router.get('/login', (req, res) => {
    req.session.current_url = "dashboard";

    if (req.session.steemconnect) {
        res.redirect('/');
    } else {
        res.render('dashboard/default/login');
    }
});

router.post('/add', utils.isEditorAuthenticated, (req, res) => {
    
    let article = req.body;

    article.status = "added";

    updateArticleInDatabase(article, req.session.steemconnect.name, "added", function (err, _id) {
        if (err) {
            res.json({ error: "Jakiś błąd. Spróbuj ponownie" });
        } else {
            res.json({ success: "Artykuł wysłano do przeglądu", _id: _id });
        }
    })
}); 

router.post('/request', (req, res) => {
    let email = req.body.email;
    let interests = req.body.interests;

    console.log(email, interests);

    if (interests == null || email == null || interests == "" || email == ""  ) {
        res.json({ error: "Wypełnij wszystkie pola" });
    } else {
        Users.findOne({ username: req.session.steemconnect.name }, function (err, user) {
            if (user && !err) {
                if (user.permissions == 'user') {
                    
                    user.permissions = "requested";
                    user.editor_interests = interests;
                    user.editor_email = email;

                    user.save();
                    res.json({ success: "Zgłoszenie zostało przyjęte. Oczekuj odpowiedzi ;)" });

                } else {
                    res.json({ error: "Nie możesz zgłosić się ponownie. Poczekaj na kontakt" });
                }
            } else {
                res.json({ error: "Wystąpił błąd. Spróbuj ponownie" });
            }
        });
    }

}); 

router.post('/editors/accept', (req, res) => {
    let username = req.body.username;

    Users.findOne({ username: username }, function (err, user) {
        if (user && !err) {
            if (user.permissions == 'requested') {
                user.permissions = "editor";
                user.save();
                res.json({ success: "Nowy autor zaakceptowany" });
            } else {
                res.json({ error: "Autor nie oczekuje na akceptację" });
            }
        } else {
            res.json({ error: "Wystąpił błąd. Spróbuj ponownie" });
        }
    });
}); 

router.post('/editors/reject', (req, res) => {
    let username = req.body.username;
    // TODO check if user is authorized to accept or reject others
    Users.findOne({ username: username }, function (err, user) {
        if (user && !err) {
            if (user.permissions == 'requested') {
                user.permissions = "user"; // change to rejected??
                user.save();
                res.json({ success: "Nowy autor odrzucony" });
            } else {
                res.json({ error: "Autor nie oczekuje na akceptację" });
            }
        } else {
            res.json({ error: "Wystąpił błąd. Spróbuj ponownie" });
        }
    });
}); 

router.post('/update', utils.isEditorAuthenticated, (req, res) => {

    let article = req.body;

    updateArticleInDatabase(article, req.session.steemconnect.name, "draft", function (err, _id) {
        if(err) {
            res.json({ error: "Jakiś błąd. Spróbuj ponownie" });
        } else {
            res.json({ success: "Artykuł zaktualizowano", _id: _id });
        }
    })
}); 

router.post('/accept/', utils.isEditorAuthenticated, (req, res)=> {

    utils.prepareDashboardUserObject(req.session, function (err, user) {
        if(user.permissions == 'editor-in-chief' && !err) {
            Articles.findOne({ _id: req.body.id }, function (err, article) {
                if (err) {
                    res.json({ error: err });
                } else {
                    if (article) {

                        var permlink = getSlug(article.title);

                        var urls = getUrls(article.body);
                        var links = [];
                        var image = [];

                        image.push(article.image);

                        if (article.source_link != "") {
                            links.push(article.source_link);
                        }

                        urls.forEach(url => {
                            if (url[url.length - 1] == ')') {
                                var trimmed = url.substring(0, url.length - 1);
                            } else {
                                var trimmed = url;
                            }

                            if (isImage(trimmed)) {
                                image.push(trimmed);
                            } else {
                                links.push(trimmed);
                            }
                        })

                        var tags = [];

                        for (var key in config.categories) {
                            if (config.categories[key] === article.category) {
                                tags.push(key); // obtain category steem tags
                            }
                        }

                        var tempTags = article.tags.split(" ");
                        tempTags.forEach(tag => {
                            if (tag != ' ' && tag != null && tag != '') {
                                if(config.frontpage_language == 'pl') {
                                    tags.push("pl-" + tag);
                                } else {
                                    tags.push(tag);
                                }
                                
                            }
                        })

                        config.extra_tags.forEach(tag => {
                            tags.push(tag);
                        })

                        var jsonMetadata = {
                            tags: tags,
                            app: "glodniwiedzy/0.1",
                            image: image,
                            links: links,
                            format: "markdown",
                            root_author: article.user
                        }

                        var body = '<div class="text-justify">\n\n';
                        
                        body +="![](" + article.image + ")\n\n";
                        body += article.body;

                        if (config.info_add_website == true || config.info_add_website == "true") {
                            body += "\n\n***********";
                            body += "\n\n### " + config.info_website_info_text;
                        }
                        
                        if (config.info_add_root_author == true || config.info_add_root_author == "true") {
                            body += "\n\n***********";
                            body += "\n\nArtykuł autorstwa: @" + article.user + ", dodany za pomocą serwisu [" + config.website_title + "](https://" + config.domain + ")";
                        }

                        if (article.source_link != "") {
                            if (article.source_title != "") {
                                body += "\n\n***********";
                                body += "\n\n" + translation.frontpage.source + ": [" + article.source_title + "](" + article.source_link + ")";
                            } else {
                                var a = document.createElement('a');
                                a.href = article.source_link;
                                body += "\n\n***********";
                                body += "\n\n" + translation.frontpage.source + ": [" + a.hostname + "](" + article.source_link + ")";
                            }
                        }

                        body += '\n\n</div>'

                        steem.broadcast.comment(config.editorial_posting_key, "", tags[0], config.editorial_username, permlink, article.title, body, jsonMetadata, function (err, result) {

                            if (err) {
                                console.log(err);
                                res.json({ error: "Coś poszło nie tak..." }); // todo dodac error do wysylanego jsona
                            } else {
                                article.permlink = permlink;
                                article.status = "approved";

                                notifications.sendNotification(article.title, article.body.substr(0, config.onesignal_body_length), article.image, article.permlink, article.category);

                                article.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.json({ error: "Coś poszło nie tak..." }); // todo dodac error do wysylanego jsona
                                    } else {
                                        console.log("Poprawnie zaktualizowany artykuł w bazie danych");
                                        authors.updateAuthorDetails(article.user);
                                        sitemap.addUrl(article.permlink, article.image);

                                        if(config.beneficiary != "" && config.beneficiary != null) {
                                            if (config.beneficiary_share_percentage != "" && config.beneficiary_share_percentage != null) {

                                                var extension = [
                                                    [0, {
                                                        beneficiaries: [
                                                            { account: config.beneficiary, weight: parseInt(config.beneficiary_share_percentage) * 100 }
                                                        ]
                                                    }]
                                                ];

                                                steem.broadcast.commentOptions(config.editorial_posting_key, config.editorial_username, article.permlink, '1000000.000 SBD', 10000, true, true, extension, function (err, result) {
                                                    console.log(err, result);
                                                });
                                            }
                                        }

                                        steem.broadcast.vote(config.editorial_posting_key, config.editorial_username, config.editorial_username, article.permlink, 10000, function (err, result) {
                                            if (!err) {
                                                console.log("Voted for new article sucessfully");
                                            } else {
                                                console.log(err);
                                            }
                                        });

                                        res.json({ success: "Artykuł został dodany do blockchain!" });
                                    }
                                })
                            }
                        });
                    } else {
                        res.json({ error: "Coś poszło nie tak..." });
                    }
                }
            });
        } else {
            res.json({error: "Nie masz uprawnień kotku!"});
        }
    });

   

});

router.get('/add', utils.isEditorAuthenticated, (req, res) => {
    utils.prepareDashboardUserObject(req.session, function (err, user) {
        res.render('dashboard/default/add', { url: "add", user: user });
    })
});

router.get('/cockpit', utils.isEditorAuthenticated, (req, res) => {

    Articles.count({user: req.session.steemconnect.name, status: "added"}, function (err, added_posts_quantity) {
        if(err) {
            console.log(err);
        } else {
            Articles.count({ user: req.session.steemconnect.name, status: "approved" }, function (err, approved_posts_quantity) {
                if (err) {
                    console.log(err);
                } else {
                    Articles.count({ user: req.session.steemconnect.name, status: "rejected" }, function (err, rejected_posts_quantity) {
                        if(err) {
                            console.log(err);
                        } else {
                            Articles.count({ user: req.session.steemconnect.name, status: "draft" }, function (err, draft_posts_quantity) {
                                utils.prepareDashboardUserObject(req.session, function (err, user) {
                                    res.render('dashboard/default/cockpit', { url: "cockpit", added: added_posts_quantity, approved: approved_posts_quantity, rejected: rejected_posts_quantity, draft: draft_posts_quantity, user: user });
                                })
                            });
                        }
                        
                    });
                }
            });
        }
    })
});

router.get('/profile', utils.isEditorAuthenticated, (req, res) => {
    
    utils.prepareDashboardUserObject(req.session, function (err, user) {

        Users.findOne({ username: req.session.steemconnect.name}, function (err, user_details) {
            if( (! err) && user_details ) {
                res.render('dashboard/default/profile', { url: "profile", user: user, dbuser: user_details });
            } else {
                res.redirect("/");
            }
        })
    }) 
});

router.post('/profile', utils.isEditorAuthenticated, (req, res) => {

    let user_details = req.body;

    Users.findOne({ username: req.session.steemconnect.name }, function (err, user) {
        if ((!err) && user) {
            user.name = user_details.name;
            user.surname = user_details.surname;
            user.email = user_details.email;
            user.image = user_details.image;
            user.bio = user_details.bio;
            user.facebook_url = user_details.facebook_url;
            user.twitter_url = user_details.twitter_url;
            user.linkedin_url = user_details.linkedin_url;
            user.instagram_url = user_details.instagram_url;

            user.save(function (err) {
                if(err) {
                    console.log(err);
                    res.json({ error: "Wystąpił jakiś błąd" });
                } else {
                    authors.updateAuthorDetails(req.session.steemconnect.name);
                    res.json({ success: "Profil zaktualizowano" });
                }
            })
            
        } else {
            res.json({ error: "Wystąpił jakiś błąd"});
        }
    })


}); 

router.get('/accepted', utils.isEditorAuthenticated, (req, res) => {
    utils.prepareDashboardUserObject(req.session, function (err, user) {
        res.render('dashboard/default/accepted', { url: "accepted", user: user });
    })
});

router.get('/articles', utils.isEditorAuthenticated, (req, res) => {

    Articles.find({ user: req.session.steemconnect.name }).sort([['date', -1]]).exec(function (err, articles) {
        if(err) {
            console.log(err);
            res.redirect("/");
            // todo do something when error !
        } else {
            utils.prepareDashboardUserObject(req.session, function (err, user) {
                res.render('dashboard/default/articles', { url: "articles", articles: articles, user: user });
            })
            
        }
    })
});

router.get('/moderate', utils.isEditorAuthenticated, (req, res) => {

    Articles.find({ status: "added" }, function (err, articles) {
        if (err) {
            console.log(err);
            res.redirect("/");
            // todo do something when error !
        } else {
            utils.prepareDashboardUserObject(req.session, function (err, user) {
                res.render('dashboard/default/moderate', { url: "articles", articles: articles, user: user });
            })

        }
    })
});

router.get('/authors', utils.isEditorAuthenticated, (req, res) => {

    Users.find({ permissions: "requested" }, function (err, requested) {
        if (err) {
            console.log(err);
            res.redirect("/");
            // todo do something when error !
        } else {
            Users.find({ permissions: "editor" }, function (err, editors) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    utils.prepareDashboardUserObject(req.session, function (err, user) {
                        res.render('dashboard/default/authors', { url: "authors", editors: editors, requested: requested, user: user });
                    })
                }
            });
        }
    })
});

router.get('/moderate/:id', utils.isEditorAuthenticated, (req, res) => {

    Articles.findOne({ _id: req.params.id}, function (err, article) {
        if(article) {
            utils.prepareDashboardUserObject(req.session, function (err, user) {
                res.render('dashboard/default/moderate-single', { url: "moderate-single", article: article, user: user });
            });
        } else {
            res.redirect('/dashboard/moderate');
        }
    })
});

router.get('/edit/:id', utils.isEditorAuthenticated, (req, res) => {

    Articles.findOne({ _id: req.params.id }, function (err, article) {
        if (article) {
            utils.prepareDashboardUserObject(req.session, function (err, user) {
                res.render('dashboard/default/add', { url: "add", article: article, user: user });
            });
        } else {
            res.redirect('/dashboard/articles');
        }
    })
});

router.get('/edit', utils.isEditorAuthenticated, (req, res) => {
    res.redirect('/dashboard/articles');
});

router.post('/remove', utils.isEditorAuthenticated, (req, res) => {

    Articles.findOne({_id: req.body.id}, function (err, article) {

        if(err || !article) {
            res.json({ error: "Wystąpił błąd lub nie ma takiego arykułu" });
        } else {
            utils.prepareDashboardUserObject(req.session, function (err, user) {
                if (user.permissions == 'editor-in-chief' || article.user == req.session.steemconnect.name) {
                    Articles.remove({ _id: req.body.id }, function (err) {
                        if (err) {
                            console.log(err);
                            res.json({ error: "Wystąpił jakiś błąd" });
                        } else {
                            res.json({ success: "Wpis usunięto!" });
                        }
                    })
                } else {
                    res.json({ error: "Brak uprawnień kotku!" });
                }
            });
        }
    })
});

router.post('/reject', utils.isEditorAuthenticated, (req, res) => {

    Articles.findOne({_id: req.body.id}, function (err, article) {

        if(err || !article) {
            res.json({ error: "Wystąpił błąd lub nie ma takiego arykułu" });
        } else {

            utils.prepareDashboardUserObject(req.session, function (err, user) {
                if (user.permissions == 'editor-in-chief' || article.user == req.session.steemconnect.name) {
                    article.status = 'rejected';
                    article.save(function (err) {
                        if (err) {
                            res.json({ error: "Wystąpił jakiś błąd" });
                        } else {
                            res.json({ success: "Wpis odrzucono!" });
                        }
                    });
                } else {
                    res.json({ error: "Brak uprawnień kotku!" });                    
                } 
            });
        }
    })
});

router.get('/preview/:id', utils.isEditorAuthenticated, (req, res) => {
    Articles.findOne({ _id: req.params.id }, function (err, article) {
        if(article) {
            var post = utils.dashboardPreparePostPreview(article);
            post.author = authors.getAuthorDetails(article.user)
            post.featured = articles.getFeaturedPosts();
            res.render('main/' + config.theme + '/single', post);
        } else {
            res.redirect('/dashboard/articles');
        }
    });
});

router.post('/preview', utils.isEditorAuthenticated, (req, res) => {
    res.render('main/default/single', req.body.article);
});

function updateArticleInDatabase(article, user, state, cb) {
    if ( (article._id)) {
        Articles.findOne({ _id: article._id }, function (err, db_article) {
            if (db_article) {
                if (article.status) {
                    db_article.status = article.status;
                }
                db_article.title = article.title;
                db_article.body = article.body;
                db_article.image = article.image;
                db_article.category = article.category;
                db_article.tags = article.tags;
                db_article.source_title = article.source_title;
                db_article.source_link = article.source_link;

                db_article.save(function (err) {
                    if (cb) {
                        cb(err, db_article._id)
                    }
                })
            }
        })
    } else {
        let db_article = new Articles({
            status: "draft", // rejected, accepted
            user: user,
            date: Date(),
            title: article.title,
            body: article.body,
            image: article.image,
            category: article.category,
            tags: article.tags,
            source_title: article.source_title,
            source_link: article.source_link,
            wykop_link: ""
        });

        if (article.status) {
            db_article.status = article.status;
        }

        db_article.save(function (err) {
            if(cb) {
                console.log("Draft article added by " + db_article.user);
                cb(err,db_article._id)
            }
        })
    }
}

module.exports = router;