import * as express from "express";
import get from "./routes/get";
import rebuild from "./routes/rebuild";

const sitemapApi: express.Router = express.Router();

sitemapApi.get('/', get.middleware, get.handler);
sitemapApi.post('/', rebuild.middleware, rebuild.handler);

export default sitemapApi;