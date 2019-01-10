import healthApi from "../routes/health/health.routes";
import postsApi from "../routes/posts/posts.routes";
import * as httpCodes from 'http-status-codes';
import { Request, Response } from "express";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/posts', postsApi);
    app.use('*', (req: Request, res: Response) => {res.status(httpCodes.NOT_FOUND).json({message: "Resource not found"})})
}

export default routes;
