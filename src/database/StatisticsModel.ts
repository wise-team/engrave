import { Document, Schema, Model, model } from 'mongoose';

export interface IStatistics extends Document {
    steem_username: String,
    sbd: [Number],
    steem: [Number],
    steem_power: [Number],
    savings_sbd: [Number],
    savings_steem: [Number],
}

export let StatisticsSchema = new Schema({
    steem_username: String,
    sbd: [Number],
    steem: [Number],
    steem_power: [Number],
    savings_sbd: [Number],
    savings_steem: [Number],
})

export let Statistics: Model<IStatistics> = model<IStatistics>("statistics", StatisticsSchema);