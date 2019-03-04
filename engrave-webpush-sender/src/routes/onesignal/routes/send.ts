import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import onesignal from '../../../services/onesignal/onesignal.service';

const middleware: any[] =  [
    body('blog_title').isString().isLength({min: 2, max: 84}),
    body('article_title').isString().isLength({min: 2, max: 84}),
    body('article_url').isURL(),
    body('image_url').isURL(),
    
    body('api_key').isString(),
    body('app_id').isString(),
    
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { 
            blog_title, 
            article_title,
            article_url,
            image_url,
            api_key,
            app_id
        } = req.body;

        await onesignal.send(blog_title, article_title, article_url, image_url, api_key, app_id);

        return res.json({
            message: 'Onesignal notification sent',
        });
    }, req, res);
}

export default {
    middleware,
    handler
}