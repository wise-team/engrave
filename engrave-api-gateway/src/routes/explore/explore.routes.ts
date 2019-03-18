import * as express from "express";
import blogs from "./routes/blogs";
import articles from "./routes/articles";

const exploreApi: express.Router = express.Router();

exploreApi.get('/blogs', blogs.middleware, blogs.handler);
exploreApi.get('/articles', articles.middleware, articles.handler);

export default exploreApi;