import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';
import { ValidatorUtils } from "./ValidatorUtils";

export class StatisticsValidator {
    static async ValidateInput(req: IExtendedRequest, res: express.Response, next: express.NextFunction) {
        try {
            const settings = req.body;

            if (!ValidatorUtils.isExist(settings.analytics_gtag)) throw new Error("Tracking ID not provided");
            if (!ValidatorUtils.isExist(settings.webmastertools_id)) throw new Error("Verification ID not provided");

            next();

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
}