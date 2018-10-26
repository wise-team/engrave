import { BlogListModule } from './../../modules/BlogList';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../IExtendedRequest';
import { DashboardSteemConnect, ReaderSteemConnect } from '../../modules/SteemConnect';
import * as express from 'express';

const router = express.Router();

router.get('/', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.query.access_token) {
        if (req.query.blog) {
            if (await BlogListModule.isBlogRegistered(req.query.blog)) {
                req.session.blog_redirect = req.query.blog;
                const uri = ReaderSteemConnect.getLoginURL();
                res.redirect(uri);
            } else {
                res.redirect('/');
            }
        } else {
            const uri = DashboardSteemConnect.getLoginURL();
            res.redirect(uri);
        }
    } else if (req.session.blog_redirect) {
        const redirect = req.session.blog_redirect;
        req.session.blog_redirect = null;
        res.redirect('http://' + redirect + '/authorize?access_token=' + req.query.access_token);
    } else {
        req.session.access_token = req.query.access_token;

        try {
            DashboardSteemConnect.setAccessToken(req.session.access_token);
            const loggedUser = await DashboardSteemConnect.me();
            req.session.steemconnect = loggedUser.account;

            let user = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (user) {
                req.session.blogger = user;
                if (user.tier) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/configure');
                }
            } else {
                req.session.blogger = await BlogListModule.addNewUnconfiguredBlog(req.session.steemconnect.name);
                console.log(" * Dodano nowego użytkownika do bazy: " + req.session.steemconnect.name)
                res.redirect('/configure');
            }
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
});

module.exports = router;