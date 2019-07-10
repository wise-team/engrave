
import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';
import { Blogs } from "../submodules/engrave-shared/models/BlogsModel";
const jwt = require('jsonwebtoken');

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
            
            const token = RoutesVlidators.prepareJwtTokenFromAccessToken(req.session.access_token);

            const decodedToken = jwt.decode(token);

            const currentTime = new Date().getTime() / 1000;
	        if (decodedToken.exp < currentTime) {
                req.session.destroy();
                throw new Error("Session expired");
            }

            let blogger = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (!blogger) throw new Error("Blogger not found");
            req.session.blogger = blogger;
            if (!blogger.tier) res.redirect('/tiers');
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
            console.log(error);
            if(req.method == 'GET') {
                res.redirect('/');
            } else {
                res.status(401).json(error.message);
            }
            
        }
    }

    private static prepareJwtTokenFromAccessToken (access_token: string) {

        const jwtHasHeader = (access_token.match(new RegExp('\\.')) || []).length > 1;

        if(!jwtHasHeader) {
            return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${access_token}`;
        } else {
            return access_token;
        }


    }
}

