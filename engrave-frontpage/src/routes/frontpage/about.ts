import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/about', (req: any, res: Response, next: NextFunction) => {
    res.render(`${process.env.FRONT}/about.pug`);
});

module.exports = router;