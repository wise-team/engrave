import * as express from 'express';
import routes from './app.routes';
import settings from './app.settings';
import tasks from './app.tasks';

const app = express();

settings(app);

routes(app);

tasks();

export default app;