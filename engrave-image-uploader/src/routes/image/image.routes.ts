import * as express from "express";
import upload from "./routes/upload";

const multer = require('multer');
const ignoreMulterErrors = multer({ storage: multer.memoryStorage() }).single('file');

const imageApi: express.Router = express.Router();

imageApi.post('/upload', function (req: any, res: any, next: any) {
    ignoreMulterErrors(req, res, function (err: any) {  
      next();
    })
  }, upload.middleware, upload.handler);

export default imageApi;