import healthApi from "../routes/health/health.routes";
import registrationApi from "../routes/registration/registration.routes";
import blogsApi from "../routes/blogs/blogs.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/registration', registrationApi);
    app.use('/blogs', blogsApi);
}

export default routes;

