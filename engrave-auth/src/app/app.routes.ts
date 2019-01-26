import healthApi from "../routes/health/health.routes";
import blogApi from "../routes/blog/blog.routes";
import dashboardApi from "../routes/dashboard/dashboard.routes";
import validateApi from "../routes/validate/validate.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/blog', blogApi);
    app.use('/dashboard', dashboardApi);
    app.use('/validate', validateApi);
}

export default routes;
