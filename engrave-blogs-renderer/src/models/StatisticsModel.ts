import { Schema, Model, model } from 'mongoose';
import { IStatistics } from '../interfaces/IStatistics';

export let StatisticsSchema = new Schema({
    steem_username: String,
    sbd: [Number],
    steem: [Number],
    steem_power: [Number],
    savings_sbd: [Number],
    savings_steem: [Number],
})

export let Statistics: Model<IStatistics> = model<IStatistics>("statistics", StatisticsSchema);