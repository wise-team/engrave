import healthApi from "../routes/health/health.routes";
import postsApi from "../routes/posts/posts.routes";
import blogsApi from "../routes/blogs/blogs.routes";
import coinsApi from "../routes/coins/coins.routes";
import draftsApi from "../routes/drafts/drafts.routes";
import categoriesApi from "../routes/categories/categories.routes";


import * as httpCodes from 'http-status-codes';
import { Request, Response } from "express";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/posts', postsApi);
    app.use('/blogs', blogsApi);
    app.use('/categories', categoriesApi);
    app.use('/drafts', draftsApi);
    app.use('/coins', coinsApi);
    app.use('*', (req: Request, res: Response) => {res.status(httpCodes.NOT_FOUND).json({message: "Resource not found"})})
}

export default routes;
