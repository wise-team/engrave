import * as express from "express";
import get from "./routes/get";
import store from "./routes/store";

const refreshApi: express.Router = express.Router();

refreshApi.get('/:username', get.middleware, get.handler);
refreshApi.post('/:username', store.middleware, store.handler);

export default refreshApi;