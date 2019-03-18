import { Themes } from './../modules/Themes';
import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';
import { ValidatorUtils } from "./ValidatorUtils";

export class ThemeValidator {
    static async ValidateInput(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        try {
            if (!ValidatorUtils.isExist(req.body.theme)) throw new Error("Theme not provided");
            if (!Themes.verifyTheme(req.body.theme)) throw new Error("Invalid theme");
            
            next();
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}