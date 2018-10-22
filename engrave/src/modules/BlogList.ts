import { Blogs } from './../database/BlogsModel';
import * as _ from 'lodash';

let parseDomain = require('parse-domain');

export class BlogListModule {

    private static prohibitedSubdomains = ['www', 'blog'];
    private static prohibitedDomains = ['example.com'].concat(JSON.parse(process.env.BLOGS_DOMAINS));

    /**
     * Check if blog is registerd on Engrave system to prevent from using Engrave Steemconnect App to get SC2 token without registering own app
     * @param domain domain with or without http or https
     */
    static async isBlogRegistered(domain: string) {
        try {
            let searchDomain = this.buildSearchableDomain(domain);
            let blog = await Blogs.findOne({ domain: searchDomain });

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

        const searchDomain = this.buildSearchableDomain(domain);
        
        if (_.includes(this.prohibitedSubdomains, parseDomain(searchDomain).subdomain)) return false;
        if (_.includes(this.prohibitedDomains, searchDomain)) return false;
        
        if(await this.isBlogRegistered(searchDomain)) return false; 

        return true;
    }

    /**
     * Get all registerd blogs as domains array
     */
    static async listAllBlogDomains(): Promise<string[]> {
        let blogList: string[] = [];
        let blogs = await Blogs.find({}, {domain: 1});
        for(let blog of blogs) {
            blogList.push(blog.domain);
        }
        return blogList;
    }

    /**
     * Create domain that can be used to search with Blogs model. It should remove 'http://' and 'https://'
     * @param domain string to build searchable domain from. Can include 'http://' prefix
     */
    private static buildSearchableDomain(domain: string): string {
        let parsedUrl = parseDomain(domain);

        if (parsedUrl.subdomain != "") {
            return parsedUrl.subdomain + '.' + parsedUrl.domain + '.' + parsedUrl.tld;
        } else {
            return parsedUrl.domain + '.' + parsedUrl.tld;
        }
    }
}