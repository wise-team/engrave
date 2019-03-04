import healthApi from "../routes/health/health.routes";
import accessApi from "../routes/access/access.routes";
import refreshApi from "../routes/refresh/refresh.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/access', accessApi);
    app.use('/refresh', refreshApi);
}

export default routes;

