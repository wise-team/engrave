import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';
import { ValidatorUtils } from "./ValidatorUtils";
import { Themes } from "../modules/Themes";

export class ConfigureValidator {
    static async ValidateInput(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        try {
            const configuration = req.body;

            if (!ValidatorUtils.isExist(configuration.domain)) throw new Error("Domain not provided");
            if (!ValidatorUtils.isExist(configuration.blog_title)) throw new Error("Title not provided");
            if (!ValidatorUtils.isExist(configuration.blog_slogan)) throw new Error("Slogan not provided");
            if (!ValidatorUtils.isExist(configuration.theme)) throw new Error("Theme not provided");
            
            if (ValidatorUtils.isEmpty(configuration.blog_title)) throw new Error("Title cannot be empty");

            if (configuration.blog_title.length < 3) throw new Error("Title too short");
            if (configuration.blog_title.length > 100) throw new Error("Title too long");
            
            if (configuration.blog_slogan.length > 100) throw new Error("Slogan too long");

            if(!Themes.verifyTheme(configuration.theme)) throw new Error('Invalid theme provided');

            next();

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}