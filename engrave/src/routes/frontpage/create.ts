import { IExtendedRequest } from "../IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/create', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.session.blogger) {
        res.render('main/create.pug', { blogger: req.session.blogger });
    } else if (!req.session.blogger.tier) {
        res.redirect('/configure');
    } else {
        res.redirect('/dashboard');
    }
});


module.exports = router;