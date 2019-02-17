import * as express from "express";
import register from "./routes/register";
import confirm from "./routes/confirm";

const registrationApi: express.Router = express.Router();

registrationApi.post('/register', register.middleware, register.handler);
registrationApi.post('/confirm', confirm.middleware, confirm.handler);

export default registrationApi;