import * as express from "express";
import get from "./routes/get";
import store from "./routes/store";

const dashboardApi: express.Router = express.Router();

dashboardApi.get('/:username', get.middleware, get.handler);
dashboardApi.post('/:username', store.middleware, store.handler);

export default dashboardApi;