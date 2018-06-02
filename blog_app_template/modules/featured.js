var CronJob = require('cron').CronJob;
let steem = require('steem');
var config = require('../config').get_config();

let featured_posts = [];

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = parseFloat(b[key]);
        var y = parseFloat(a[key]);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function check_featured_posts(cb) {
    steem.api.getDiscussionsByBlog({
        tag: config.steem_username,
        limit: 20
    }, function (err, result) {

        if (err) {
            console.log(err);
        } else {
            var counter = 0;
            var posts = [];
            result.forEach(post => {
                counter++;
                var metadata = JSON.parse(post.json_metadata);
                if (metadata.image) {
                    var imageLink = metadata.image[0]; // todo wyciaganie obrazka z tresci jesli nie ma w metadata
                }
                if (metadata.root_author) {
                    var root_author = metadata.root_author;
                } else {
                    var root_author = config.steem_username;
                }

                var value = parseFloat(parseFloat(post.pending_payout_value.replace(" SBD", "")) + parseFloat(post.total_payout_value.replace(" SBD", ""))).toFixed(2);

                var featured_post = {
                    image: imageLink,
                    permlink: post.permlink,
                    title: post.title,
                    author: root_author,
                    value: value,
                    category: post.category
                }                

                if (post.author == config.steem_username) {
                    posts.push(featured_post);
                }

                if(counter >= result.length) {
                    sortByKey(posts, 'value');
                    featured_posts = posts.slice(0, 5);
                    if(cb) {
                        cb();
                    }
                }
            });
        }
    });
}

module.exports.initialize = () => {
    check_featured_posts(function () {
        new CronJob('* * * * *', function () { check_featured_posts() }, null, true, 'America/Los_Angeles');
    });
}


module.exports.getFeaturedPosts = () => {
    return featured_posts;
};
