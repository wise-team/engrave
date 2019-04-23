import { ICategory } from './ICategory';
import { Document } from 'mongoose';

export interface IArticle extends Document {
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
    featured_image: string;
}