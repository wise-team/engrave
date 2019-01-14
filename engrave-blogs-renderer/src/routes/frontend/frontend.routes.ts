import * as express from "express";
import index from "./routes/index";
import article from "./routes/article";
import category from "./routes/category";

const frontendApi: express.Router = express.Router();

frontendApi.get('/', index.middleware, index.handler);
frontendApi.get('/category/:slug', category.middleware, category.handler);
frontendApi.get('/:permlink', article.middleware, article.handler);

export default frontendApi;