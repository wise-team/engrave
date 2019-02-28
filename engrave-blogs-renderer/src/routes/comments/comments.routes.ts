import * as express from "express";
import get from "./routes/get";

const commentsApi: express.Router = express.Router();

commentsApi.post('/', get.middleware, get.handler);

export default commentsApi;