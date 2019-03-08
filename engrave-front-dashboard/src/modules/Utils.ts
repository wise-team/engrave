import { DashboardSteemConnect } from './SteemConnect';
import { Tier } from "../helpers/TierEnum";
import { IBlog } from "../helpers/IBlog";
import { Blogs } from '../submodules/engrave-shared/models/Blogs';

let steem = require('steem');
var getSlug = require('speakingurl');
let getUrls = require('get-urls');
const isImage = require('is-image');

export class Utils {

    static async GetPostsFromBlockchain(limit: number, start_permlink: string, username: string) {

        let blogger = await Blogs.findOne({ steem_username: username });

        let cnt: number = 0;
        let posts: object[] = [];
        var start_author: string = username;

        var query: any = {
            tag: username,
            limit: 25
        };

        while (posts.length < limit) {
            if (start_permlink) {
                query.start_permlink = start_permlink;
                query.start_author = start_author;
            }

            let steemPosts = await steem.api.getDiscussionsByBlogAsync(query);

            if (start_permlink) {
                steemPosts = steemPosts.slice(1, steemPosts.length)
            }

            steemPosts.forEach((element: any) => {
                var resteemed = (element.author != username);

                if (cnt < limit && !resteemed) {
                    if ( blogger.show_everything || blogger.adopter || element.beneficiaries.length && (element.beneficiaries[0].account == 'nicniezgrublem' || element.beneficiaries[0].account == 'engrave')) {
                        if (element.json_metadata && element.json_metadata != '') {
                            let metadata = JSON.parse(element.json_metadata);
                            if (metadata.image && metadata.image.length) {
                                element.thumbnail = metadata.image[0];
                                element.body = Utils.removeWebsiteAdvertsElements(element.body);
                            }
                        }
                        posts.push(element);
                        cnt++;
                    }
                }
            });

            if (cnt >= limit || (start_permlink == null && steemPosts.length < 25) || steemPosts.length + 1 < 25) {
                break;
                // return posts;
            } else {
                start_permlink = steemPosts[steemPosts.length - 1].permlink;
                start_author = steemPosts[steemPosts.length - 1].author;
            }
        }

        return new Promise<object>((resolve, reject) => {
            resolve(posts);
        });

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
                        app: `engrave`,
                        format: "markdown",
                        domain: blogger.domain
                    })
                }
            ]
        ];

        switch(scope) {
            case 'edit':
            return operations;

            case 'publish':

            let extensions: any = [];

            if(!blogger.adopter) {
                extensions = [
                    [0, {
                        beneficiaries: [
                            { account: 'engrave', weight: 15 * 100 }
                        ]
                    }]
                ];
            }
            

            operations.push(
                ['comment_options', {
                    author: blogger.steem_username,
                    permlink: article.permlink,
                    max_accepted_payout: article.decline_reward ? '0.000 SBD' : '1000000.000 SBD',
                    percent_steem_dollars: 10000,
                    allow_votes: true,
                    allow_curation_rewards: true,
                    extensions: extensions
                }
                ]);
            return operations;

            default:
            throw new Error('Invalid operations scope');
        }

    }


    static prepareBloggerPost(article: any, blogger: any) {

        if(article.image != '' && !isImage(article.image)) {
            throw new Error('Please use only direct image link as a thumbnail');
        }

        if (article.body != '' && article.title != '') {

            if (!article.permlink) {
                article.permlink = getSlug(article.title);
            }

            var urls: string[] = getUrls(article.body);
            var links: string[] = [];
            var image: string[] = [];
            var category: string = null;
            var thumbnail: string = null;

            if (article.image && article.image != '') {
                let imageLink = article.image;
                
                if(Array.isArray(article.image)) {
                    imageLink = article.image[0];
                }

                image.push(imageLink);
                thumbnail = imageLink;
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
                        tags.push(blogger.categories[i].steem_tag.toLowerCase()); // obtain category steemconnect tags
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
                article.body += '\n\n***\n<center><sup>Pierwotnie opublikowano na [' + blogger.blog_title + '](https://' + blogger.domain + '/' + article.permlink + '). Blog na Steem napędzany przez [' + process.env.FRONT.toUpperCase() + '](https://' + process.env.DOMAIN + ').</sup></center>';
            } else {
                article.body += '\n\n***\n<center><sup>Originally posted on [' + blogger.blog_title + '](https://' + blogger.domain + '/' + article.permlink + '). Steem blog powered by [' + process.env.FRONT.toUpperCase() + '](https://' + process.env.DOMAIN + ').</sup></center>';
            }
            article.links = links;
            article.tags = tags;
            article.image = image;
            article.category = category;
            article.thumbnail = thumbnail;
            return article;
        } else {
            throw new Error('Cannot parse article');
        }
    }

    static removeWebsiteAdvertsElements(body: string) {
        let newBody = body
            .replace(/(\n\*\*\*\n<center>\s###\sOriginally posted on \[)(.*)(\)\.\sSteem blog powered by \[)(.*)(\)\.\n\<\/center\>)/g, "")
            .replace(/(\n\*\*\*\n<center><sup>Originally posted on \[)(.*)(\)\.\sSteem blog powered by \[)(.*)(\)\.<\/sup\>\<\/center\>)/g, "")
            .replace(/(\n\*\*\*\n<center>\s###\sPierwotnie opublikowano na \[)(.*)(\)\.\sBlog na Steem napędzany przez \[)(.*)(\)\.\n\<\/center\>)/g, "")
            .replace(/(\n\*\*\*\n<center><sup>Pierwotnie opublikowano na \[)(.*)(\)\.\sBlog na Steem napędzany przez \[)(.*)(\)\.<\/sup\>\<\/center\>)/g, "")
            
        return newBody;
    }

    static async setBloggerTier(steemUsername: string, tier: Tier) {
        let blogger = await Blogs.findOne({ steem_username: steemUsername });
        if (!blogger || blogger.tier) throw new Error('Blogger already exists');
        blogger.tier = tier;
        return blogger.save();
    }

    static async cancelBloggerTier(steemUsername: string) {
        let blogger = await Blogs.findOne({ steem_username: steemUsername });
        if (!blogger || blogger.configured) throw new Error("Can't change tier");
        blogger.tier = null;
        return blogger.save();
    }

    static CopySettings(new_settings: any, oldsettings: IBlog) {
        oldsettings.blog_title = new_settings.blog_title
        oldsettings.blog_slogan = new_settings.blog_slogan;
        oldsettings.blog_logo_url = new_settings.blog_logo_url;
        oldsettings.theme = new_settings.theme;
        oldsettings.frontpage_language = new_settings.frontpage_language;
        oldsettings.posts_per_category_page = new_settings.posts_per_category_page;
        oldsettings.load_more_posts_quantity = new_settings.load_more_posts_quantity;
        oldsettings.opengraph_default_description = new_settings.opengraph_default_description;
        oldsettings.opengraph_default_image_url = new_settings.opengraph_default_image_url;
        oldsettings.onesignal_app_id = new_settings.onesignal_app_id;
        oldsettings.onesignal_api_key = new_settings.onesignal_api_key;
        oldsettings.onesignal_logo_url = new_settings.onesignal_logo_url;
        oldsettings.onesignal_body_length = new_settings.onesignal_body_length;
        oldsettings.blog_main_image = new_settings.blog_main_image;

        if (new_settings.categories && new_settings.categories != '') {
            oldsettings.categories = new_settings.categories;
        }
    }

    static generatePaymentLink(currency: string) {
        let amount = '';
        switch(currency.toUpperCase()) {
            case 'STEEM':           
                amount = process.env.DOMAIN_PRICE_STEEM + '.000 ' + currency.toUpperCase();
                break;
            case 'SBD':
            default:
                amount = process.env.DOMAIN_PRICE_SBD + '.000 ' + currency.toUpperCase();
                break;
        }
        return DashboardSteemConnect.sign('transfer', {
            to: 'engrave',
            amount: amount,
            memo: 'Domain request',
        }, process.env.PAYMENT_REDIRECT_URI);
    }

}

