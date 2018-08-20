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
let ssl = require('../modules/ssl.js');

let Blogs = require('../database/blogs.js');
let Posts = require('../database/posts.js');

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

router.get('/write/:id', isLoggedAndConfigured, (req, res) => {
    Posts.findById(req.params.id, function(err, draft) {
        if(!err && draft && (draft.steem_username == req.session.blogger.steem_username)) {
            draft.body = utils.removeWebsiteAdvertsElements(draft.body);
            res.render('dashboard/write.pug', {blogger: req.session.blogger, draft: draft, url: 'write'}); 
        } else {
            res.redirect('/dashboard');
        }
    });
    
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
                body: utils.removeWebsiteAdvertsElements(steem_post.body),
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
        Posts.find({steem_username: req.session.blogger.steem_username}, function(err, drafts) {
            res.render('dashboard/posts.pug', {blogger: req.session.blogger, url: 'posts', drafts: drafts, posts: posts}); 
        })
    });
    
});

router.get('/wallet', isLoggedAndConfigured, (req, res) => {
    steemconnect.setAccessToken(req.session.access_token);
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

router.post('/claim', isLoggedAndConfigured, (req, res) => {
    steemconnect.setAccessToken(req.session.access_token);
    steemconnect.me(function(err, user) { 
        if(err) {
            res.json({error: "Error while claiming rewards"})
        } else {
            steemconnect.claimRewardBalance(user.name, user.account.reward_steem_balance, user.account.reward_sbd_balance, user.account.reward_vesting_balance, function(err, result) {
                if(err) {
                    res.json({error: "Error while claiming rewards"})
                } else {
                    res.json({success: "All rewards claimed"})
                }
            });
        }
    });
});

/////// POST REQUESTS

router.post('/publish', isLoggedAndConfigured, (req, res) => {
    
    let post = utils.prepareBloggerPost(req.body, req.session.blogger);

    if(post) {
        const operations = utils.prepareOperations('publish', post, req.session.blogger);

        if(operations) {
            steemconnect.setAccessToken(req.session.access_token);
            steemconnect.broadcast(operations, function (err, result) {
                if(err) {
                    console.log(err);
                    var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                    if(errorstring == 'Comment already has beneficiaries specified.') {
                        res.json({ error: 'There is an article with that title!'});
                    } else {
                        res.json({ error: errorstring});
                    }
                    
                } else {
                    console.log("New article has been posted by @" + req.session.steemconnect.name);
                    if(post._id && post._id != '') {
                        Posts.deleteOne({_id: post._id}, function(err) {
                            if(err) {
                                console.log(err);
                            }
                        });
                        res.json({ success: "Article published", draft: true});
                    } else {
                        res.json({ success: "Article published"});
                    }
                    
                }
            });
        }
    } else {
        res.json({ error: "Article parsing error"});
    }
}); 

router.post('/edit', isLoggedAndConfigured, (req, res) => {
    let post = utils.prepareBloggerPost(req.body, req.session.blogger);
    if(post) {
        const operations = utils.prepareOperations('edit', post, req.session.blogger);
        if(operations) {
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
    } else {
        res.json({ error: "Article parsing error"});
    }
}); 

router.post('/delete', isLoggedAndConfigured, (req,res) => {
    let article = req.body;
    if(article && article.permlink != '') {

        let operations = [ 
            ['delete_comment', {
            author: req.session.blogger.steem_username,
            permlink: article.permlink
        }]];

        steemconnect.setAccessToken(req.session.access_token);
        steemconnect.broadcast(operations, function (err, result) {
            if(err) {
                console.log(err);
                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                if(errorstring == 'Comment already has beneficiaries specified.') {
                    res.json({ error: 'There is an article with that title!'});
                } else {
                    res.json({ error: errorstring});
                }
            } else {
                console.log("Post deleted");
                    res.json({ success: "Post deleted"});
                }
        });

    } else {
        res.json({error: 'Error while deleting article'});
    }
})
router.post('/draft', isLoggedAndConfigured, (req,res) => {
    let post = utils.prepareBloggerPost(req.body, req.session.blogger);
    if(post._id && post._id != '') {
        Posts.findById(post._id, function(err, draft) {
            if(!err && draft && (draft.steem_username == req.session.blogger.steem_username)) {
                draft.title = post.title;
                draft.body = post.body;
                draft.category = post.category;
                draft.tags = post.tags;
                draft.image = post.image;
                draft.links = post.links;
                draft.thumbnail = post.thumbnail;
                draft.steem_username = req.session.blogger.steem_username;
                draft.save(function(err){
                    if(err) {
                        res.json({error: 'Error while saving draft'});
                    } else {
                        res.json({success: 'Draft updated', _id: draft._id});
                    }
                });
            } else {
                res.json({error: 'Error while saving draft'});
            }
        });
    } else {
        delete post["_id"];
        let draft = new Posts(post);
        draft.steem_username = req.session.blogger.steem_username;
        draft.save(function(err){
            if(err) {
                res.json({error: 'Error while saving draft'});
            } else {
                res.json({success: 'Draft saved', _id: draft._id});
            }
        });
    }
})

router.post('/draft/delete', isLoggedAndConfigured, (req,res) => {
    let draft = req.body;
    if(draft && draft.id != '') {
        Posts.deleteOne({_id: draft.id}, function(err) {
            if(err) {
                res.json({error: 'Error while deleting draft'});  
            } else {
                res.json({success: 'Draft deleted'});  
            }
        });
    } else {
        res.json({error: 'Error while deleting draft'});
    }
})

router.post('/draft/publish', isLoggedAndConfigured, (req,res) => {
    let draft = req.body;
    if(draft && draft.id != '') {
        Posts.findById({_id: draft.id}, function(err, draft) {
            if(!err && draft) {
                draft.body = utils.removeWebsiteAdvertsElements(draft.body);
                let post = utils.prepareBloggerPost(draft, req.session.blogger);

                if(post) {
                    const operations = utils.prepareOperations('publish', post, req.session.blogger);

                    if(operations) {
                        steemconnect.setAccessToken(req.session.access_token);
                        steemconnect.broadcast(operations, function (err, result) {
                            if(err) {
                                console.log(err);
                                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                                if(errorstring == 'Comment already has beneficiaries specified.') {
                                    res.json({ error: 'There is an article with that title!'});
                                } else {
                                    res.json({ error: errorstring});
                                }
                                
                            } else {
                                console.log("New article has been posted by @" + req.session.steemconnect.name);
                                if(post._id && post._id != '') {
                                    Posts.deleteOne({_id: post._id}, function(err) {
                                        if(err) {
                                            console.log(err);
                                        }
                                    });
                                    res.json({ success: "Article published", draft: true});
                                } else {
                                    res.json({ success: "Article published"});
                                }
                            }
                        });
                    }
                } else {
                    res.json({ error: "Article parsing error"});
                }
            } else {
                res.json({success: 'Draft deleted'});  
            }
        });
    } else {
        res.json({error: 'Error while deleting draft'});
    }
})

router.post('/configure/finish', (req, res) => {
    
    let configuration = req.body;

    let domain = configuration.domain;

    if(configuration.subdomain) {
        domain = configuration.subdomain + "." + configuration.domain;
    }

    Blogs.findOne({domain: domain}, function(err, result) {
        if(err || result) {
            res.json({error: "Blog with that domain already exist. Try another one"});
        } else {
            Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err, blog) {
                if(!err && blog) {
                    if(!blog.configured) {
                        blog.configured = true;
                        blog.email = configuration.email;
                        blog.theme = configuration.theme;
                        blog.category = configuration.category;
                        
                        if(blog.tier == 10) {
                            blog.domain = domain;
                            blog.is_domain_custom = false;
                            blog.ssl = true;
                        } else if (blog.tier == 12 || blog.tier == 15) {
                            blog.domain = domain;
                            blog.is_domain_custom = true;
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
        }
    })
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

router.post('/ssl', isLoggedAndConfigured, (req, res) => {

    console.log("Asked for SSl enable on: ", req.session.blogger.domain);
    ssl.generateCertificatesForDomain(req.session.blogger.domain, (err) => {
        if(err) {
            res.json({error: "SSL could not be enabled. Try again or contact admin"});
        } else {
            nginx.generateCustomDomainConfigWithSSL(req.session.blogger.domain, req.session.blogger.port, function(err) {
                if(err) {
                    res.json({error: "SSL could not be enabled. Try again or contact admin"});
                } else {
                    Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err, blog) {
                        if(!err && blog) {
                            blog.ssl = true;
                            blog.save(function(err) {
                                if(!err) {
                                    res.json({success: "SSL enabled!"});
                                } else {
                                    res.json({error: "SSL could not be enabled. Try again or contact admin"});
                                }
                            });
                        } else {
                            res.json({error: "SSL could not be enabled. Try again or contact admin"});
                        }
                    });
                }
            })
        }
    });
})

router.post('/profile', isLoggedAndConfigured, (req, res) => {
    
    let profile = req.body;

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
    oldsettings.blog_main_image = new_settings.blog_main_image;

    if(new_settings.categories && new_settings.categories != '') {
        oldsettings.categories = new_settings.categories;
    }
}

module.exports = router;