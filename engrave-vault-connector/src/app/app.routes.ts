import healthApi from "../routes/health/health.routes";
import accessApi from "../routes/access/access.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/access', accessApi);
}

export default routes;

