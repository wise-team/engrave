import { StatisticsModule } from './../../modules/Statistics';
import { PostValidators } from './../../validators/PostValidators';
import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';

let router = express.Router();

router.post('/statistics', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        let statistics = await StatisticsModule.GetStatistics(req.session.blogger);
        res.json({ success: "OK", statistics: statistics });
    } catch (err) {
        res.json({ error: "Error while gettings statistics" });
    }
})

module.exports = router;