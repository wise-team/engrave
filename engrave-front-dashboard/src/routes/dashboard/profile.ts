
import * as express from 'express';
import { RoutesVlidators } from '../../validators/RoutesValidators';
import { ProfileValidator } from '../../validators/ProfileValidator';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { IBlog } from '../../helpers/IBlog';
import { Blogs } from '../../submodules/engrave-shared/models/BlogsModel';

let router = express.Router();

router.get('/profile', 
    RoutesVlidators.isLoggedAndConfigured, 
    renderProfilePage
);

router.post('/profile',
    RoutesVlidators.isLoggedAndConfigured,
    ProfileValidator.ValidateInput,
    updateProfile
);

async function renderProfilePage(req: IExtendedRequest, res: express.Response) {
    res.render('dashboard/profile.pug', { blogger: req.session.blogger, url: 'profile' });
}

async function updateProfile(req: IExtendedRequest, res: express.Response){
    try {
        let profile = req.body;
        let blog: IBlog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });

        blog.author_name = profile.author_name;
        blog.author_surname = profile.author_surname;
        blog.author_bio = profile.author_bio;
        blog.author_image_url = profile.author_image_url;

        await blog.save();

        req.session.blogger = blog;
        res.json({ success: "Settings saved" });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = router;