
import * as _ from 'lodash';
import { Blogs } from '../submodules/engrave-shared/models/BlogsModel';

let parseDomain = require('parse-domain');

export class BlogListModule {

    private static prohibitedSubdomains = ['beta', 'alpha', 'staging', 'demo', 'live', 'm', 'api', 'www', 'blog'];
    private static prohibitedDomains = ['example.com'].concat(JSON.parse(process.env.BLOGS_DOMAINS ? process.env.BLOGS_DOMAINS : "[]"));

    /**
     * Check if blog is registerd on Engrave system to prevent from using Engrave Steemconnect App to get SC2 token without registering own app
     * @param domain domain with or without http or https
     */
    static async isBlogRegistered(domain: string) {
        try {
            let searchDomain = this.buildSearchableDomain(domain);
            let blog = await Blogs.findOne({ domain: searchDomain, configured: true});

            if (blog) return true;
            else return false;

        } catch (error) {
            return false;
        }
    }

    /**
     * Check if desirable domain can be used to configure blog. Should return false when blog already exists or subdomain is prohibited
     * @param domain string containing domain that should be check if can be configured
     */
    static async isBlogDomainAvailable(domain: string) {
        try {
            const searchDomain = this.buildSearchableDomain(domain);
            
            if (_.includes(this.prohibitedSubdomains, parseDomain(searchDomain).subdomain)) return false;
            if (_.includes(this.prohibitedDomains, searchDomain)) return false;
            
            if(await this.isBlogRegistered(searchDomain)) return false; 
    
            return true;
            
        } catch (error) {
            return false;
        }

    }

    /**
     * Get all registerd blogs as domains array
     */
    static async listAllBlogDomains(): Promise<string[]> {
        let blogList: string[] = [];
        let blogs = await Blogs.find({configured: true}, {domain: 1});
        for(let blog of blogs) {
            blogList.push(blog.domain);
        }
        return blogList;
    }

    /**
     * Create domain that can be used to search with Blogs model. It should remove 'http://' and 'https://'
     * @param domain string to build searchable domain from. Can include 'http://' prefix
     */
    static buildSearchableDomain(domain: string): string {
        let parsedUrl = parseDomain(domain);

        if (parsedUrl.subdomain != "") {
            return parsedUrl.subdomain + '.' + parsedUrl.domain + '.' + parsedUrl.tld;
        } else {
            return parsedUrl.domain + '.' + parsedUrl.tld;
        }
    }

    /**
     * Create new unconfigured blog and save it into the database
     * @param steem_username blog owner
     */
    static async addNewUnconfiguredBlog(steem_username: string) {
        return await Blogs.create({
            steem_username: steem_username,
            created: Date(),
            configured: false,
            posts_per_category_page: 15,
            load_more_posts_quantity: 9,
            author_image_url: "",
            theme: 'clean-blog',
            blog_title: 'Steem Blog',
            blog_slogan: 'Personal Steem Powered Blog',
            frontpage_language: 'en',
            categories: [{ steem_tag: 'engrave', slug: 'blog', name: 'Default category' }]
        });
    }

    /**
     * Return array of registered and configured blogs
     * @param skip how many blogs to skip (used for pagination)
     */
    static async getRegisteredBlogs(skip: number) {
        try {
            const blogs = await Blogs.find({ configured: true })
              .skip(skip)
              .limit(12)
              .sort("-created")
              .select('blog_title blog_slogan domain')
              .exec();
            return blogs;
        } catch (error) {
            return [];
        }
    }
}