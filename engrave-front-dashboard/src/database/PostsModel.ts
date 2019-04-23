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
    image: [String], // this is misleading but it comes from steem blockchain article type and it is in fact an images array
    thumbnail: String,
    featured_image: String
});

export const Posts: Model<IArticle> = model<IArticle>("posts", PostSchema);