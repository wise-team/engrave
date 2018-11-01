import { Themes } from './../../modules/Themes';
import { Blogs } from './../../database/BlogsModel';
import * as express from 'express';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import { ThemeValidator } from '../../validators/ThemeValidator';

let router = express.Router();

router.get( "/themes", RoutesVlidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render("dashboard/themes.pug", {
      themes: Themes.getInstalledThemes(),
      blogger: req.session.blogger,
      url: "themes"
    });
  }
);

router.post(
  "/themes",
  RoutesVlidators.isLoggedAndConfigured,
  ThemeValidator.ValidateInput,
  changeTheme
);

async function changeTheme(req: IExtendedRequest, res: express.Response) {
  try {
    let blog = await Blogs.findOne({ steem_username: req.session.blogger.steem_username})
    blog.theme = req.body.theme;
    await blog.save();
    res.json({ success: "Theme changed" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
  
}

module.exports = router;