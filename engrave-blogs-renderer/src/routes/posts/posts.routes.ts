import * as express from "express";
import get from "./routes/get";

const postsApi: express.Router = express.Router();

postsApi.get('/', get.middleware, get.handler);

export default postsApi;