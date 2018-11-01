import { Schema, Model, model } from 'mongoose';
import { IArticle } from '../helpers/IArticle';

export let PostSchema: Schema = new Schema({
    steem_username: String,
    date: Date,
    scheduled: Boolean,
    title: String,
    body: String,
    category: Object,
    tags: [String],
    links: [String],
    image: [String],
    thumbnail: String
});

export const Posts: Model<IArticle> = model<IArticle>("posts", PostSchema);