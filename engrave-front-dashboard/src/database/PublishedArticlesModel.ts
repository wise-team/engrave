import { Schema, Model, model } from 'mongoose';
import { IPublishedArticle } from '../helpers/IPublishedArticle';

export let PublishedPostSchema: Schema = new Schema({
    title: String,
    date: Date,
    body: String,
    image: String,
    steem_username: String,
    steemit_permlink: String,
    engrave_permlink: String
});

export const PublishedArticles: Model<IPublishedArticle> = model<IPublishedArticle>("published_articles", PublishedPostSchema);