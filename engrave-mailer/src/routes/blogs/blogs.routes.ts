import * as express from "express";
import created from "./routes/created";

const blogsApi: express.Router = express.Router();

blogsApi.post('/created', created.middleware, created.handler);

export default blogsApi;