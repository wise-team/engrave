import { GetValidators } from './../validators/GetValidators';
import { BlogListModule } from './../modules/BlogList';
import { Blogs } from './../database/BlogsModel';
import { Tier } from '../database/helpers/TierEnum';
import { IExtendedRequest } from './IExtendedRequest';
import { SteemConnect } from '../modules/SteemConnect';
import * as express from 'express';
import { Utils } from '../modules/Utils';

let router = express.Router();

router.get('/logout', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    var redirectUrl = '/';
    if (req.session.current_url) {
        redirectUrl += req.session.current_url;
    }
    req.session.destroy();
    res.redirect(redirectUrl);

});

router.get('/tier/basic', GetValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {    
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.BASIC);
            res.redirect('/dashboard');
        } catch(err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/standard', GetValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {

        try {
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.STANDARD);
            res.redirect('/dashboard');
        } catch (err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/extended', GetValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {
            await Utils.setBloggerTier(req.session.steemconnect.name, Tier.EXTENDED);
            res.redirect('/dashboard');

        } catch (err) {
            res.redirect('/');
        }
    }

});

router.get('/tier/cancel', GetValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    if(!req.session.steemconnect) {
        res.redirect('/');
    } else {
        try {
            let blogger = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if (blogger && !blogger.configured) {
                blogger.tier = null;
                await blogger.save();
                res.redirect('/dashboard');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            res.redirect('/');
        }
    }

});

router.get('/', async (req: IExtendedRequest, res: express.Response, next: express.NextFunction) => {
    if(!req.query.access_token) {
        if(req.query.blog) {

            if (await BlogListModule.IsBlogRegistered(req.query.blog)) {
                req.session.blog_redirect = req.query.blog;
                let uri = SteemConnect.getLoginURL();
                res.redirect(uri);
            } else {
                res.redirect('/');
            }
        } else {
            let uri = SteemConnect.getLoginURL();
            res.redirect(uri);
        }
    } else if (req.session.blog_redirect) {
        let redirect = req.session.blog_redirect;
        req.session.blog_redirect = null;
        res.redirect('http://' + redirect + '/authorize?access_token=' + req.query.access_token);
    } else {
        req.session.access_token = req.query.access_token;

        try {
            SteemConnect.setAccessToken(req.session.access_token);
            let loggedUser = await SteemConnect.me();
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