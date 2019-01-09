import { Themes } from './../../modules/Themes';
import { Blogs } from './../../database/BlogsModel';
import { Utils } from '../../modules/Utils'
import * as express from 'express';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import { ICategory } from '../../helpers/ICategory';
import axios from 'axios';
import checkIfDomainPointsToEngrave from '../../services/domain/checkIfDomainPointsToEngrave';
import generateCertificatesForDomain from '../../services/ssl/generateCertificatesForDomain';
import generateNginxSettings from '../../services/nginx/generateNginxSettings';

let router = express.Router();

router.get('/settings', RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/settings.pug', { 
        themes: Themes.getInstalledThemes(),
        blogger: req.session.blogger, 
        url: 'settings' 
    });
});

router.post('/settings', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        let newSettings = req.body;
        let tempCategories = [];
        let categories: ICategory[] = [];

        for (var key in newSettings) {
            if (key.match(/(c_)([0-9]*)(_name)+/)) {
                tempCategories.push({ name: key, value: newSettings[key] });
            }
        }

        tempCategories.forEach(singleCategory => {
            let id = singleCategory.name.replace('c_', "").replace('_name', "");
            let slug_reg = new RegExp('(c_)(' + id + ')(_slug)', "i");
            let steem_tag_reg = new RegExp('(c_)(' + id + ')(_steem_tag)', "i");

            let slug = null;
            let steem_tag = null;

            for (var key in newSettings) {
                if (key.match(slug_reg)) {
                    slug = newSettings[key];
                }
            }

            for (var key in newSettings) {
                if (key.match(steem_tag_reg)) {
                    steem_tag = newSettings[key];
                }
            }

            for (let category of categories) {
                if (category.slug == slug || category.steem_tag == steem_tag) throw new Error('You can\'t set categories with repeated slug or Steem tag')
            }

            categories.push({
                steem_tag: steem_tag.toLowerCase(),
                slug: slug.toLowerCase(),
                name: singleCategory.value
            })
        })

        if (!categories.length) {
            res.json({ error: "Add at least one category" });
        } else {
            newSettings.categories = categories;
            let blog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            Utils.CopySettings(newSettings, blog);
            await blog.save();
            req.session.blogger = blog;

            try {
                
                await axios({
                    method: 'POST',
                    url: `http${blog.ssl ? 's' : ''}://${blog.domain}/settings/refresh`
                });

                res.json({ success: "Settings saved successfully" });
                
            } catch (err) {
                console.log(err);
                res.json({ error: "Error while updating blog settings" });
            }
            
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post('/ssl', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        const domain =  req.session.blogger.domain;
        if(await checkIfDomainPointsToEngrave (domain) &&
            await checkIfDomainPointsToEngrave('www.' + domain)) {
            console.log("Asked for SSl enable on: ", req.session.blogger.domain);
            let blog = await Blogs.findOne({ steem_username: req.session.steemconnect.name});
            await generateCertificatesForDomain(req.session.blogger.domain);
            await generateNginxSettings(blog);
            blog.ssl = true;
            await blog.save();
            res.json({ success: "SSL enabled!" });            
        } else {
            res.json({ error: "Your domain is not pointing to our server. Edit DNS records or contact us" });            
        }
    } catch (error) {
        res.json({ error: "SSL could not be enabled. Try again or contact admin" });
    }

})

module.exports = router;