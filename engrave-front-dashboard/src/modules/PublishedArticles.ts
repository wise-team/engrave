import {PublishedArticles} from '../database/PublishedArticlesModel';
import { IBlog } from '../helpers/IBlog';
import * as showdown from 'showdown';
import * as striptags from 'striptags';

const converter = new showdown.Converter();

export class PublishedArticlesModule {

    public static async create(blogger: IBlog, article: any) {

        return await PublishedArticles.create({
            title: article.title,
            date: new Date(),
            body: this.prepareArticleAbbreviation(article.body),
            image: article.image.length ? article.image[0] : null,
            steem_username: blogger.steem_username,
            steemit_permlink: `https://steemit.com/@${blogger.steem_username}/${article.permlink}`,
            engrave_permlink: `https://${blogger.domain}/${article.permlink}`
        });

    }

    public static async getLatest(skip: number) {
        try {
            const articles = await PublishedArticles
              .find({})
              .skip(skip)
              .limit(12)
              .sort("-date")
              .exec();
            return articles;
        } catch (error) {
            return [];
        }
    }

    private static prepareArticleAbbreviation(text: string): string {
        const textWithHTMLTags = converter.makeHtml(text);
        return striptags(textWithHTMLTags).slice(0, 240);
    }

}