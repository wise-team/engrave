import * as express from "express";
import verifyToken from "../../middlewares/jwt/verifyToken";

import addCategory from './routes/addCategory';
import getBlogCategories from './routes/getBlogCategories';
import removeCategory from './routes/removeCategory';
import updateCategory from './routes/updateCategory';

const categoriesApi: express.Router = express.Router();

// categoriesApi.get('/', verifyToken, getAllBlogs.middleware, getAllBlogs.handler);
categoriesApi.get('/:blogId', verifyToken, getBlogCategories.middleware, getBlogCategories.handler);
categoriesApi.delete('/', verifyToken, removeCategory.middleware, removeCategory.handler);
categoriesApi.post('/', verifyToken, addCategory.middleware, addCategory.handler);
categoriesApi.put('/', verifyToken, updateCategory.middleware, updateCategory.handler);


export default categoriesApi;