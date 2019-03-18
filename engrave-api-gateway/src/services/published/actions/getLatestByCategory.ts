import { PublishedArticles } from "../../../submodules/engrave-shared/models/Published";

const getLatestByCategory = async (category: string, skip: number, limit: number) => {
    let query: any = {
        hidden: false
    }

    if(category) {
        query.content_category = category;
    }

    const articles = await PublishedArticles.find(query).skip(skip).limit(limit).select('-_id');

    return articles;
}

export default getLatestByCategory