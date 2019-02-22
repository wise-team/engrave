import * as express from "express";
import get from "./routes/get";
import getAll from "./routes/getAll";
import create from './routes/create';
import verifyToken from "../../middlewares/jwt/verifyToken";

const draftsApi: express.Router = express.Router();

draftsApi.post('/', verifyToken, create.middleware, create.handler);
draftsApi.get('/', verifyToken, getAll.middleware, getAll.handler);
draftsApi.get('/:id', verifyToken, get.middleware, get.handler);

export default draftsApi;