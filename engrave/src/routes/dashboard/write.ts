import { Utils } from '../../modules/Utils'
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { Posts } from '../../database/PostsModel';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get('/write/:id', RoutesVlidators.isLoggedAndConfigured, async function (req: IExtendedRequest, res: express.Response) {

    try {
        let draft = await Posts.findById(req.params.id);
        if (!draft || draft.steem_username != req.session.blogger.steem_username) throw new Error();
        draft.body = Utils.removeWebsiteAdvertsElements(draft.body);
        res.render('dashboard/write.pug', { blogger: req.session.blogger, draft: draft, url: 'write' });
    } catch (error) {
        res.redirect('/dashboard');
    }

});

router.get('/write', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/write.pug', { blogger: req.session.blogger, url: 'write' });
});

module.exports = router;