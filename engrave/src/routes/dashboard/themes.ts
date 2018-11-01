import * as express from 'express';
import { IExtendedRequest } from '../IExtendedRequest';
import { GetValidators } from '../../validators/GetValidators';
import { Themes } from '../../modules/Themes';

let router = express.Router();

router.get('/themes', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render("dashboard/themes.pug", {
      themes: Themes.getInstalledThemes(),
      blogger: req.session.blogger,
      url: "themes"
    });
});

module.exports = router;