import { IExtendedRequest } from "../../helpers/IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/about', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/about.pug', { blogger: req.session.blogger });
});

module.exports = router;