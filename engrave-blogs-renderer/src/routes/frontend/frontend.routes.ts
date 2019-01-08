import * as express from "express";
import main from "./routes/main";
import article from "./routes/article";

const frontendApi: express.Router = express.Router();

frontendApi.get('/', main.middleware, main.handler);
frontendApi.get('/:permlink', article.middleware, article.handler);

export default frontendApi;