import { ICategory } from './ICategory';
import { Document } from 'mongoose';

export interface IPost extends Document {
    steem_username: String;
    date: Date;
    scheduled: Boolean;
    title: String;
    body: String;
    category: ICategory;
    tags: [String];
    links: [String];
    image: [String];
    thumbnail: String;
}