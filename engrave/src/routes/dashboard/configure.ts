import { PostValidators } from './../../validators/PostValidators';
import { IBlog } from './../../database/helpers/IBlog';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../IExtendedRequest';
import { NodeAppsModule } from '../../modules/NodeApps';
import { NginxModule } from '../../modules/Nginx';
import * as express from 'express';
import { Tier } from '../../database/helpers/TierEnum';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/configure', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    if (!req.session.blogger.configured) {
        res.render('dashboard/configure.pug', { blogger: req.session.blogger, url: 'configure' });
    } else {
        res.redirect('/dashboard');
    }

});

router.post('/configure/finish', PostValidators.isLoggedIn, (req: IExtendedRequest, res: express.Response) => {

    let configuration = req.body;

    let domain = configuration.domain;

    if (configuration.subdomain) {
        domain = configuration.subdomain + "." + configuration.domain;
    }

    Blogs.findOne({ domain: domain }, function (err: Error, result: IBlog) {
        if (err || result) {
            res.json({ error: "Blog with that domain already exist. Try another one" });
        } else {
            Blogs.findOne({ steem_username: req.session.steemconnect.name }, function (err: Error, blog: IBlog) {
                if (!err && blog) {
                    if (!blog.configured) {
                        blog.configured = true;
                        blog.email = configuration.email;
                        blog.theme = configuration.theme;
                        blog.category = configuration.category;

                        if (blog.tier == Tier.BASIC) {
                            blog.domain = domain;
                            blog.is_domain_custom = false;
                            blog.ssl = true;
                        } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                            blog.domain = domain;
                            blog.is_domain_custom = true;
                        }

                        blog.save(function (err: Error) {
                            if (err) {
                                console.log(err);
                                res.json({ error: "Wystąpił błąd podczas konfiguracji" });
                            } else {
                                if (blog.tier == Tier.BASIC) {
                                    NginxModule.generateSubdomainConfig(blog.domain, blog.port, function (err: Error) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            NodeAppsModule.createAndRun(blog.domain, blog.port, blog.steem_username);
                                        }
                                    });
                                } else if (blog.tier == Tier.STANDARD || blog.tier == Tier.EXTENDED) {
                                    NginxModule.generateCustomDomainConfig(blog.domain, blog.port, function (err: Error) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            NodeAppsModule.createAndRun(blog.domain, blog.port, blog.steem_username);
                                        }
                                    });
                                }

                                res.json({ success: "Konfiguracja zakończona!" });
                            }
                        });

                    } else {
                        res.json({ error: "Już skonfigurowano! Nie oszukuj!" });
                    }
                } else {
                    res.json({ error: "Wystąpił błąd podczas konfiguracji" });
                }
            });
        }
    })
});

module.exports = router;