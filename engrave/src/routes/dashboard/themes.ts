import * as express from 'express';
import { IExtendedRequest } from '../IExtendedRequest';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/themes', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/themes.pug', { blogger: req.session.blogger, url: 'themes' });
});

module.exports = router;