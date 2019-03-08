const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const serveStatic = require('serve-static')
import * as express from 'express';
import { getBlog } from '../submodules/engrave-shared/services/cache/cache';

function settings(app: any) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/robots.txt', serveRobotsTxt);
    app.use(serveStaticForTheme);
    app.use(express.static('/app/certbot')); // for letsencrypt purposes
    app.set('view engine', 'pug');
    app.set('views', '/app/src/themes');
    mongoose.connect("mongodb://mongo:27017/engrave", { useNewUrlParser: true });
}

const serveStaticForTheme = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {hostname} = req;
        const blog = await getBlog(hostname);            
        const staticHandler = serveStatic(`/app/src/themes/${blog.theme}/public`)
        return staticHandler(req, res, next);    
    } catch (error) {
        return next();
    }
}

const serveRobotsTxt = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    try {
        const { hostname } = req;
        await getBlog(hostname);      

        const fileContent = `Sitemap: https://${hostname}/sitemap.xml\nUser-agent: *\nDisallow: `;
        
        res.type('text/plain').send(fileContent);

    } catch (error) {
        return next();
    }

    
}

export default settings;