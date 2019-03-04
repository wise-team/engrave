import * as express from "express";
import send from "./routes/send";

const onesignalApi: express.Router = express.Router();

onesignalApi.post('/', send.middleware, send.handler);

export default onesignalApi;