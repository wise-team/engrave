import { ICategory } from './ICategory';
import { Document } from 'mongoose';

export interface IPost extends Document {
    steem_username: string;
    date: Date;
    scheduled: boolean;
    title: string;
    body: string;
    category: ICategory;
    tags: [string];
    links: [string];
    image: [string];
    thumbnail: string;
}