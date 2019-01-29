import * as express from "express";
import login from "./routes/login";

const loginApi: express.Router = express.Router();

loginApi.get('/', login.middleware, login.handler);

export default loginApi;