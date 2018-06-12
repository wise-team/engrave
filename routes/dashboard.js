let express = require('express');
let steemconnect = require('../modules/steemconnect');
let steem = require('steem');
let router = express.Router();
var getSlug = require('speakingurl');
let getUrls = require('get-urls');
const isImage = require('is-image');
var config = require('../config');
let nginx = require('../modules/nginx.js');
let nodeapps = require('../modules/nodeapps.js');
let utils = require('../modules/utils.js');

let Blogs = require('../database/blogs.js');

function isLoggedAndConfigured(req, res, next) {

    if (req.session.steemconnect) {
        Blogs.findOne({steem_username: req.session.steemconnect.name}, function (err, blogger) {
            if(blogger) {
                req.session.blogger = blogger;
                if(!blogger.tier) {
                    res.redirect('/configure');
                } else if(!blogger.configured) {
                    if(req.path == '/configure') {
                        return next();
                    } else {
                        res.redirect('/dashboard/configure');
                    }                    
                } else {
                    return next();
                }   
            } else {
                res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
}

router.get('/configure', isLoggedAndConfigured, (req, res) => {
    if(!req.session.blogger.configured) {
        res.render('dashboard/configure.pug', {blogger: req.session.blogger, url: 'configure'});
    } else {
        res.redirect('/dashboard');
    }
    
});

router.get('/', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/main.pug', {blogger: req.session.blogger, url: '/'});
});

router.get('/profile', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/profile.pug', {blogger: req.session.blogger, url: 'profile'}); 
});

router.get('/settings', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/settings.pug', {blogger: req.session.blogger, url: 'settings'}); 
});

router.get('/write', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/write.pug', {blogger: req.session.blogger, url: 'write'}); 
});

router.get('/edit/:permlink', isLoggedAndConfigured, (req, res) => {
    steem.api.getContent(req.session.steemconnect.name, req.params.permlink, function(err, steem_post){
        if(!err && steem_post) {
            let category = steem_post.category;
            for(var i=0; i<req.session.blogger.categories.length; i++) {
                if(req.session.blogger.categories[i].steem_tag == steem_post.category) {
                    category = req.session.blogger.categories[i].steem_tag;
                    break;
                }
            }

            let tags = '';
            let thumbnail = '';

            if(steem_post.hasOwnProperty('json_metadata') && steem_post.json_metadata != '') {
                let metadata = JSON.parse(steem_post.json_metadata);
                if(metadata && metadata.hasOwnProperty('tags')) {
                    metadata.tags.forEach((tag) =>{
                        if(tag != steem_post.category) {
                            tags += tag + ' ';
                        }
                    })
                }
                if(metadata && metadata.hasOwnProperty('image') && metadata.image.length) {
                    thumbnail = metadata.image[0];
                }
            }

            let post = {
                permlink: steem_post.permlink,
                title: steem_post.title,
                body: steem_post.body.replace(/(\n\*\*\*\n<center>\s###\sOryginally posted on \[)(.*)(\)\.\sSteem blog powered by \[)(.*)(\)\.\n\<\/center\>)/g, ""),
                category: category,
                image: thumbnail,
                tags: tags
            }

            res.render('dashboard/edit.pug', {blogger: req.session.blogger, url: 'edit', post: post}); 
        } else {
            res.redirect('/dashboard');
        }
    })
    
});

router.get('/notifications', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/notifications.pug', {blogger: req.session.blogger, url: 'notifications'}); 
});

router.get('/posts', isLoggedAndConfigured, (req, res) => {

    utils.getAllPosts(25, null, req.session.steemconnect.name, function(err, posts) {
        res.render('dashboard/posts.pug', {blogger: req.session.blogger, url: 'posts', drafts: [], posts: posts}); 
    });
    
});

router.get('/wallet', isLoggedAndConfigured, (req, res) => {
    steemconnect.me(function(err, user) {
        if(!err && user) {
            steem.api.getDynamicGlobalProperties((err, result) => {
                // var accountValue = steem.formatter.estimateAccountValue(req.session.steemconnect.name);
                var steemPower = steem.formatter.vestToSteem(user.account.vesting_shares, result.total_vesting_shares, result.total_vesting_fund_steem);
                res.render('dashboard/wallet.pug', {blogger: req.session.blogger, user: user, steemPower: steemPower, url: 'wallet'}); 
              });
        } else {
            res.redirect('/');
        }
    })
    
});

router.get('/upgrade', isLoggedAndConfigured, (req, res) => {
    res.render('dashboard/upgrade.pug', {blogger: req.session.blogger, url: 'upgrade'}); 
});

router.get('/claim', isLoggedAndConfigured, (req, res) => {
    steemconnect.me(function(err, user) { 
        steemconnect.claimRewardBalance(user.name, user.account.reward_steem_balance, user.account.reward_sbd_balance, user.account.reward_vesting_balance, function(err, result) {
            res.redirect('/dashboard/wallet');
        })
    });
});



/////// POST REQUESTS

router.post('/publish', (req, res) => {
    
    let article = req.body;

    if(article.body != '' && article.title != '') {

        article.permlink = getSlug(article.title);

        var urls = getUrls(article.body);
        var links = [];
        var image = [];
        var category = null;

        if(article.image && article.image != '') {
            image.push(article.image);
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

        for (var i=0; i < req.session.blogger.categories.length; i++) {
            if (req.session.blogger.categories[i].name === article.category) {
                category = req.session.blogger.categories[i];
                tags.push(req.session.blogger.categories[i].steem_tag); // obtain category steemconnect tags
                break;
            }
        }

        var tempTags = article.tags.split(" ");
        tempTags.forEach(tag => {
            if (tag != ' ' && tag != null && tag != '') {
                tags.push(tag.trim());
            }
        })

        article.body += '\n\n***\n<center>\n### Oryginally posted on [' + req.session.blogger.blog_title + '](http://' + req.session.blogger.domain + '/' + article.permlink + '). Steem blog powered by [ENGRAVE](https://engrave.website).\n</center>';

        const operations = [ 
            ['comment', 
              { 
                parent_author: "", 
                parent_permlink: tags[0], 
                author: req.session.steemconnect.name, 
                permlink: article.permlink, 
                title: article.title, 
                body: article.body, 
                json_metadata : JSON.stringify({ 
                  tags: tags, 
                  image: image,
                  links: links,
                  category: category,
                  app: `engrave/0.1`,
                  format: "markdown",
                  domain: req.session.blogger.domain
                }) 
              } 
            ], 
            ['comment_options', { 
              author: req.session.steemconnect.name, 
              permlink: article.permlink, 
              max_accepted_payout: '1000000.000 SBD', 
              percent_steem_dollars: 10000, 
              allow_votes: true, 
              allow_curation_rewards: true, 
              extensions: [ 
                [0, { 
                  beneficiaries: [ 
                    { account: 'nicniezgrublem', weight: 5 * 100 },
                    { account: 'engrave', weight: (parseInt(req.session.blogger.tier) - 5) * 100 }
                  ] 
                }] 
              ] 
            }] 
          ];
        
        steemconnect.setAccessToken(req.session.access_token);
        steemconnect.broadcast(operations, function (err, result) {
            if(err) {
                console.log(err);
                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                if(errorstring == 'Comment already has beneficiaries specified.') {
                    res.json({ error: 'Artykuł o podanym tytule już istnieje!'});
                } else {
                    res.json({ error: errorstring});
                }
                
            } else {
                console.log("New article has been posted by @" + req.session.steemconnect.name);
                res.json({ success: "Article published"});
            }
        });
    }

}); 

router.post('/edit', (req, res) => {
    
    let article = req.body;

    if(article.body != '' && article.title != '') {

        var urls = getUrls(article.body);
        var links = [];
        var image = [];
        var category = null;

        if(article.image && article.image != '') {
            image.push(article.image);
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

        for (var i=0; i < req.session.blogger.categories.length; i++) {
            if (req.session.blogger.categories[i].name === article.category) {
                category = req.session.blogger.categories[i];
                tags.push(req.session.blogger.categories[i].steem_tag);
                break;
            }
        }

        var tempTags = article.tags.split(" ");
        tempTags.forEach(tag => {
            if (tag != ' ' && tag != null && tag != '') {
                tags.push(tag.trim());
            }
        })

        article.body += '\n\n***\n<center>\n### Oryginally posted on [' + req.session.blogger.blog_title + '](http://' + req.session.blogger.domain + '/' + article.permlink + '). Steem blog powered by [ENGRAVE](https://engrave.website).\n</center>';

        const operations = [ 
            ['comment', 
              { 
                parent_author: "", 
                parent_permlink: article.parent_category, 
                author: req.session.steemconnect.name, 
                permlink: article.permlink, 
                title: article.title, 
                body: article.body, 
                json_metadata : JSON.stringify({ 
                  tags: tags, 
                  image: image,
                  links: links,
                  category: category,
                  app: `engrave/0.1`,
                  format: "markdown",
                  domain: req.session.blogger.domain
                }) 
              } 
            ], 
          ];
        
        steemconnect.setAccessToken(req.session.access_token);
        steemconnect.broadcast(operations, function (err, result) {
            if(err) {
                console.log(err);
                var errorstring =  '';
                if(err.error_description) {
                    errorstring = err.error_description.split(': ')[1];
                } else if (err.message) {
                    errorstring = err.message.split(': ')[1];
                }
                res.json({ error: errorstring});
            } else {
                console.log("Article has been updated by @" + req.session.steemconnect.name);
                res.json({ success: "Article updated"});
            }
        });
    }

}); 
router.post('/configure/finish', (req, res) => {
    
    let configuration = req.body;

    Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err, blog) {
        if(!err && blog) {
            if(!blog.configured) {
                blog.configured = true;
                blog.email = configuration.email;
                if(blog.tier == 10) {
                    blog.domain = req.session.steemconnect.name + '.' + config.domain;
                } else if (blog.tier == 12 || blog.tier == 15) {
                    blog.domain = configuration.domain;
                }

                blog.save(function(err) {
                    if(err) {
                        console.log(err);
                        res.json({ error: "Wystąpił błąd podczas konfiguracji"});
                    } else {
                        if(blog.tier == 10) {
                            nginx.generateSubdomainConfig(blog.domain, blog.port, function (err) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    nodeapps.createAndRun(blog.domain, blog.port, blog.steem_username);
                                }
                            });
                        } else if (blog.tier == 12 || blog.tier == 15) {
                            nginx.generateCustomDomainConfig(blog.domain, blog.port, function (err) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    nodeapps.createAndRun(blog.domain, blog.port, blog.steem_username);
                                }
                            });
                        }
                        
                        res.json({ success: "Konfiguracja zakończona!"});
                    }
                });
                
            } else {
                res.json({ error: "Już skonfigurowano! Nie oszukuj!"});
            }
        } else {
            res.json({ error: "Wystąpił błąd podczas konfiguracji"});
        }
    });

    console.log(configuration);
}); 

router.post('/settings', isLoggedAndConfigured, (req, res) => {
    
    let settings = req.body;

    let matches = [];

    for(var key in settings) {
        if(key.match(/(c_)([0-9]*)(_name)+/)) {
            matches.push({name: key, value: settings[key]});
        }
    }

    // const matches = settings.filter( ({name}) => name.match(/(c_)([0-9]*)(_name)+/) );

    var categories = [];
    matches.forEach(match => {
        let id = match.name.replace('c_', "").replace('_name',"");
        let slug_reg = new RegExp('(c_)(' + id + ')(_slug)', "i");
        let steem_tag_reg = new RegExp('(c_)(' + id + ')(_steem_tag)', "i");
        
        let slug = null;
        let steem_tag = null;

        for(var key in settings) {
            if(key.match(slug_reg)) {
                slug = settings[key];
            }
        }

        for(var key in settings) {
            if(key.match(steem_tag_reg)) {
                steem_tag = settings[key];
            }
        }

        categories.push({
            steem_tag: steem_tag,
            slug: slug,
            name: match.value
        })
    })

    if(!categories.length) {
        res.json({ error: "Add at least one category"});
    } else {
        settings.categories = categories;

        Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err, blog) {
            if(!err && blog) {
                copySettings(settings, blog);
                blog.save(function(err){
                    if(!err) {
                        req.session.blogger = blog;
                        res.json({ success: "Ustawienia zapisane poprawnie"});
                    } else {
                        res.json({ error: "Wystąpił jakiś błąd..."});
                    }
                })
            } else {
                res.json({ error: "Wystąpił jakiś błąd..."});
            }
        });    
    }
}); 

router.post('/profile', isLoggedAndConfigured, (req, res) => {
    
    let profile = req.body;

    console.log(profile);

    Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err, blog) {
        if(!err && blog) {
            blog.author_name = profile.author_name;
            blog.author_surname = profile.author_surname;
            blog.author_bio = profile.author_bio;
            blog.author_image_url = profile.author_image_url;
            // blog.email = profile.email
            blog.save(function(err){
                if(!err) {
                    req.session.blogger = blog;
                    res.json({ success: "Ustawienia zapisane poprawnie"});
                } else {
                    res.json({ error: "Wystąpił jakiś błąd..."});
                }
            })
        } else {
            res.json({ error: "Wystąpił jakiś błąd..."});
        }
    });    
}); 

function copySettings(new_settings, oldsettings) {
    oldsettings.blog_title = new_settings.blog_title
    oldsettings.blog_slogan = new_settings.blog_slogan;
    oldsettings.blog_logo_url = new_settings.blog_logo_url;
    oldsettings.theme = new_settings.theme;
    oldsettings.frontpage_language = new_settings.frontpage_language;
    oldsettings.posts_per_category_page = new_settings.posts_per_category_page;
    oldsettings.load_more_posts_quantity = new_settings.load_more_posts_quantity;
    // oldsettings.show_only_categorized_posts = new_settings.show_only_categorized_posts;
    oldsettings.opengraph_default_description = new_settings.opengraph_default_description;
    oldsettings.opengraph_default_image_url = new_settings.opengraph_default_image_url;
    oldsettings.onesignal_app_id = new_settings.onesignal_app_id;
    oldsettings.onesignal_api_key = new_settings.onesignal_api_key;
    oldsettings.onesignal_logo_url = new_settings.onesignal_logo_url;
    oldsettings.onesignal_body_length = new_settings.onesignal_body_length;
    oldsettings.analytics_gtag = new_settings.analytics_gtag;
    oldsettings.webmastertools_id = new_settings.webmastertools_id;

    if(new_settings.categories && new_settings.categories != '') {
        oldsettings.categories = new_settings.categories;
    }
}

module.exports = router;