import * as express from "express";
import get from "./routes/get";
import store from "./routes/store";

const accessApi: express.Router = express.Router();

accessApi.get('/:username', get.middleware, get.handler);
accessApi.post('/:username', store.middleware, store.handler);

export default accessApi;