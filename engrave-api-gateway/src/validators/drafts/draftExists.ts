import postsService from '../../services/posts/services.posts';
import { PostStatus } from '../../submodules/engrave-shared/enums/PostStatus';

export async function draftExists(id: any) {
    return await postsService.getWithQuery({
        _id: id, 
        status: PostStatus.DRAFT
    });
}