let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let statisticsSchema = new Schema({
    steem_username: String,
    sbd: [Number],
    steem: [Number],
    steem_power: [Number],
    savings_sbd: [Number],
    savings_steem: [Number],
});


module.exports = mongoose.model('statistics', statisticsSchema);