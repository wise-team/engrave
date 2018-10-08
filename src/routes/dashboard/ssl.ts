import { PostValidators } from './../../validators/PostValidators';
import { Blogs } from './../../database/BlogsModel';
import { SSLModule } from '../../modules/SSL'
import { IExtendedRequest } from '../IExtendedRequest';
import { NginxModule } from '../../modules/Nginx';
import * as express from 'express';


let router = express.Router();

router.post('/ssl', PostValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {

    console.log("Asked for SSl enable on: ", req.session.blogger.domain);
    SSLModule.generateCertificatesForDomain(req.session.blogger.domain, (err: Error) => {
        if (err) {
            res.json({ error: "SSL could not be enabled. Try again or contact admin" });
        } else {
            NginxModule.generateCustomDomainConfigWithSSL(req.session.blogger.domain, req.session.blogger.port, function (err: Error) {
                if (err) {
                    res.json({ error: "SSL could not be enabled. Try again or contact admin" });
                } else {
                    Blogs.findOne({ steem_username: req.session.steemconnect.name }, function (err: Error, blog: any) {
                        if (!err && blog) {
                            blog.ssl = true;
                            blog.save(function (err: Error) {
                                if (!err) {
                                    res.json({ success: "SSL enabled!" });
                                } else {
                                    res.json({ error: "SSL could not be enabled. Try again or contact admin" });
                                }
                            });
                        } else {
                            res.json({ error: "SSL could not be enabled. Try again or contact admin" });
                        }
                    });
                }
            })
        }
    });
})

module.exports = router;