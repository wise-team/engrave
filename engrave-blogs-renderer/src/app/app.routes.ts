import healthApi from "../routes/health/health.routes";
import frontendApi from "../routes/frontend/frontend.routes";
import postsApi from "../routes/posts/posts.routes";

function routes(app:any) {
    
    app.locals.moment = require('moment');
    
    app.use('/health', healthApi);
    app.use('/posts', postsApi);
    app.use('/', frontendApi);
    app.use(function (err:any, req:any, res:any, next:any) {
        // set locals, only providing error in development

        res.locals.message = err.message;
        res.locals.error = err;
        
        // render the error page
        res.status(err.status || 500);
        res.render('default/theme/error');
    });
}

export default routes;
