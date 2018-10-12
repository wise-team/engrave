import { GetValidators } from './../../validators/GetValidators';
import { Blogs } from './../../database/BlogsModel';
import { Tier } from '../../database/helpers/TierEnum';
import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';
import { Utils } from '../../modules/Utils';

let router = express.Router();

router.get('/tier/basic', GetValidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.BASIC);
            res.redirect('/dashboard');
        } catch (err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/standard', GetValidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.steemconnect) {
        res.redirect('/');
    } else {

        try {
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.STANDARD);
            res.redirect('/dashboard');
        } catch (err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/extended', GetValidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.EXTENDED);
            res.redirect('/dashboard');

        } catch (err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/cancel', GetValidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {
            let blogger = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (blogger && !blogger.configured) {
                blogger.tier = null;
                await blogger.save();
                res.redirect('/dashboard');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            res.redirect('/');
        }
    }

});

module.exports = router;