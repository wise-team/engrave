import { IExtendedRequest } from "../IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/how-to-earn', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/how-to-earn.pug', { blogger: req.session.blogger });
});

module.exports = router;