import { IExtendedRequest } from "../IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/main.pug', { blogger: req.session.blogger });
});

router.get('*', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.redirect('/');
})

module.exports = router;