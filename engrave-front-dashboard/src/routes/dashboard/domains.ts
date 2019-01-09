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
        const domain = req.body.domain.toLowerCase();

        Domains.validateCustomDomain(domain);

        let available = await Domains.isDomainAvailable(domain);

        if (available) {
            res.json({ domain: domain, status: "free", price: await Domains.getDomainPrice(domain) })
        } else {
            res.json({ domain: domain, status: "taken" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

router.post('/choose', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {

    try {
        const domain = req.body.domain.toLowerCase();;
        const currency = req.body.currency;

        Domains.validateCustomDomain(domain);
        if( ! await Domains.isDomainAvailable(domain)) throw new Error("Domain is not available");

        await Blogs.findOneAndUpdate({ steem_username: req.session.steemconnect.name }, { $set: { domain: domain } });

        console.log(`User @${req.session.steemconnect.name} chose domain ${domain}`);

        res.json({ url: Utils.generatePaymentLink(currency) });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

module.exports = router;