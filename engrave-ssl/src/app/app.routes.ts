import healthApi from "../routes/health/health.routes";
import sslApi from "../routes/ssl/ssl.routes";
import domainApi from "../routes/domain/domain.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/ssl', sslApi);
    app.use('/domain', domainApi);
}

export default routes;
