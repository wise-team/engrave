import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function validatePostOwnership(id: string, username: string) {
    
    if(!id) return null;

    const post = await Drafts.findById(id);

    if(post.username != username) throw new Error("You are not the owner of that post!");
    
    return post;
}

export default validatePostOwnership;