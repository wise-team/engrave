import { IExtendedRequest } from "../IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/configure', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if (req.session.blogger && !req.session.blogger.tier) {
        res.render('main/configure.pug', { blogger: req.session.blogger });
    } else {
        res.redirect('/');
    }

});

module.exports = router;