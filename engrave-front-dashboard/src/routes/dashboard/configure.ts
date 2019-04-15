import { ConfigureValidator } from '../../validators/ConfigureValidator';
import { BlogListModule } from '../../modules/BlogList';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { Tier } from '../../helpers/TierEnum';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import * as express from 'express';
import { Themes } from '../../modules/Themes';
import { Blogs } from '../../submodules/engrave-shared/models/BlogsModel';
import validateDomainPointingToEngrave from '../../services/ssl/validateDomainPointingToEngrave';
import generateNginxSettings from '../../services/nginx/generateNginxSettings';
import { setUserRegistered } from '../../submodules/engrave-shared/services/cache/cache';
import sendWelcomeMail from '../../services/mailer/sendWelcomeMail';

let router = express.Router();

router.get('/configure', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.blogger.configured) {
        res.render('dashboard/configure.pug', { 
            themes: Themes.getInstalledThemes(),
            blogger: req.session.blogger, 
            url: 'configure',
            domainPrice: {
                steem: process.env.DOMAIN_PRICE_STEEM,
                sbd: process.env.DOMAIN_PRICE_SBD,
            }
        });
    } else {
        res.redirect('/dashboard');
    }

});

router.post(
    '/configure/finish', 
    RoutesVlidators.isLoggedIn, 
    ConfigureValidator.ValidateInput, 
    
    async (req: IExtendedRequest, res: express.Response) => {

        try {
            let configuration = req.body;
            let domain = configuration.domain.toLowerCase();
            if (configuration.subdomain) {
                domain = configuration.subdomain.toLowerCase() + "." + configuration.domain.toLowerCase();
            } else {
                if ( ! await validateDomainPointingToEngrave(domain))
                    throw new Error("Please, change your domain's DNS settings as mentioned in this page and try again");
                if ( ! await validateDomainPointingToEngrave(`www.${domain}`))
                    throw new Error("Please, change your domain's DNS settings as mentioned in this page and try again");
            }
            
            let available = await BlogListModule.isBlogDomainAvailable(domain);
            if (!available) throw new Error('Blog with that address already exist');

            let blog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            if(blog.configured) throw new Error('You already configured your blog!');

            if (!blog.configured) {
                blog.configured = true;
                blog.email = configuration.email;
                blog.newsletter = configuration.newsletter == 'on' ? true : false;
                blog.theme = configuration.theme;
                blog.blog_title = configuration.blog_title;
                blog.blog_slogan = configuration.blog_slogan;
                blog.category = configuration.category;
                blog.domain = domain;
                blog.ssl = false;

                if (blog.tier == Tier.BASIC) {
                    blog.ssl = true;
                } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                    blog.is_domain_custom = true;
                }

                await blog.save();

                await setUserRegistered(blog.steem_username);
                
                await generateNginxSettings(blog);
                
                if(blog.email && blog.email != '') {
                    await sendWelcomeMail(blog.email, blog.steem_username, blog.domain);
                }

                res.json({ success: "Configured successfully!" });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }     
});



module.exports = router;