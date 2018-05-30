var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    image: String,
    bio: String,
    facebook_url: String,
    twitter_url: String,
    linkedin_url: String,
    instagram_url: String,
    permissions: String, // user, editor, editor_in_chief, banned
    editor_interests: String,
    editor_email: String
});

module.exports = mongoose.model('users', userSchema);