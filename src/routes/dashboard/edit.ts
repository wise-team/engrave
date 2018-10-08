import { PostValidators } from './../../validators/PostValidators';
import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { SteemConnect } from '../../modules/SteemConnect';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';


let steem = require('steem');
let router = express.Router();

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
            SteemConnect.setAccessToken(req.session.access_token);
            SteemConnect.broadcast(operations, function (err: any, result: any) {
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
                console.log("Post deleted");
                res.json({ success: "Post deleted" });
            }
        });

    } else {
        res.json({ error: 'Error while deleting article' });
    }
})

module.exports = router;