import * as express from 'express';
import { IExtendedRequest } from '../IExtendedRequest';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/market', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/market.pug', { blogger: req.session.blogger, url: 'market' });
});

module.exports = router;