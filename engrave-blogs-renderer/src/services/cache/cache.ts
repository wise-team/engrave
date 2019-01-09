import { IBlog, Blog } from "../../submodules/engrave-shared/interfaces/IBlog";
import { BlogNotExist, ArticleNotFound } from "../../helpers/errorCodes";
import steemHelper from '../../services/steem/steem';
import { Blogs } from "../../submodules/engrave-shared/models/BlogsModel";

import parseSteemArticle from '../../submodules/engrave-shared/services/article/parseSteemArticle';
import { IArticle } from "../../submodules/engrave-shared/interfaces/IArticle";

const Redis = require('ioredis');
const redis = new Redis({
    host: "redis"
});

const JSONCache = require('redis-json');
 
const blogs = new JSONCache(redis, {prefix: 'blogs:'});

redis.on("error", function (err: any) {
    console.log("Redis error " + err);
});

async function getArticle(username: string, hostname: string, permlink: string) {
    try {
        const flattenedArticle = await redis.get(`article:${username}:${permlink}`);
        
        if( ! flattenedArticle) {    
            
            const article = await steemHelper.getArticle(username, permlink);

            if(!article) {
                await setArticleNotExists(hostname,permlink);
                throw new ArticleNotFound();
            }
            
            return await setArticle(hostname, permlink, article);

        } else {

            const article = JSON.parse(flattenedArticle);

            if(article.state == 404) {
                throw new ArticleNotFound();
            } 

            return article;
        }
        
    } catch (error) {
        throw new ArticleNotFound();
    }
}

async function setArticle(username: string, permlink: string, article: any) {
    
    const parsedArticle = parseSteemArticle(article);
    const timestamp = (new Date(article.created)).getTime();
    
    await redis.set(`article:${username}:${permlink}`, JSON.stringify(parsedArticle));
    await redis.zadd(`created:${username}`, timestamp, `article:${username}:${permlink}`);
    
    return parsedArticle
}

async function setArticleNotExists(username: string, permlink: string) {
    return await redis.set(`article:${username}:${permlink}`, JSON.stringify({state: 404}), 'EX', 3600 * 24);
}

async function getLatest(username: string, limit: number): Promise<IArticle[]> {
    const permlinks = await redis.zrevrange(`created:${username}`, 0, limit);
    
    if(!permlinks.length) {
        return [];
    }

    const rawPosts = await redis.mget(permlinks);
    const posts = rawPosts.map((post: any) => JSON.parse(post));
    return posts;
}

async function getFeatured(username: string, limit: number): Promise<IArticle[]> {
    // todo get featured
    return await getLatest(username, limit);
}

async function getBlog(hostname: string): Promise<Blog> {
    try {
        const blog = await blogs.get(hostname);
        
        if( ! blog) {

            const dbBlog = await Blogs.findOne({domain: hostname});

            if( ! dbBlog) throw new BlogNotExist();

            const blogToCache = prepareNewBlogToCache(dbBlog);

            await setBlog(hostname, blogToCache);
          
            return blogToCache;
        }
        
        return blog;
    } catch (error) {
        throw new BlogNotExist();
    }
}

async function setBlog(hostname: string, blog: any) {
    return await blogs.set(hostname, blog);
}

function prepareNewBlogToCache(dbBlog: IBlog): Blog {
    return {
        username: dbBlog.steem_username,
        domain: dbBlog.domain,
        link_facebook: dbBlog.link_facebook,
        link_twitter: dbBlog.link_twitter,
        link_linkedin: dbBlog.link_linkedin,
        link_instagram: dbBlog.link_instagram,
        title: dbBlog.blog_title,
        slogan: dbBlog.blog_slogan,
        logo_url: dbBlog.blog_logo_url,
        main_image: dbBlog.blog_main_image,
        opengraph_default_image_url: dbBlog.opengraph_default_image_url,
        opengraph_default_description: dbBlog.opengraph_default_description,
        onesignal_app_id: dbBlog.onesignal_app_id,
        onesignal_api_key: dbBlog.onesignal_api_key,
        onesignal_body_length: dbBlog.onesignal_body_length,
        onesignal_logo_url: dbBlog.onesignal_logo_url,
        analytics_gtag: dbBlog.analytics_gtag,
        webmastertools_id: dbBlog.webmastertools_id,
        lang: dbBlog.frontpage_language,
        theme: dbBlog.theme,
        show_everything: dbBlog.show_everything,
    }
}


export default {
    getArticle,
    setArticle,
    setArticleNotExists,
    getBlog,
    setBlog,
    getLatest,
    getFeatured
};