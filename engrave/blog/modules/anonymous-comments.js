let Comments = require('../models/comments');
let config = require('../config').get_config();
let steem = require('steem');

modules.exports.add_comment = (author, body, parent_author, parent_permlink, cb) => {
    let comment = new Comments({
        status: 'added',
        author: author,
        body: body,
        date: new Date(),
        parent_author: parent_author,
        parent_permlink: parent_permlink
        // email_hash
        // tags
    });
    comment.save(function(err) {
        cb(err);
    })
};

modules.exports.accept_comment = (id, cb) => {
    Comments.findById(id, function(err, comment) {
        if(!err && res) {
            comment.status = 'accepted';
            comment.save(cb(err));
            // add to blockchain
            // cb(err);
        } else {
            cb(err)   
        }
    })
}