import * as express from "express";
import login from "./routes/login";
import authorize from "./routes/authorize";

const blogApi: express.Router = express.Router();

blogApi.get('/', login.middleware, login.handler);
blogApi.get('/authorize', authorize.middleware, authorize.handler);

export default blogApi;