import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { blogExists } from '../../../validators/blog/blogExiststs';
import { isSlugValid } from '../../../validators/categories/isSlugValid';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import categoriesService from '../../../services/categories/categories.service';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';
import { validateIsSlugUniquePerBlog } from '../../../validators/categories/validateIsSlugUniquePerBlog';
import blogsService from '../../../services/blogs/services.blogs';
import { setBlog } from '../../../submodules/engrave-shared/services/cache/cache';
import rebuildSitemap from '../../../services/sitemap/actions/rebuildSitemap';

const middleware: any[] =  [
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
    
    body('name').isString().isLength({min: 2, max: 24}),
    body('slug').isString().custom(isSlugValid).withMessage("Slug is invalid"),

    // optional
    body('abstract').optional().isString(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;
        const { blogId, name, slug, abstract } = req.body;

        await validateBlogOwnership(blogId, username);
        
        await validateIsSlugUniquePerBlog(blogId, slug, null);

        const category: ICategory = await categoriesService.createCategoryWithQuery({
            blogId,
            slug,
            name,
            abstract
        })

        const blog = await blogsService.getBlogByQuery({_id: blogId});

        await setBlog(blog);
        await rebuildSitemap(blog);
        
        return res.json( {
            success: "OK",
            category
        } );

    }, req, res);
}

export default {
    middleware,
    handler
}