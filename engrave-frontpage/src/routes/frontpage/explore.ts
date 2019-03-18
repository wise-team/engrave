import { Response, Request, NextFunction } from "express";
import * as express from "express";
import exploreService from "../../services/explore/explore.service";

let router = express.Router();

router.get("/explore", renderExplorePage);
router.post("/explore/blogs", getMoreBlogs);
router.post("/explore/articles", getMoreArticles);

async function renderExplorePage(req: Request, res: Response, next: NextFunction) {
  res.render(`${process.env.FRONT}/explore.pug`);
}

async function getMoreBlogs(req: Request, res: Response, next: NextFunction) {

    try {
        
        const { skip, category } = req.body;

        const blogs = await exploreService.getLatestBlogs(category, skip, 12);

        res.json(blogs);

    } catch (error) {
        res.json([]);
    }

}

async function getMoreArticles(req: Request, res: Response, next: NextFunction) {

    try {
        
        const { skip, category } = req.body;

        const blogs = await exploreService.getLatestArticles(category, skip, 12);

        res.json(blogs);

    } catch (error) {
        res.json([]);
    }

}


module.exports = router;
