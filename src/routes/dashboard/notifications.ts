import * as express from 'express';
import { IExtendedRequest } from '../IExtendedRequest';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/notifications', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/notifications.pug', { blogger: req.session.blogger, url: 'notifications' });
});

module.exports = router;