import { IExtendedRequest } from "./IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from 'express';

let router = express.Router();

router.get('/', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/main.pug', {blogger: req.session.blogger});
});

router.get('/about', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/about.pug', {blogger: req.session.blogger});
});

router.get('/how-to-earn', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.render('main/how-to-earn.pug', {blogger: req.session.blogger});
});

router.get('/create', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if(!req.session.blogger) {
        res.render('main/create.pug', {blogger: req.session.blogger});
    } else if(!req.session.blogger.tier) {
        res.redirect('/configure');
    } else {
        res.redirect('/');
    }
});

router.get('/configure', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    if(req.session.blogger && !req.session.blogger.tier) {
        res.render('main/configure.pug', {blogger: req.session.blogger});
    } else {
        res.redirect('/');
    }
    
});

router.get('*', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    res.redirect('/');
})

module.exports = router;