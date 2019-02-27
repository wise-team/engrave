import blogsService from '../services.blogs';

async function validateBlogOwnership(blogId: string, username: string) {
    
    let blog = await blogsService.getBlogByQuery({_id: blogId});

    if(blog.username != username) throw new Error("You are not the owner of that blog!");

    return blog;
}

export default validateBlogOwnership;