import { PostValidators } from './../../validators/PostValidators';
import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';

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

module.exports = router;