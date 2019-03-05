import * as express from 'express';
import routes from './app.routes';
import settings from './app.settings';

const app = express();

settings(app);

routes(app);

export default app;