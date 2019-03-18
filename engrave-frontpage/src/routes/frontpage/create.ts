import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/create', (req: any, res: Response, next: NextFunction) => {
    res.render(`${process.env.FRONT}/create.pug`);
});


module.exports = router;