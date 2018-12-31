import healthApi from "../routes/health/health.routes";
import configurationApi from "../routes/configuration/configuration.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/configuration', configurationApi);
}

export default routes;
