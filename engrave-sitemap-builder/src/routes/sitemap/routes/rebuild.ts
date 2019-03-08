import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import sitemap from '../../../services/sitemap/sitemap.service';

const middleware: any[] =  [
    body('domain').isURL()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { domain } = req.body;

        const xml = await sitemap.rebuildSitemap(domain);

        console.log("Asked to rebuild sitemap for: ", domain);

        res.header('Content-Type', 'application/xml');
        return res.send( xml );
        
    }, req, res);
}

export default {
    middleware,
    handler
}