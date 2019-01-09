import { RoutesVlidators } from '../../validators/RoutesValidators';
import { Blogs } from './../../database/BlogsModel';
import { Tier } from '../../helpers/TierEnum';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { Utils } from '../../modules/Utils';

let router = express.Router();

router.get('/tier/basic', RoutesVlidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    try {
        await Utils.setBloggerTier(req.session.steemconnect.name, Tier.BASIC);
        res.redirect('/dashboard');
    } catch (err) {
        res.redirect('/');
    }

});

router.get('/tier/standard', RoutesVlidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    try {
        await Utils.setBloggerTier(req.session.steemconnect.name, Tier.STANDARD);
        res.redirect('/dashboard');
    } catch (err) {
        res.redirect('/');
    }

});

router.get('/tier/extended', RoutesVlidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {
   
    try {
        await Utils.setBloggerTier(req.session.steemconnect.name, Tier.EXTENDED);
        res.redirect('/dashboard');
    } catch (err) {
        res.redirect('/');
    }

});

router.get('/tier/cancel', RoutesVlidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    try {
        await Utils.cancelBloggerTier(req.session.steemconnect.name);
        res.redirect('/dashboard');
    } catch (error) {
        res.redirect('/');
    }

});

module.exports = router;