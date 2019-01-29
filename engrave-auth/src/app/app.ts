import * as express from 'express';
import routes from './app.routes';
import settings from './app.settings';
import asserts from './app.asserts';

asserts();

const app = express();

settings(app);

routes(app);

export default app;