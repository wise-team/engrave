import { StatisticsValidator } from './../../validators/StatisticsValidator';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import { Utils } from '../../modules/Utils';
import { Blogs } from '../../database/BlogsModel';
import axios from 'axios';

let router = express.Router();

router.get("/statistics", RoutesVlidators.isLoggedAndConfigured, renderStatisticsPage);

router.post('/statistics', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        
        const options = {
            method: 'POST',
            url: 'http://statistics:3000/wallet/history',
            data: { username: req.session.blogger.steem_username },
        };
        
        const reponse: any = await axios(options);
        res.json({ success: "OK", statistics: reponse.data ? reponse.data : []});
        
    } catch (err) {
        console.log(err);
        res.json({ error: "Error while gettings statistics" });
    }
})

router.put(
    '/statistics', 
    RoutesVlidators.isLoggedAndConfigured, 
    StatisticsValidator.ValidateInput, 
    async (req: IExtendedRequest, res: express.Response) => {
        try {
            const newSettings = req.body;

            let blog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });
            blog.analytics_gtag = newSettings.analytics_gtag;
            blog.webmastertools_id = newSettings.webmastertools_id;
            await blog.save();
            req.session.blogger = blog;
            res.json({ success: "Settings saved successfully" });
        } catch (err) {
            res.status(400).json({ error: "Error while changing statistics settings" });
        }
})

async function renderStatisticsPage (req: IExtendedRequest, res: express.Response) {
    res.render("dashboard/statistics.pug", {
      blogger: req.session.blogger,
      url: "statistics"
    });
}

module.exports = router;