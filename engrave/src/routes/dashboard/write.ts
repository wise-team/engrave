import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../IExtendedRequest';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

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
    res.render('dashboard/write.pug', { blogger: req.session.blogger, url: 'write' });
});

module.exports = router;