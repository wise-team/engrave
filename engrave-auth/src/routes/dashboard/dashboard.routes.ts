import * as express from "express";
import login from "./routes/login";
import authorize from "./routes/authorize";

const dashboardApi: express.Router = express.Router();

dashboardApi.get('/', login.middleware, login.handler);
dashboardApi.get('/authorize', authorize.middleware, authorize.handler);

export default dashboardApi;