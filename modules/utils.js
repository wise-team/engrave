let config = require('../config');
let steemconnect2 = require('sc2-sdk');
let steem = require('steem');

module.exports.getAllPosts = (limit, start_permlink, username, callback) => {

    let cnt = 0;
    let posts = [];
    var start_author = username;

    var query = {
        tag: username,
        limit: 25
    };

    (function innerFunction() {

        if (start_permlink) {
            query.start_permlink = start_permlink;
            query.start_author = start_author;
        }

        steem.api.getDiscussionsByBlog(
            query,
            function (err, result) {

                if (err) {
                    console.log(err);
                    if (callback) {
                        callback(err, null);
                    }
                } else {
                    if (callback) {

                        if (start_permlink) {
                            result = result.slice(1, result.length)
                        }

                        result.forEach(element => {
                            var resteemed = (element.author != username);
                            
                            if (cnt < limit && !resteemed) {
                                if(element.beneficiaries.length && element.beneficiaries[0].account == 'nicniezgrublem') {
                                    if(element.json_metadata && element.json_metadata != '') {
                                        let metadata = JSON.parse(element.json_metadata);
                                        if(metadata.image && metadata.image.length) {
                                            element.thumbnail = metadata.image[0];
                                        }
                                    }
                                    posts.push(element);
                                    cnt++;
                                }
                            }
                        });
                        if (cnt >= limit || (start_permlink == null && result.length < 25) || result.length + 1 < 25) {
                            callback(null, posts);
                        } else {
                            start_permlink = result[result.length - 1].permlink;
                            start_author = result[result.length -1 ].author;
                            innerFunction();
                        }
                    }
                }
            });
    })();
}
