import { PostValidators } from './../../validators/PostValidators';
import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { SteemConnect } from '../../modules/SteemConnect';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';

let router = express.Router();

router.post('/publish', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    let post = Utils.prepareBloggerPost(req.body, req.session.blogger);

    if (post) {
        const operations = Utils.PrepareOperations('publish', post, req.session.blogger);

        if (operations) {
            SteemConnect.setAccessToken(req.session.access_token);
            SteemConnect.broadcast(operations, function (err: any, result: any) {
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

module.exports = router;