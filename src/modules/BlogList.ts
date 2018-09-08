import { Blogs } from './../database/BlogsModel';
let parseDomain = require('parse-domain');

export class BlogListModule {
    /**
     * Check if blog is registerd on Engrave system to prevent from using Engrave Steemconnect App to get SC2 token without registering own app
     * @param domain domain with or without http or https
     */
    static async IsBlogRegistered(domain: string) {
        try {
            let parsedUrl = parseDomain(domain);
            let searchDomain = "";
            if (parsedUrl.subdomain != "") {
                searchDomain = parsedUrl.subdomain + '.' + parsedUrl.domain + '.' + parsedUrl.tld;
            } else {
                searchDomain = parsedUrl.domain + '.' + parsedUrl.tld;
            }
            let blog = await Blogs.findOne({ domain: searchDomain });

            if (blog) return true;
            else return false;

        } catch (error) {
            return false;
        }
    }

    /**
     * Get all registerd blogs as domains array
     */
    static async listAllBlogDomains() {
        let blogList: string[] = [];
        let blogs = await Blogs.find({}, {domain: 1});
        for(let blog of blogs) {
            blogList.push(blog.domain);
        }
        return blogList;
    }

}