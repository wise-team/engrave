import * as express from "express";
import get from "./routes/get";
import getAll from "./routes/getAll";
import create from './routes/create';
import remove from './routes/remove';
import update from './routes/update';
import verifyToken from "../../middlewares/jwt/verifyToken";

const draftsApi: express.Router = express.Router();

draftsApi.get('/', verifyToken, getAll.middleware, getAll.handler);
draftsApi.post('/', verifyToken, create.middleware, create.handler);
draftsApi.put('/', verifyToken, update.middleware, update.handler);
draftsApi.get('/:id', verifyToken, get.middleware, get.handler);
draftsApi.delete('/:id', verifyToken, remove.middleware, remove.handler);

export default draftsApi;