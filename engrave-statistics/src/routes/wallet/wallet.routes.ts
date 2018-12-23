import * as express from "express";
import history from "./routes/history";

const walletApi: express.Router = express.Router();

walletApi.post('/history', history.middleware, history.handler);

export default walletApi;