import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function validatePostOwnership(id: string, username: string) {
    
    const post = await Posts.findById(id);

    if(post.username != username) throw new Error("You are not the owner of that post!");
    
    return post;
}

export default validatePostOwnership;