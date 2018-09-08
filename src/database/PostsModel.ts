import { Document, Schema, Model, model } from 'mongoose';

export interface IPost extends Document {
    steem_username: String,
    date: Date,
    scheduled: Boolean,
    title: String,
    body: String,
    category: {
        steem_tag: String,
        slug: String,
        name: String
    },
    tags: [String],
    links: [String],
    image: [String],
    thumbnail: String
}

export let PostSchema: Schema = new Schema({
    steem_username: String,
    date: Date,
    scheduled: Boolean,
    title: String,
    body: String,
    category: {
        steem_tag: String,
        slug: String,
        name: String
    },
    tags: [String],
    links: [String],
    image: [String],
    thumbnail: String
});

export const Posts: Model<IPost> = model<IPost>("posts", PostSchema);