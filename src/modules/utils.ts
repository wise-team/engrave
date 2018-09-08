let steem = require('steem');
var getSlug = require('speakingurl');
let getUrls = require('get-urls');
const isImage = require('is-image');
const utils = require('../modules/utils');

export class Utils {

    static async GetAllPostsFromBlockchain(limit: number, start_permlink: string, username: string) {

        let cnt: number = 0;
        let posts: object[] = [];
        var start_author: string = username;

        var query: any = {
            tag: username,
            limit: 25
        };

        (async function innerFunction() {

            if (start_permlink) {
                query.start_permlink = start_permlink;
                query.start_author = start_author;
            }

            let result = await steem.api.getDiscussionsByBlog(query);

            if (start_permlink) {
                result = result.slice(1, result.length)
            }

            result.forEach((element: any) => {
                var resteemed = (element.author != username);

                if (cnt < limit && !resteemed) {
                    if (element.beneficiaries.length && (element.beneficiaries[0].account == 'nicniezgrublem' || element.beneficiaries[0].account == 'engrave')) {
                        if (element.json_metadata && element.json_metadata != '') {
                            let metadata = JSON.parse(element.json_metadata);
                            if (metadata.image && metadata.image.length) {
                                element.thumbnail = metadata.image[0];
                                element.body = utils.removeWebsiteAdvertsElements(element.body);
                            }
                        }
                        posts.push(element);
                        cnt++;
                    }
                }
            });
            if (cnt >= limit || (start_permlink == null && result.length < 25) || result.length + 1 < 25) {
                return posts;
            } else {
                start_permlink = result[result.length - 1].permlink;
                start_author = result[result.length - 1].author;
                innerFunction();
            }
        })();
    }

    static PrepareOperations(scope: string, article: any, blogger: any) {

        let operations: any[] = [
            ['comment',
                {
                    parent_author: "",
                    parent_permlink: article.parent_category ? article.parent_category : article.tags[0],
                    author: blogger.steem_username,
                    permlink: article.permlink,
                    title: article.title,
                    body: article.body,
                    json_metadata: JSON.stringify({
                        tags: article.tags,
                        image: article.image,
                        links: article.links,
                        category: article.category,
                        app: `engrave/0.1`,
                        format: "markdown",
                        domain: blogger.domain
                    })
                }
            ]
        ];

        if (scope == 'edit') {
            return operations;
        } else if (scope == 'publish') {
            operations.push(
                ['comment_options', {
                    author: blogger.steem_username,
                    permlink: article.permlink,
                    max_accepted_payout: '1000000.000 SBD',
                    percent_steem_dollars: 10000,
                    allow_votes: true,
                    allow_curation_rewards: true,
                    extensions: [
                        [0, {
                            beneficiaries: [
                                { account: 'nicniezgrublem', weight: 5 * 100 },
                                { account: 'engrave', weight: (parseInt(blogger.tier) - 5) * 100 }
                            ]
                        }]
                    ]
                }
                ]);
            return operations;
        } else {
            return null;
        }
    }


    static prepareBloggerPost(article: any, blogger: any) {

        if (article.body != '' && article.title != '') {

            article.permlink = getSlug(article.title);

            var urls: string[] = getUrls(article.body);
            var links: string[] = [];
            var image: string[] = [];
            var category: string = null;
            var thumbnail: string = null;

            if (article.image && article.image != '') {
                image.push(article.image);
                thumbnail = article.image;
            }

            urls.forEach(url => {
                if (url[url.length - 1] == ')') {
                    var trimmed = url.substring(0, url.length - 1);
                } else {
                    var trimmed = url;
                }

                if (isImage(trimmed)) {
                    image.push(trimmed);
                } else {
                    links.push(trimmed);
                }
            })

            var tags: string[] = [];

            if (!article.parent_category) {
                for (var i = 0; i < blogger.categories.length; i++) {
                    if (blogger.categories[i].name === article.category) {
                        category = blogger.categories[i];
                        tags.push(blogger.categories[i].steem_tag); // obtain category steemconnect tags
                        break;
                    }
                }
            } else {
                tags.push(article.parent_category);
            }
            var tempTags = null;
            if (typeof (article.tags) == 'string') {
                tempTags = article.tags.split(" ");
            } else {
                tempTags = article.tags;
            }

            tempTags.forEach((tag: string) => {
                if (tag != ' ' && tag != null && tag != '') {
                    tags.push(tag.trim());
                }
            })

            if (blogger.frontpage_language == 'pl') {
                article.body += '\n\n***\n<center>\n### Pierwotnie opublikowano na [' + blogger.blog_title + '](http://' + blogger.domain + '/' + article.permlink + '). Blog na Steem napędzany przez [ENGRAVE](https://engrave.website).\n</center>';
            } else {
                article.body += '\n\n***\n<center>\n### Oryginally posted on [' + blogger.blog_title + '](http://' + blogger.domain + '/' + article.permlink + '). Steem blog powered by [ENGRAVE](https://engrave.website).\n</center>';
            }
            article.links = links;
            article.tags = tags;
            article.image = image;
            article.category = category;
            article.thumbnail = thumbnail;
            return article;
        } else {
            return null;
        }
    }

    static removeWebsiteAdvertsElements(body: string) {
        let newBody = body.replace(/(\n\*\*\*\n<center>\s###\sOryginally posted on \[)(.*)(\)\.\sSteem blog powered by \[)(.*)(\)\.\n\<\/center\>)/g, "")
        newBody = newBody.replace(/(\n\*\*\*\n<center>\s###\sPierwotnie opublikowano na \[)(.*)(\)\.\sBlog na Steem napędzany przez \[)(.*)(\)\.\n\<\/center\>)/g, "")
        return newBody;
    }
}

