import healthApi from "../routes/health/health.routes";
import onesignalApi from "../routes/onesignal/onesignal.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/onesignal', onesignalApi);
}

export default routes;

