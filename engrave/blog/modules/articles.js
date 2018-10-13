let Articles = require('../models/articles');
let utils = require('../modules/utils');
let featured_posts = require('../modules/featured');
let authors = require('../modules/authors');
let CronJob = require('cron').CronJob;
let steem = require('steem');
let cfg = require('../config');

let cachedArticles = [];

function findArticleInCache(permlink) {
    for(art in cachedArticles) {
        if (cachedArticles[art].permlink == permlink) {
            return cachedArticles[art];
        }
    }
    return null;
}

function updateArticleWithPermlink(permlink, article) {
    for (art in cachedArticles) {
        if (cachedArticles[art].permlink == permlink) {
            cachedArticles[art] = article;
            return;
        }
    }
    cachedArticles.unshift(article); // in case we didn't find anything
}

function cacheAllArticles() {

    utils.getUserFeed(9999, null, null, null, function (posts) {
        if (posts && posts.length > 0) {
            
            let sorted = utils.sortByDate(posts, 'created')

            sorted.forEach(element => {
                var singlePost = utils.prepareSinglePostToRender(element, null);
                singlePost.tags = utils.prepareSinglePostTags(element);
                singlePost.author = authors.getAuthorDetails(singlePost.root_author)
                singlePost.featured_posts = featured_posts.getFeaturedPosts();
                
                updateArticleWithPermlink(singlePost.permlink, singlePost);
            });
        }
    })
}

module.exports.initialize = () => {
    console.log("Articles module initialized");

    cacheAllArticles();

    new CronJob('* * * * *', function () { cacheAllArticles() }, null, true, 'America/Los_Angeles');

}

module.exports.getArticleWithPermlink = (permlink, cb) => {

    if(permlink && permlink != "") {
        let article = findArticleInCache(permlink);
        if (article) {
            if (cb) {
                cb(article);
            }
        } else {

            steem.api.getContent(cfg.get_config().steem_username, permlink, function (err, result) {
                if(err) {
                    console.log(err);
                    if (cb) {
                        cb(null);
                    }
                } else if(result && result.author!="") {

                    var singlePost = utils.prepareSinglePostToRender(result, null);
                    singlePost.tags = utils.prepareSinglePostTags(result);
                    singlePost.author = authors.getAuthorDetails(singlePost.root_author)
                    singlePost.featured_posts = featured_posts.getFeaturedPosts();

                    // updateArticleWithPermlink(singlePost.permlink, singlePost);

                    if (cb) {
                        cb(singlePost);
                    }

                } else {
                    if (cb) {
                        cb(null);
                    }
                }
            });
        }
    } else {
        if (cb) {
            cb(null);
        }    
    }
    
}

module.exports.getArticlesByCategory = (category, limit, start_permlink) => {
    let cnt = 0;
    let permlinkCnt = -1;
    let categoryListing = [];

    if(start_permlink) {
        for (i in cachedArticles) {
            if (cachedArticles[i].permlink == start_permlink) {
                permlinkCnt = i;
                break;
            }
        }
    }

    for(i in cachedArticles) {
        if (parseInt(i) >= 1 + parseInt(permlinkCnt)) {
            // if (utils.isPostInCategory(cachedArticles[i].category, category)) {
            if (cachedArticles[i].category == category || category == null) {
                cnt++;
                categoryListing.push(cachedArticles[i]);
                if (cnt >= parseInt(limit)) {
                    return categoryListing;
                }
            }
        }        
    }
    return categoryListing;
}

module.exports.getArticlesByAuthor = (root_author, limit, start_permlink) => {
    let cnt = 0;
    let permlinkCnt = -1;
    let authorListing = [];

    if (start_permlink) {
        for (i in cachedArticles) {
            if (cachedArticles[i].permlink == start_permlink) {
                permlinkCnt = i;
                break;
            }
        }
    }

    for (i in cachedArticles) {
        if (parseInt(i) >= 1 + parseInt(permlinkCnt)) {
            if (cachedArticles[i].root_author == root_author) {
                cnt++;
                authorListing.push(cachedArticles[i]);
                if (cnt >= parseInt(limit)) {
                    return authorListing;
                }
            }
        }
    }
    return authorListing;
}

module.exports.getFeaturedPosts = () => {
    let posts = exports.getArticlesByCategory(null, 20);
    return utils.sortByKey(posts, 'value').slice(0, 5);
}

module.exports.flushCache = () => {
    cachedArticles = [];
    cacheAllArticles();
}