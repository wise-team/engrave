import * as express from 'express';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get("/market", RoutesVlidators.isLoggedAndConfigured, renderMarketPage);

function renderMarketPage(req: IExtendedRequest, res: express.Response) {
    res.render('dashboard/market.pug', { blogger: req.session.blogger, url: 'market' });
}

module.exports = router;