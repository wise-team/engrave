import * as fs from 'fs';
import rebuildSitemap from './rebuildSitemap';

export default async (domain: string, username: string) => {

    const file = `/app/sitemaps/${domain}/sitemap.xml`;
    
    if(fs.existsSync(file)) {
        const xml = fs.readFileSync(file);
        return xml;
    } else {
        const xml = await rebuildSitemap(domain, username);
        return xml;
    }
    
}