let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let postSchema = new Schema({
    steem_username: String,
    date: Date,
    scheduled: Boolean,
    title: String,
    body: String,
    category: {
        steem_tag: String,
        slug: String,
        name: String
    },
    tags: [String],
    links: [String],
    image: [String],
    thumbnail: String
});


module.exports = mongoose.model('posts', postSchema);