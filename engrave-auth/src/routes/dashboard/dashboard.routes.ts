import * as express from "express";
import login from "./routes/login";

const dashboardApi: express.Router = express.Router();

dashboardApi.get('/login', login.middleware, login.handler);

export default dashboardApi;