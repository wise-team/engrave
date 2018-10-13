import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';

let router = express.Router();

router.get('/logout', (req: IExtendedRequest, res: express.Response) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});

module.exports = router;