import healthApi from "../routes/health/health.routes";
import registrationApi from "../routes/registration/registration.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/registration', registrationApi);
}

export default routes;

