import * as express from 'express';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.get('/notifications', RoutesVlidators.isLoggedAndConfigured, renderNotificationsPage);

function renderNotificationsPage(res: express.Response, req: IExtendedRequest) {
    res.render('dashboard/notifications.pug', { blogger: req.session.blogger, url: 'notifications' });
}

module.exports = router;