import * as express from "express";
import getBlog from "./routes/getBlog";
import getAllBlogs from "./routes/getAllBlogs";
import removeBlog from "./routes/removeBlog";
import addBlog from "./routes/addBlog";
import updateBlog from "./routes/updateBlog";
import verifyToken from "../../middlewares/jwt/verifyToken";

const blogsApi: express.Router = express.Router();

blogsApi.get('/', verifyToken, getAllBlogs.middleware, getAllBlogs.handler);
blogsApi.post('/', verifyToken, addBlog.middleware, addBlog.handler);
blogsApi.get('/:id', verifyToken, getBlog.middleware, getBlog.handler);
blogsApi.put('/:id', verifyToken, updateBlog.middleware, updateBlog.handler);
blogsApi.delete('/:id', verifyToken, removeBlog.middleware, removeBlog.handler);


export default blogsApi;