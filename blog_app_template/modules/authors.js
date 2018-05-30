let Users = require('../models/users.js');
let Articles = require('../models/articles.js');

let authorsList = [];

function dbGetUsersArticleCount(username, cb) {
    Articles.count({ user: username, status: "approved" }, function (err, count) {
        if (!err) {
            if (cb) {
                cb(count);
            }
        }
    })
}

module.exports.initialize = () => {

    Users
        .where('permissions').in(['editor', 'editor-in-chief'])
        .exec(function (err, users) {
            if (err) {
                console.log(err);
            } else {
                if (users) {
                    authorsList = users;

                    authorsList.map(function (user) {
                        dbGetUsersArticleCount(user.username, function (count) {
                            user.articles_count = count;
                        });
                    })
                }
            }
        });
}

function updateAuthorArticlesCount(author, count) {
    for (i in authorsList) {
        if (authorsList[i].username == author) {
            authorsList[i].articles_count = count;
        }
    }
}

module.exports.updateAuthorDetails = (author) => {
    Users.findOne({username: author}, function (err, user) {
        if(err) {
            console.log(err);
        } else if (user) {
            for(let i in authorsList) {
                if(authorsList[i].username == author) {
                    authorsList[i] = user;
                    dbGetUsersArticleCount(authorsList[i].username, function (count) {
                        updateAuthorArticlesCount(authorsList[i].username, count);
                    });
                }
            }
        }
    })
}

module.exports.getAuthorDetails = (author) => {

    for(i in authorsList) {
        if (author == authorsList[i].username) {
            return authorsList[i];
        }
    }
    return null;
}