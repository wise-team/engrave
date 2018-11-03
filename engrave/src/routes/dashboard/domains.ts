import { Domains } from './../../modules/Domains';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { Utils } from '../../modules/Utils';

const router = express.Router();

router.get('/', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {
    console.log(req);
    res.redirect('/');
});

router.post('/check', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {

    try {
        const domain = req.body.domain;

        Utils.validateCustomDomain(domain);

        let available = await Domains.isDomainAvailble(domain);

        if (available) {
            res.json({ status: "free" })
        } else {
            res.json({ status: "taken" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.post('/choose', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {

    try {
        const domain = req.body.domain;
        const currency = req.body.currency;

        Utils.validateCustomDomain(domain);

        await Blogs.findOneAndUpdate({ steem_username: req.session.steemconnect.name }, { $set: { domain: domain } });

        res.json({ url: Utils.generatePaymentLink(currency) });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

module.exports = router;