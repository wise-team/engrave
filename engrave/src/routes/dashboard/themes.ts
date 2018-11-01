import * as express from 'express';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get('/themes', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/themes.pug', { blogger: req.session.blogger, url: 'themes' });
});

module.exports = router;