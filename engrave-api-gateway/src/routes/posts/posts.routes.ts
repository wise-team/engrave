import * as express from "express";
import get from "./routes/get";
import getForMigration from "./routes/getForMigration";

const postsApi: express.Router = express.Router();

postsApi.get('/', get.middleware, get.handler);
postsApi.get('/migration', getForMigration.middleware, getForMigration.handler);

export default postsApi;