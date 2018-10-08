import { PostValidators } from './../../validators/PostValidators';
import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { SteemConnect } from '../../modules/SteemConnect';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';

let router = express.Router();

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
                        SteemConnect.setAccessToken(req.session.access_token);
                        SteemConnect.broadcast(operations, function (err: any, result: any) {
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