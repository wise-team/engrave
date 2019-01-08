import app from './app/app';
import { listenOnPort } from './submodules/engrave-shared/utils/listenOnPort';

listenOnPort(app, 8080);