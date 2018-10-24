import { BlogListModule } from './../../modules/BlogList';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../IExtendedRequest';
import { AdminSteemConnect, UserSteemConnect } from '../../modules/SteemConnect';
import * as express from 'express';

const router = express.Router();

router.get('/', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.query.access_token) {
        if (req.query.blog) {
            if (await BlogListModule.isBlogRegistered(req.query.blog)) {
                req.session.blog_redirect = req.query.blog;
                const uri = UserSteemConnect.getLoginURL();
                res.redirect(uri);
            } else {
                res.redirect('/');
            }
        } else {
            const uri = AdminSteemConnect.getLoginURL();
            res.redirect(uri);
        }
    } else if (req.session.blog_redirect) {
        const redirect = req.session.blog_redirect;
        req.session.blog_redirect = null;
        res.redirect('http://' + redirect + '/authorize?access_token=' + req.query.access_token);
    } else {
        req.session.access_token = req.query.access_token;

        try {
            AdminSteemConnect.setAccessToken(req.session.access_token);
            const loggedUser = await AdminSteemConnect.me();
            req.session.steemconnect = loggedUser.account;

            console.log("Steemconnect logged in: " + req.session.steemconnect.name);

            let user = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (user) {
                req.session.blogger = user;
                console.log("Witamy ponownie: ", user.steem_username);
                if (user.tier) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/configure');
                }
            } else {
                user = new Blogs({
                    steem_username: req.session.steemconnect.name,
                    created: Date(),
                    configured: false,
                    posts_per_category_page: 15,
                    load_more_posts_quantity: 9,
                    author_image_url: "",
                    theme: 'clean-blog',
                    blog_title: 'Steem Blog',
                    blog_slogan: 'Personal Steem Powered Blog',
                    frontpage_language: 'en',
                    categories: [{ steem_tag: 'engrave', slug: 'blog', name: 'Default category' }]
                });
                req.session.blogger = user;
                await user.save();
                console.log(" * Dodano nowego użytkownika do bazy: " + user.steem_username)
                res.redirect('/configure');
            }
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
});

module.exports = router;