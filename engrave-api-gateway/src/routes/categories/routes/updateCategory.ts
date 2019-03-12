import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import blogsService from '../../../services/blogs/services.blogs';
import { setBlog } from '../../../submodules/engrave-shared/services/cache/cache';
import { isSlugValid } from '../../../validators/categories/isSlugValid';
import { categoryExist } from '../../../validators/categories/categoryExist';
import categoriesService from '../../../services/categories/categories.service';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';
import { validateIsSlugUniquePerBlog } from '../../../validators/categories/validateIsSlugUniquePerBlog';
import rebuildSitemap from '../../../services/sitemap/actions/rebuildSitemap';

const middleware: any[] =  [
    body('id').isString().custom(categoryExist).withMessage('Category does not exist'),

    body('name').optional().isString().isLength({min: 2, max: 24}),
    body('slug').optional().isString().custom(isSlugValid).withMessage("Slug is invalid"),
    body('abstract').optional().isString(),
    
    // prohibited
    body('blogId').not().exists().withMessage('You tried to become a hacker, don\'t you?'),
    body('_id').not().exists().withMessage('You tried to become a hacker, don\'t you?'),

];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { id, slug } = req.body;
        const { username } = res.locals;

        let [category]: ICategory[] = await categoriesService.getCategoriesByQuery({_id: id});

        await validateBlogOwnership(category.blogId, username);
        await validateIsSlugUniquePerBlog(category.blogId, slug, id);

        category = await categoriesService.updateWithQuery(id, req.body);

        const blog = await blogsService.getBlogByQuery({_id: category.blogId});

        await setBlog(blog);
        await rebuildSitemap(blog);

        return res.json({ status: 'OK', category });

    }, req, res);
}

export default {
    middleware,
    handler
}