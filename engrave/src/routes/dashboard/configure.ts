import { BlogListModule } from './../../modules/BlogList';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { NodeAppsModule } from '../../modules/NodeApps';
import { Tier } from '../../helpers/TierEnum';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import * as express from 'express';

let router = express.Router();

router.get('/configure', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.blogger.configured) {
        res.render('dashboard/configure.pug', { blogger: req.session.blogger, url: 'configure' });
    } else {
        res.redirect('/dashboard');
    }

});

router.post('/configure/finish', RoutesVlidators.isLoggedIn, async (req: IExtendedRequest, res: express.Response) => {

    try {
        let configuration = req.body;
        let domain = configuration.domain;
        if (configuration.subdomain) {
            domain = configuration.subdomain + "." + configuration.domain;
        }
        
        let available = await BlogListModule.isBlogDomainAvailable(domain);
        if (!available) throw new Error('Blog with that address already exist');

        let blog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
        if(blog.configured) throw new Error('You already configured your blog!');

        if (!blog.configured) {
            blog.configured = true;
            blog.email = configuration.email;
            blog.theme = configuration.theme;
            blog.category = configuration.category;
            blog.domain = domain;

            if (blog.tier == Tier.BASIC) {
                blog.ssl = true;
            } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                blog.is_domain_custom = true;
            }

            await blog.save();

            await NodeAppsModule.createAndRun(blog);

            res.json({ success: "Configured successfully!" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});



module.exports = router;