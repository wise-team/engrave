import { Document } from 'mongoose';
export interface IStatistics extends Document {
    steem_username: String;
    sbd: [Number];
    steem: [Number];
    steem_power: [Number];
    savings_sbd: [Number];
    savings_steem: [Number];
}