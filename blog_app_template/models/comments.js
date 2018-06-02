var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments = new Schema({
    status: String, // added, approved, rejected
    status_comment: String,
    author: String,
    date: Date,
    body: String,
    parent_permlink: String,
    parent_author: String,
    tags: String,
    email_hash: String
});

module.exports = mongoose.model('comments', comments);