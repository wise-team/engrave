export class BlogNotExist extends Error {
    constructor() {
        super("Blog not exists");
    }
}

export class ArticleNotFound extends Error {
    constructor() {
        super("Article not found");
    }
}