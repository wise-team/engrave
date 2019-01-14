import { BlogListModule } from './../../modules/BlogList';
import { Response, NextFunction } from "express";
import * as express from "express";
import { validationResult, check } from 'express-validator/check';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { PublishedArticlesModule } from '../../modules/PublishedArticles';

let router = express.Router();

router.get("/explore", renderExplorePage);
router.post("/explore/blogs", check("skip").isDecimal(), getMoreBlogs);
router.post("/explore/articles", check("skip").isDecimal(), getMoreArticles);


async function renderExplorePage(req: IExtendedRequest, res: Response, next: NextFunction) {
  res.render(`main/${process.env.FRONT}/explore.pug`, {
    blogs: await BlogListModule.getRegisteredBlogs(0),
    articles: await PublishedArticlesModule.getLatest(0),
    blogger: req.session.blogger
  });
}

async function getMoreBlogs(req: IExtendedRequest, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  res.json({
    blogs: await BlogListModule.getRegisteredBlogs(parseInt(req.body.skip))
  });
}

async function getMoreArticles(req: IExtendedRequest, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  res.json({
    articles: await PublishedArticlesModule.getLatest(parseInt(req.body.skip))
  });
}

module.exports = router;
