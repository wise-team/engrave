import { PostValidators } from './../../validators/PostValidators';
import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';
import { DashboardSteemConnect } from '../../modules/SteemConnect';

let steem = require('steem');
let router = express.Router();

router.get('/posts', GetValidators.isLoggedAndConfigured, async function (req: IExtendedRequest, res: express.Response) {

    try {
        let posts = await Utils.GetPostsFromBlockchain(10, null, req.session.steemconnect.name);
        let drafts = await Posts.find({ steem_username: req.session.blogger.steem_username });
        res.render('dashboard/posts.pug', { blogger: req.session.blogger, url: 'posts', drafts: drafts, posts: posts });
    } catch (error) {
        res.redirect('/');
    }

});

router.post('/posts', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        let start_permlink = req.body.start_permlink;
        let posts = await Utils.GetPostsFromBlockchain(10, start_permlink, req.session.steemconnect.name);
        res.json({ success: "OK", posts: posts });
    } catch (error) {
        res.json({ error: "Error while trying to get blockchain posts" })
    }
})


router.get('/edit/:permlink', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
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

router.post('/edit', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let post = Utils.prepareBloggerPost(req.body, req.session.blogger);
    if (post) {
        const operations = Utils.PrepareOperations('edit', post, req.session.blogger);
        if (operations) {
            DashboardSteemConnect.setAccessToken(req.session.access_token);
            DashboardSteemConnect.broadcast(operations, function (err: any, result: any) {
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
                    res.json({ success: "Article updated" });
                }
            });
        }
    } else {
        res.json({ error: "Article parsing error" });
    }
});

router.post('/delete', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let article = req.body;
    if (article && article.permlink != '') {

        let operations = [
            ['delete_comment', {
                author: req.session.blogger.steem_username,
                permlink: article.permlink
            }]];

        DashboardSteemConnect.setAccessToken(req.session.access_token);
        DashboardSteemConnect.broadcast(operations, function (err: any, result: any) {
            if (err) {
                console.log(err);
                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                if (errorstring == 'Comment already has beneficiaries specified.') {
                    res.json({ error: 'There is an article with that title!' });
                } else {
                    res.json({ error: errorstring });
                }
            } else {
                console.log("Post deleted");
                res.json({ success: "Post deleted" });
            }
        });

    } else {
        res.json({ error: 'Error while deleting article' });
    }
})

router.post('/publish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    let post = Utils.prepareBloggerPost(req.body, req.session.blogger);

    if (post) {
        const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

        if (operations) {
            DashboardSteemConnect.setAccessToken(req.session.access_token);
            DashboardSteemConnect.broadcast(operations, function (err: any, result: any) {
                if (err) {
                    console.log(err);
                    if (err.hasOwnProperty('error_description')) {
                        let errorstring = err.error_description.split('\n')[0].split(': ')[1];
                        if (errorstring == 'Comment already has beneficiaries specified.') {
                            res.json({ error: 'There is an article with that title!' });
                        } else {
                            res.json({ error: errorstring });
                        }
                    } else {
                        res.json({ error: 'Error occured. Try again' });
                    }

                } else {
                    console.log("New article has been posted by @" + req.session.steemconnect.name);
                    if (post._id && post._id != '') {
                        Posts.deleteOne({ _id: post._id }, function (err: Error) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        res.json({ success: "Article published", draft: true });
                    } else {
                        res.json({ success: "Article published" });
                    }

                }
            });
        }
    } else {
        res.json({ error: "Article parsing error" });
    }
});


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

router.post('/draft/publish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    let draft = req.body;
    if (draft && draft.id != '') {
        Posts.findById({ _id: draft.id }, function (err: Error, draft: any) {
            if (!err && draft) {
                draft.body = Utils.removeWebsiteAdvertsElements(draft.body);
                let post = Utils.prepareBloggerPost(draft, req.session.blogger);

                if (post) {
                    const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

                    if (operations) {
                        DashboardSteemConnect.setAccessToken(req.session.access_token);
                        DashboardSteemConnect.broadcast(operations, function (err: any, result: any) {
                            if (err) {
                                console.log(err);
                                var errorstring = err.error_description.split('\n')[0].split(': ')[1];
                                if (errorstring == 'Comment already has beneficiaries specified.') {
                                    res.json({ error: 'There is an article with that title!' });
                                } else {
                                    res.json({ error: errorstring });
                                }

                            } else {
                                console.log("New article has been posted by @" + req.session.steemconnect.name);
                                if (post._id && post._id != '') {
                                    Posts.deleteOne({ _id: post._id }, function (err: Error) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                    res.json({ success: "Article published", draft: true });
                                } else {
                                    res.json({ success: "Article published" });
                                }
                            }
                        });
                    }
                } else {
                    res.json({ error: "Article parsing error" });
                }
            } else {
                res.json({ success: 'Draft deleted' });
            }
        });
    } else {
        res.json({ error: 'Error while deleting draft' });
    }
})

module.exports = router;