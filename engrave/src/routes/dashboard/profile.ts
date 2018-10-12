import { PostValidators } from './../../validators/PostValidators';
import { IBlog } from './../../database/helpers/IBlog';
import { Blogs } from './../../database/BlogsModel';
import { IExtendedRequest } from '../IExtendedRequest';
import * as express from 'express';
import { GetValidators } from '../../validators/GetValidators';

let router = express.Router();

router.get('/profile', GetValidators.isLoggedAndConfigured, (req: IExtendedRequest, res: express.Response) => {
    res.render('dashboard/profile.pug', { blogger: req.session.blogger, url: 'profile' });
});

router.post('/profile', PostValidators.isLoggedAndConfigured, async (req: IExtendedRequest, res: express.Response) => {

    try {
        let profile = req.body;
        let blog: IBlog = await Blogs.findOne({ steem_username: req.session.steemconnect.name });

        blog.author_name = profile.author_name;
        blog.author_surname = profile.author_surname;
        blog.author_bio = profile.author_bio;
        blog.author_image_url = profile.author_image_url;

        await blog.save();

        req.session.blogger = blog;
        res.json({ success: "Ustawienia zapisane poprawnie" });
    } catch (error) {
        res.json({ error: "Wystąpił jakiś błąd..." });
    }

});

module.exports = router;