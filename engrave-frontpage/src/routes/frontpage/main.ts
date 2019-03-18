import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/', (req: any, res: Response, next: NextFunction) => {
    res.render(`${process.env.FRONT}/main.pug`);
});

router.get('*', (req: any, res: Response, next: NextFunction) => {
    res.redirect('/');
})

module.exports = router;