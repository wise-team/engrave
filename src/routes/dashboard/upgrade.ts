import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';


let steem = require('steem');
let router = express.Router();

router.get('/upgrade', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/upgrade.pug', { blogger: req.session.blogger, url: 'upgrade' });
});

module.exports = router;