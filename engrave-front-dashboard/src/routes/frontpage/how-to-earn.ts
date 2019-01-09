import { IExtendedRequest } from "../../helpers/IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/how-to-earn', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render(`main/${process.env.FRONT}/how-to-earn.pug`, { blogger: req.session.blogger });
});

module.exports = router;