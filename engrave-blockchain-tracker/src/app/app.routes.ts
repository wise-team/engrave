import healthApi from "../routes/health/health.routes";

function routes(app:any) {
    app.use('/health', healthApi);
}

export default routes;
