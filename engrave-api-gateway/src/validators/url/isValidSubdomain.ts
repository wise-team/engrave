import * as _ from 'lodash';
const parseDomain = require('parse-domain');
const domains = JSON.parse(process.env.BLOGS_DOMAINS ? process.env.BLOGS_DOMAINS : "[]");

export async function isValidSubdomain(url: any) {
   
    try {
    
        const {subdomain, domain, tld} = parseDomain(url);
        
        if(!subdomain) return false;

        if (_.includes(domains, `${domain}.${tld}` )) return true;
        
        return false;
        
    } catch (error) {
        return false;
    }
   
    
}