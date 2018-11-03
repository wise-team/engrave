import { IExtendedRequest } from "../../helpers/IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/tiers', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if (req.session.blogger && !req.session.blogger.tier) {
        res.render('main/tiers.pug', { blogger: req.session.blogger });
    } else {
        res.redirect('/');
    }

});

module.exports = router;