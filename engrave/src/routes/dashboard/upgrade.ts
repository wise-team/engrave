import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get('/upgrade', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/upgrade.pug', { blogger: req.session.blogger, url: 'upgrade' });
});

module.exports = router;