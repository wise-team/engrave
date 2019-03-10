import * as express from "express";
import get from "./routes/get";
import store from "./routes/store";

const blogApi: express.Router = express.Router();

blogApi.get('/:username/:elevated', get.middleware, get.handler);
blogApi.post('/:username/:elevated', store.middleware, store.handler);

export default blogApi;