import * as express from "express";
import get from "./routes/get";
import getAll from "./routes/getAll";
import verifyToken from "../../middlewares/jwt/verifyToken";

const draftsApi: express.Router = express.Router();

draftsApi.get('/:id', verifyToken, get.middleware, get.handler);
draftsApi.get('/', verifyToken, getAll.middleware, getAll.handler);

export default draftsApi;