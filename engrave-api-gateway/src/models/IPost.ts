import { Document } from "mongoose";
import { PostStatus } from './EPostStatus';

export interface IPost extends Document {
    created: Date,
    username: string,
    scheduled: Date,
    title: string,
    body: string,
    categories: string[],
    tags: string[],
    thumbnail: string,
    status: PostStatus
}