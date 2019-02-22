import { Schema, Model, model } from 'mongoose';
import { IPost } from './IPost';

export let PostSchema: Schema = new Schema({
    created: Date,
    username: String,
    scheduled: {
        required: false,
        type: Date
    },
    title: String,
    body: String,
    categories: [String],
    tags: [String],
    thumbnail: String,
    status: { 
        type: String
    }
});

export const Posts: Model<IPost> = model<IPost>("posts", PostSchema);