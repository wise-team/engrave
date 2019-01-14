import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get('/', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/main.pug', { blogger: req.session.blogger, url: '/' });
});

module.exports = router;