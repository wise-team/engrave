import blogsService from "../../services/blogs/services.blogs";
import * as _ from 'lodash';

const parseDomain = require('parse-domain');
const prohibitedSubdomains = ['beta', 'alpha', 'staging', 'demo', 'live', 'm', 'api', 'www', 'blog', 'vault', 'auth', 'api', 'dashboard'];
const prohibitedDomains = ['example.com'].concat(JSON.parse(process.env.BLOGS_DOMAINS ? process.env.BLOGS_DOMAINS : "[]"));

export async function validateAddressIsFree(url: string, blogId: string) {

    const searchDomain = buildSearchableDomain(url);

    if (_.includes(prohibitedSubdomains, parseDomain(searchDomain).subdomain)) return false;
    if (_.includes(prohibitedDomains, searchDomain)) return false;

    const blogs = await blogsService.getBlogsByDomain(url);

    if (blogs.length != 0 && blogs[0]._id != blogId) throw new Error('This address is taken');

}

function buildSearchableDomain(domain: string): string {
    let parsedUrl = parseDomain(domain);

    if (parsedUrl.subdomain != "") {
        return parsedUrl.subdomain + '.' + parsedUrl.domain + '.' + parsedUrl.tld;
    } else {
        return parsedUrl.domain + '.' + parsedUrl.tld;
    }
}