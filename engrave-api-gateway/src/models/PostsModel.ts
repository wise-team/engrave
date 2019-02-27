import { Schema, Model, model } from 'mongoose';
import { IPost } from './IPost';

export let PostSchema: Schema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'newblogs',
        required: true
    },
    created: Date,
    username: String,
    scheduled: {
        type: Date,
        required: false
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