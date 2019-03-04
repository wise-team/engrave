import * as express from "express";
import publish from "./routes/publish";
import verifyToken from "../../middlewares/jwt/verifyToken";

const postsApi: express.Router = express.Router();

postsApi.post('/', verifyToken, publish.middleware, publish.handler);

export default postsApi;