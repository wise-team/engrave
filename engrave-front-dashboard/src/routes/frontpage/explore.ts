import { BlogListModule } from './../../modules/BlogList';
import { Response, NextFunction } from "express";
import * as express from "express";
import { validationResult, check } from 'express-validator/check';
import { IExtendedRequest } from '../../helpers/IExtendedRequest';
import { PublishedArticlesModule } from '../../modules/PublishedArticles';

let router = express.Router();

router.get("/explore", renderExplorePage);

router.post("/explore/blogs", 
  check("skip").isDecimal(), 
  check("category").optional().isString(), 
  getMoreBlogs);

router.post("/explore/articles", 
  check("skip").isDecimal(),
  check("category").optional().isString(), 
  getMoreArticles);


async function renderExplorePage(req: IExtendedRequest, res: Response, next: NextFunction) {
  res.render(`main/${process.env.FRONT}/explore.pug`, {
    blogs: await BlogListModule.getRegisteredBlogs(0, null),
    articles: await PublishedArticlesModule.getLatest(0, null),
    blogger: req.session.blogger
  });
}

async function getMoreBlogs(req: IExtendedRequest, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { skip, category } = req.body;

  res.json({
    blogs: await BlogListModule.getRegisteredBlogs(parseInt(skip), category)
  });
}                                                                                                                                              

async function getMoreArticles(req: IExtendedRequest, res: Response, next: NextFunction) {

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { skip, category } = req.body;

  res.json({
    articles: await PublishedArticlesModule.getLatest(parseInt(skip), category)
  });
}

module.exports = router;
