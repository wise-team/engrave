import { Document } from 'mongoose';

export interface IStatistics extends Document {
    steem_username: string;
    sbd: [number];
    steem: [number];
    steem_power: [number];
    savings_sbd: [number];
    savings_steem: [number];
}