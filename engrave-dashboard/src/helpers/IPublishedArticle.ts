import { Document } from 'mongoose';

export interface IPublishedArticle extends Document {
    title: string;
    date: Date;
    body: string;
    image: string;
    steem_username: string;
    steemit_permlink: string,
    engrave_permlink: string
}