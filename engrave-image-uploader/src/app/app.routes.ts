import healthApi from "../routes/health/health.routes";
import imageApi from "../routes/image/image.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/image', imageApi);
}

export default routes;
