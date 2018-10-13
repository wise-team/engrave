var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    status: String, // added, approved, rejected
    status_comment: String,
    user: String,
    date: Date,
    title: String,
    body: String,
    image: String,
    category: String,
    tags: String,
    source_title: String,
    source_link: String,
    permlink: String,
    wykop_link: String,
    articles_count: Number,
    settled: Boolean,
    rewards_links: [
        {
            permlink: String,
            date: Date
        }
    ]
});

module.exports = mongoose.model('articles', articleSchema);