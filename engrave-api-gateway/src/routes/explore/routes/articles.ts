import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import publishedService from '../../../services/published/published.service';

const middleware: any[] =  [
    body('category').optional().isString().trim().escape(),
    body('skip').optional().isNumeric().trim().escape().toInt(),
    body('limit').optional().isNumeric().trim().escape().toInt()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { skip, category, limit } = req.body;

        const articles = await publishedService.getLatestByCategory(category ? category : null, skip ? skip : 0, limit ? limit : 12);
        
        return res.json(articles);

    }, req, res);
}

export default {
    middleware,
    handler
}