import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import { categoryExist } from '../../../validators/categories/categoryExist';
import categoriesService from '../../../services/categories/categories.service';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import { validateCategoryIsEmpty } from '../../../validators/categories/validateCategoryIsEmpty';

const middleware: any[] = [
    body('id').isString().custom(categoryExist).withMessage('Category does not exist')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { id } = req.body;
        const { username } = res.locals;
        
        const [category]: ICategory[] = await categoriesService.getCategoriesByQuery({_id: id});

        await validateBlogOwnership(category.blogId, username);
        
        if( !await validateCategoryIsEmpty(category)) {
            throw new Error("You cannot remove category with articles assigned");
        }

        await categoriesService.removeWithQuery({_id: id});

        return res.json({
            success: 'OK'
        });

    }, req, res);
}

export default {
    middleware,
    handler
}