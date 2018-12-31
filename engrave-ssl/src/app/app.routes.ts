import healthApi from "../routes/health/health.routes";
import sslApi from "../routes/ssl/ssl.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/ssl', sslApi);
}

export default routes;
