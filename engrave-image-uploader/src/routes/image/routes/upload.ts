import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import {uploadImageFromUrl, uploadImageFromFile} from '../../../services/imgur/uploadImage';

const middleware: any[] =  [
    body('url').optional().isString().isURL(),
    body('file').optional()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        let link = null;
        const { url } = req.body;
        const { file } = <any>req;

        if(url) {
            link = await uploadImageFromUrl(url);
        } else if(file) {
            link = await uploadImageFromFile(file.buffer);
        } else {
            throw new Error("Invalid request");
        }

        return res.json( { 
            success: "OK",
            link: link
        });

    }, req, res);
}

export default {
    middleware,
    handler
}