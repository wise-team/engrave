import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import { DashboardSteemConnect } from '../../modules/SteemConnect';
import { Onesignal } from '../../modules/Onesignal';
import { PublishedArticlesModule } from '../../modules/PublishedArticles';
import { removeArticle, getBlog, setArticle } from '../../submodules/engrave-shared/services/cache/cache';
import sitemap from '../../services/sitemap/sitemap.service';
import { getSteemArticle } from '../../submodules/engrave-shared/services/steem/steem';

let steem = require('steem');
let router = express.Router();

const Redis = require('ioredis');
const redis = new Redis({ host: "redis" });

router.get('/posts', RoutesVlidators.isLoggedAndConfigured, async function (req: IExtendedRequest, res: express.Response) {

    try {
        let posts = await Utils.GetPostsFromBlockchain(10, null, req.session.steemconnect.name);
        let drafts = await Posts.find({ steem_username: req.session.blogger.steem_username });
        res.render('dashboard/posts.pug', { blogger: req.session.blogger, url: 'posts', drafts: drafts, posts: posts });
    } catch (error) {
        res.redirect('/');
    }

});

router.post('/posts', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        let start_permlink = req.body.start_permlink;
        let posts = await Utils.GetPostsFromBlockchain(10, start_permlink, req.session.steemconnect.name);
        res.json({ success: "OK", posts: posts, domain: req.session.blogger.domain});
    } catch (error) {
        res.json({ error: "Error while trying to get blockchain posts" })
    }
})


router.get('/edit/:permlink', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    steem.api.getContent(req.session.steemconnect.name, req.params.permlink, function (err: Error, steem_post: any) {
        if (!err && steem_post) {
            let category = steem_post.category;
            for (var i = 0; i < req.session.blogger.categories.length; i++) {
                if (req.session.blogger.categories[i].steem_tag == steem_post.category) {
                    category = req.session.blogger.categories[i].steem_tag;
                    break;
                }
            }

            let tags = '';
            let thumbnail = '';

            if (steem_post.hasOwnProperty('json_metadata') && steem_post.json_metadata != '') {
                let metadata = JSON.parse(steem_post.json_metadata);
                if (metadata && metadata.hasOwnProperty('tags')) {
                    metadata.tags.forEach((tag: string) => {
                        if (tag != steem_post.category) {
                            tags += tag + ' ';
                        }
                    })
                }
                if (metadata && metadata.hasOwnProperty('image') && metadata.image.length) {
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

            res.render('dashboard/edit.pug', { blogger: req.session.blogger, url: 'edit', post: post });
        } else {
            res.redirect('/dashboard');
        }
    })

});

router.post('/edit', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        const post = Utils.prepareBloggerPost(req.body, req.session.blogger);
        const operations = Utils.PrepareOperations('edit', post, req.session.blogger);

        DashboardSteemConnect.setAccessToken(req.session.access_token);
        DashboardSteemConnect.broadcast(operations, async function (err: any, result: any) {
            if (err) {
                console.log(err);
                var errorstring = '';
                if (err.error_description) {
                    errorstring = err.error_description.split(': ')[1];
                } else if (err.message) {
                    errorstring = err.message.split(': ')[1];
                }
                res.json({ error: errorstring });
            } else {
                console.log("Article has been updated by @" + req.session.steemconnect.name);
                await redis.set(`engrave:${req.session.steemconnect.name}:${post.permlink}`, "");
                res.json({ success: "Article updated" });
            }
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post('/delete', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    let article = req.body;
    if (article && article.permlink != '') {

        let operations = [
            ['delete_comment', {
                author: req.session.blogger.steem_username,
                permlink: article.permlink
            }]];

        DashboardSteemConnect.setAccessToken(req.session.access_token);
        DashboardSteemConnect.broadcast(operations, async function (err: any, result: any) {
            if (err) {
                console.log(err);
                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                if (errorstring == 'Comment already has beneficiaries specified.') {
                    res.json({ error: 'There is an article with that title!' });
                } else if (errorstring != '') {
                    res.json({ error: errorstring });
                } else {
                    res.json({ error: 'Error occured. Try again' });
                }
            } else {
                console.log("Post deleted");

                try {
                    await removeArticle(req.session.blogger.steem_username, article.permlink);
                    
                    const blog = await getBlog(req.session.blogger.domain);
                    await sitemap.rebuildSitemap(blog);

                } catch (error) {
                    console.log(error);
                }

                res.json({ success: "Post deleted" });
            }
        });

    } else {
        res.json({ error: 'Error while deleting article' });
    }
})

router.post('/publish', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        const post = Utils.prepareBloggerPost(req.body, req.session.blogger);
        const operations = Utils.PrepareOperations('publish', post, req.session.blogger);
        
        DashboardSteemConnect.setAccessToken(req.session.access_token);
        await DashboardSteemConnect.broadcast(operations);

        console.log("New article has been posted by @" + req.session.steemconnect.name);

        await PublishedArticlesModule.create(req.session.blogger, post);
        
        Onesignal.sendNotification(req.session.blogger, post.title, post.image, post.permlink);

        await redis.set(`engrave:${req.session.steemconnect.name}:${post.permlink}`, "");
        
        const steemArticle = await getSteemArticle(req.session.steemconnect.name, post.permlink);
        await setArticle(req.session.blogger.domain, req.session.steemconnect.name, post.permlink, steemArticle);
        
        const blog = await getBlog(req.session.blogger.domain);
        await sitemap.rebuildSitemap(blog);

        if (post._id && post._id != '') {
            await Posts.deleteOne({ _id: post._id });
            res.json({ success: "Article published", draft: true });
        } else {
            res.json({ success: "Article published" });
        }

    } catch (error) {
        console.log(error);
        if (error.hasOwnProperty('error_description')) {
            let errorstring = error.error_description.split('\n')[0].split(': ')[1];
            
            
            if (errorstring == 'Comment already has beneficiaries specified.') {
                res.json({ error: 'There is an article with that title!' });
            } else if(errorstring == 'The permlink of a comment cannot change.') {
                res.json({ error: "You have an article with that title. Try another one." });
            } else if(errorstring != '') {
                res.json({ error: errorstring });
            } else {
                res.json({ error: 'Error occured. Try again' });
            }
        } else {
            res.json({ error: error.message });
        }
    }
});


router.post('/draft', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

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
        res.json({ error: error.message });
    }

})

router.post('/draft/delete', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let draft = req.body;
    if (draft && draft.id != '') {
        Posts.deleteOne({ _id: draft.id }, function (err: Error) {
            if (err) {
                res.json({ error: 'Error while deleting draft' });
            } else {
                res.json({ success: 'Draft deleted' });
            }
        });
    } else {
        res.json({ error: 'Error while deleting draft' });
    }
})

router.post('/draft/publish', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        const { id } = req.body;

        if(!id) throw new Error('No such draft');

        let draft = await Posts.findById({ _id: id });

        draft.body = Utils.removeWebsiteAdvertsElements(draft.body);

        let post = Utils.prepareBloggerPost(draft, req.session.blogger);
        const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

        DashboardSteemConnect.setAccessToken(req.session.access_token);
        await DashboardSteemConnect.broadcast(operations);
            
        console.log("New article has been posted by @" + req.session.steemconnect.name);

        await PublishedArticlesModule.create(req.session.blogger, post);

        await redis.set(`engrave:${req.session.steemconnect.name}:${post.permlink}`, "");

        Onesignal.sendNotification(req.session.blogger, post.title, post.image, post.permlink);

        const steemArticle = await getSteemArticle(req.session.steemconnect.name, post.permlink);
        await setArticle(req.session.blogger.domain, req.session.steemconnect.name, post.permlink, steemArticle);
        
        const blog = await getBlog(req.session.blogger.domain);
        await sitemap.rebuildSitemap(blog);

        if (post._id && post._id != '') {
            await Posts.deleteOne({ _id: post._id });
            res.json({ success: "Article published", draft: true });
        } else {
            res.json({ success: "Article published" });
        }
        
    } catch (error) {
        console.log(error);
        if (error.hasOwnProperty('error_description')) {
            let errorstring = error.error_description.split('\n')[0].split(': ')[1];
            if (errorstring == 'Comment already has beneficiaries specified.') {
                res.json({ error: 'There is an article with that title!' });
            } else if(errorstring == 'The permlink of a comment cannot change.') {
                res.json({ error: "You have an article with that title. Try another one." });
            } else if(errorstring != '') {
                res.json({ error: errorstring });
            } else {
                res.json({ error: 'Error occured. Try again' });
            }
        } else {
            res.json({ error: error.message });
        }
    }
})

module.exports = router;