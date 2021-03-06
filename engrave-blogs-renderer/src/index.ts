import app from './app/app';
import { listenOnPort } from './submodules/engrave-shared/utils/listenOnPort';
import waitForMicroservice from './submodules/engrave-shared/utils/waitForMicroservice';
import config from './submodules/engrave-shared/config/config';

( async () => {

    await waitForMicroservice(config.services.auth);
    await waitForMicroservice(config.services.sitemap_builder);

    listenOnPort(app, 8080);

})();
