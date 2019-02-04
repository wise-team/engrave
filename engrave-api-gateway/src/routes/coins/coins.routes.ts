import * as express from "express";
import sbd from "./routes/sbd";
import steem from "./routes/steem";
import btc from "./routes/btc";

const coinsApi: express.Router = express.Router();

coinsApi.get('/sbd', sbd.middleware, sbd.handler);
coinsApi.get('/steem', steem.middleware, steem.handler);
coinsApi.get('/btc', btc.middleware, btc.handler);

export default coinsApi;