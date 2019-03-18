import { PublishedArticles } from "../../../submodules/engrave-shared/models/Published";
import { IArticle } from "../../../submodules/engrave-shared/interfaces/IArticle";
import { IBlog } from "../../../submodules/engrave-shared/interfaces/IBlog";

const addPublishedPost = async (article: IArticle, blog: IBlog) => {
    
    const post = await PublishedArticles.create({
        title: article.title,
        abstract: article.abstract,
        image: article.featured,
        username: blog.owner,
        steemit_permlink: `https://steemit.com/@${blog.owner}/${article.permlink}`,
        engrave_permlink: `https://${blog.domain}/${article.permlink}`,
        content_category: blog.content_category
    });

    return post;
}

export default addPublishedPost