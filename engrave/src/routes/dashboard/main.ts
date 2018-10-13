import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/main.pug', { blogger: req.session.blogger, url: '/' });
});

module.exports = router;