import { PostValidators } from './../validators/PostValidators';
import { ICategory } from './../database/helpers/ICategory';
import { IBlog } from './../database/helpers/IBlog';
import { Blogs } from './../database/BlogsModel';
import { Utils } from '../modules/Utils'
import { SSLModule } from '../modules/SSL'
import { IExtendedRequest } from './IExtendedRequest';
import { SteemConnect } from '../modules/SteemConnect';
import { NodeAppsModule } from '../modules/NodeApps';
import { NginxModule } from '../modules/Nginx';
import { Posts } from '../database/PostsModel';
import { IArticle } from "../database/helpers/IArticle";
import * as express from 'express';
import { Tier } from '../database/helpers/TierEnum';
import { GetValidators } from '../validators/GetValidators';

let steem = require('steem');
let router = express.Router();

router.get('/configure', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.blogger.configured) {
        res.render('dashboard/configure.pug', {blogger: req.session.blogger, url: 'configure'});
    } else {
        res.redirect('/dashboard');
    }
    
});

router.get('/', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/main.pug', {blogger: req.session.blogger, url: '/'});
});

router.get('/profile', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/profile.pug', {blogger: req.session.blogger, url: 'profile'}); 
});

router.get('/settings', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/settings.pug', {blogger: req.session.blogger, url: 'settings'}); 
});

router.get('/write/:id', GetValidators.isLoggedAndConfigured, async function (req: IExtendedRequest, res: express.Response) { 

    try {
        let draft = await Posts.findById(req.params.id);
        if (!draft || draft.steem_username != req.session.blogger.steem_username) throw new Error();
        draft.body = Utils.removeWebsiteAdvertsElements(draft.body);
        res.render('dashboard/write.pug', { blogger: req.session.blogger, draft: draft, url: 'write' });
    } catch (error) {
        res.redirect('/dashboard');
    }

});

router.get('/write', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/write.pug', {blogger: req.session.blogger, url: 'write'}); 
});

router.get('/edit/:permlink', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    steem.api.getContent(req.session.steemconnect.name, req.params.permlink, function(err: Error, steem_post: any){
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
                    metadata.tags.forEach((tag: string) =>{
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
                body: Utils.removeWebsiteAdvertsElements(steem_post.body),
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

router.get('/notifications', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/notifications.pug', {blogger: req.session.blogger, url: 'notifications'}); 
});

router.get('/posts', GetValidators.isLoggedAndConfigured, async function (req: IExtendedRequest, res: express.Response) {

    try {
        let posts = await Utils.GetPostsFromBlockchain(25, null, req.session.steemconnect.name);
        let drafts = await Posts.find({ steem_username: req.session.blogger.steem_username });
        res.render('dashboard/posts.pug', { blogger: req.session.blogger, url: 'posts', drafts: drafts, posts: posts });
    } catch (error) {
        res.redirect('/');   
    }

});

router.get('/wallet', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    SteemConnect.setAccessToken(req.session.access_token);
    SteemConnect.me(function(err: Error, user: any) {
        if(!err && user) {
            steem.api.getDynamicGlobalProperties((err: Error, result: any) => {
                // var accountValue = steem.formatter.estimateAccountValue(req.session.steemconnect.name);
                var steemPower = steem.formatter.vestToSteem(user.account.vesting_shares, result.total_vesting_shares, result.total_vesting_fund_steem);
                res.render('dashboard/wallet.pug', {blogger: req.session.blogger, user: user, steemPower: steemPower, url: 'wallet'}); 
              });
        } else {
            res.redirect('/');
        }
    })
    
});

router.get('/upgrade', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/upgrade.pug', {blogger: req.session.blogger, url: 'upgrade'}); 
});

router.post('/claim', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    SteemConnect.setAccessToken(req.session.access_token);
    SteemConnect.me(function(err: Error, user: any) { 
        if(err) {
            res.json({error: "Error while claiming rewards"})
        } else {
            SteemConnect.claimRewardBalance(user.name, user.account.reward_steem_balance, user.account.reward_sbd_balance, user.account.reward_vesting_balance, function(err: Error, result: any) {
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

router.post('/publish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    
    let post = Utils.prepareBloggerPost(req.body, req.session.blogger);

    if(post) {
        const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

        if(operations) {
            SteemConnect.setAccessToken(req.session.access_token);
            SteemConnect.broadcast(operations, function (err: any, result: any) {
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
                        Posts.deleteOne({_id: post._id}, function(err: Error) {
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

router.post('/edit', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let post = Utils.prepareBloggerPost(req.body, req.session.blogger);
    if(post) {
        const operations = Utils.PrepareOperations('edit', post, req.session.blogger);
        if(operations) {
            SteemConnect.setAccessToken(req.session.access_token);
            SteemConnect.broadcast(operations, function (err: any, result: any) {
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

router.post('/delete', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let article = req.body;
    if(article && article.permlink != '') {

        let operations = [ 
            ['delete_comment', {
            author: req.session.blogger.steem_username,
            permlink: article.permlink
        }]];

        SteemConnect.setAccessToken(req.session.access_token);
        SteemConnect.broadcast(operations, function (err: any, result: any) {
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
router.post('/draft', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        let post = Utils.prepareBloggerPost(req.body, req.session.blogger);
        if (post._id && post._id != '') {
            let draft = await Posts.findById(post._id);

            if (draft && (draft.steem_username == req.session.blogger.steem_username)) {
                draft.title = post.title;
                draft.body = post.body;
                draft.category = post.category;
                draft.tags = post.tags;
                draft.image = post.image;
                draft.links = post.links;
                draft.thumbnail = post.thumbnail;
                draft.steem_username = req.session.blogger.steem_username;
                await draft.save();
                res.json({ success: 'Draft updated', _id: draft._id });
            } else {
                throw new Error("Username missmatch");
            }
        } else {
            delete post["_id"];
            let draft = new Posts(post);
            draft.steem_username = req.session.blogger.steem_username;
            await draft.save();
            res.json({ success: 'Draft saved', _id: draft._id });
        }  
    } catch (error) {
        res.json({ error: 'Error while saving draft' });
    }


    
    
})

router.post('/draft/delete', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let draft = req.body;
    if(draft && draft.id != '') {
        Posts.deleteOne({_id: draft.id}, function(err: Error) {
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

router.post('/draft/publish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let draft = req.body;
    if(draft && draft.id != '') {
        Posts.findById({_id: draft.id}, function(err: Error, draft: any) {
            if(!err && draft) {
                draft.body = Utils.removeWebsiteAdvertsElements(draft.body);
                let post = Utils.prepareBloggerPost(draft, req.session.blogger);

                if(post) {
                    const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

                    if(operations) {
                        SteemConnect.setAccessToken(req.session.access_token);
                        SteemConnect.broadcast(operations, function (err: any, result: any) {
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
                                    Posts.deleteOne({_id: post._id}, function(err: Error) {
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

router.post('/configure/finish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    
    let configuration = req.body;

    let domain = configuration.domain;

    if(configuration.subdomain) {
        domain = configuration.subdomain + "." + configuration.domain;
    }

    Blogs.findOne({domain: domain}, function(err: Error, result: IBlog) {
        if(err || result) {
            res.json({error: "Blog with that domain already exist. Try another one"});
        } else {
            Blogs.findOne({ steem_username: req.session.steemconnect.name }, function (err: Error, blog: IBlog) {
                if(!err && blog) {
                    if(!blog.configured) {
                        blog.configured = true;
                        blog.email = configuration.email;
                        blog.theme = configuration.theme;
                        blog.category = configuration.category;
                        
                        if(blog.tier == Tier.BASIC) {
                            blog.domain = domain;
                            blog.is_domain_custom = false;
                            blog.ssl = true;
                        } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                            blog.domain = domain;
                            blog.is_domain_custom = true;
                        }
        
                        blog.save(function(err: Error) {
                            if(err) {
                                console.log(err);
                                res.json({ error: "Wystąpił błąd podczas konfiguracji"});
                            } else {
                                if(blog.tier == Tier.BASIC) {
                                    NginxModule.generateSubdomainConfig(blog.domain, blog.port, function (err: Error) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            NodeAppsModule.createAndRun(blog.domain, blog.port, blog.steem_username);
                                        }
                                    });
                                } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                                    NginxModule.generateCustomDomainConfig(blog.domain, blog.port, function (err: Error) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            NodeAppsModule.createAndRun(blog.domain, blog.port, blog.steem_username);
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

router.post('/settings', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    
    let settings = req.body;

    let matches = [];

    for(var key in settings) {
        if(key.match(/(c_)([0-9]*)(_name)+/)) {
            matches.push({name: key, value: settings[key]});
        }
    }

    var categories: ICategory[] = [];

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

        try {
            let blog = await Blogs.findOne({steem_username: req.session.steemconnect.name});
            Utils.CopySettings(settings, blog);
            await blog.save();
            req.session.blogger = blog;
            res.json({ success: "Ustawienia zapisane poprawnie" });

        } catch (error) {
                res.json({ error: "Wystąpił jakiś błąd..." });
        }   
    }
}); 

router.post('/ssl', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    console.log("Asked for SSl enable on: ", req.session.blogger.domain);
    SSLModule.generateCertificatesForDomain(req.session.blogger.domain, (err: Error) => {
        if(err) {
            res.json({error: "SSL could not be enabled. Try again or contact admin"});
        } else {
            NginxModule.generateCustomDomainConfigWithSSL(req.session.blogger.domain, req.session.blogger.port, function(err: Error) {
                if(err) {
                    res.json({error: "SSL could not be enabled. Try again or contact admin"});
                } else {
                    Blogs.findOne({steem_username: req.session.steemconnect.name}, function(err: Error, blog: any) {
                        if(!err && blog) {
                            blog.ssl = true;
                            blog.save(function(err: Error) {
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

router.post('/profile', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        let profile = req.body;
        let blog: IBlog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
        
        blog.author_name = profile.author_name;
        blog.author_surname = profile.author_surname;
        blog.author_bio = profile.author_bio;
        blog.author_image_url = profile.author_image_url;
        
        await blog.save();

        req.session.blogger = blog;
        res.json({ success: "Ustawienia zapisane poprawnie" });
    } catch (error) {
        res.json({ error: "Wystąpił jakiś błąd..." });
    }

}); 


module.exports = router;