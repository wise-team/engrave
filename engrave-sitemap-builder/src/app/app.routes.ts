import healthApi from "../routes/health/health.routes";
import sitemapApi from "../routes/sitemap/sitemap.routes";

function routes(app:any) {
    app.use('/health', healthApi);
    app.use('/sitemap', sitemapApi);
}

export default routes;

