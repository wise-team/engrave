import { IExtendedRequest } from "../helpers/IExtendedRequest";
import * as express from 'express';
import { ValidatorUtils } from "./ValidatorUtils";

export class ProfileValidator {
    static async ValidateInput(req: IExtendedRequest, res: express.Response, next:express.NextFunction) {
        try {
            const profile = req.body;

            if (!ValidatorUtils.isExist(profile.author_name)) throw new Error("Name not provided");
            if (!ValidatorUtils.isExist(profile.author_surname)) throw new Error("Surname not provided");
            if (!ValidatorUtils.isExist(profile.author_bio)) throw new Error("Bio not provided");
            if (!ValidatorUtils.isExist(profile.author_image_url)) throw new Error("Image not provided");
            
            next();

        } catch (error) {
            res.status(400).json(error.message);
        }
    }
}