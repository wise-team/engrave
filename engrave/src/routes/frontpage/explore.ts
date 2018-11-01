import { BlogListModule } from './../../modules/BlogList';
import { IExtendedRequest } from "../IExtendedRequest";
import { Response, NextFunction } from "express";
import * as express from "express";
import { validationResult, check } from 'express-validator/check';

let router = express.Router();

router.get("/explore", renderExplorePage);
router.post("/explore", check("skip").isDecimal(), getMoreBlogs);


async function renderExplorePage(req: IExtendedRequest, res: Response, next: NextFunction) {
  res.render("main/explore.pug", {
    blogs: await BlogListModule.getRegisteredBlogs(0),
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

module.exports = router;
