import { Blogs } from "../database/BlogsModel";
import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';

export class RoutesVlidators {

    static async isLoggedIn(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        try {
            if (!req.session.steemconnect) throw new Error("User not logged in");
            return next();
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    static async isLoggedAndConfigured(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {

        try {
            if (!req.session.steemconnect) throw new Error("User not logged in");
            let blogger = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (!blogger) throw new Error("Blogger not found");
            req.session.blogger = blogger;
            if (!blogger.tier) res.redirect('/configure');
            else if (!blogger.configured) {
                if (req.path == '/configure') {
                    return next();
                } else {
                    res.redirect('/dashboard/configure');
                }
            } else {
                return next();
            }

        } catch (error) {
            res.status(401).json(error.message);
        }
    }
}

