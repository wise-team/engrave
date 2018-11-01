import { StatisticsModule } from './../../modules/Statistics';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';

let router = express.Router();

router.post('/statistics', RoutesVlidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {
    try {
        let statistics = await StatisticsModule.GetStatistics(req.session.blogger);
        res.json({ success: "OK", statistics: statistics });
    } catch (err) {
        res.json({ error: "Error while gettings statistics" });
    }
})

module.exports = router;