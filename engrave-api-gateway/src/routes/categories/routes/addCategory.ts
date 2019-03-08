import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { blogExists } from '../../../validators/blog/blogExiststs';
import { isSlugValid } from '../../../validators/categories/isSlugValid';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import categoriesService from '../../../services/categories/categories.service';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';
import { isSlugUniquePerBlog } from '../../../validators/categories/isSlugUniquePerBlog';

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
        
        if(!await isSlugUniquePerBlog(blogId, slug)) {
            throw new Error("Category slug must be unique");
        }

        const category: ICategory = await categoriesService.createCategoryWithQuery({
            blogId,
            slug,
            name,
            abstract
        })

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