import * as express from "express";
import confirm from "./routes/confirm";

const registrationApi: express.Router = express.Router();

registrationApi.post('/confirm', confirm.middleware, confirm.handler);

export default registrationApi;