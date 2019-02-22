import postsService from '../../services/posts/services.posts';
import { PostStatus } from '../../models/EPostStatus';

export async function draftExists(id: any) {
    return await postsService.getWithQuery({
        _id: id, 
        status: PostStatus.DRAFT
    });
}