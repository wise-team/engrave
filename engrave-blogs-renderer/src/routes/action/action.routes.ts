import * as express from "express";
import comment from "./routes/comment";
import vote from "./routes/vote";

const actionApi: express.Router = express.Router();

actionApi.post('/comment', comment.middleware, comment.handler);
actionApi.post('/vote', vote.middleware, vote.handler);

export default actionApi;