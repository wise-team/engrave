let sm = require('sitemap');
let Articles = require('../models/articles.js');
var cfg = require('../config');
let moment = require('moment');

let sitemap = sm.createSitemap({
    hostname: 'https://' + cfg.get_config().domain,
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
        { url: '/', changefreq: 'daily', priority: 0.9 }
    ]
});

exports.addUrl = (url, image, created) => {
    sitemap.add({ url: "/" + url, img: image, lastmodISO: moment(created).toISOString(), priority: 0.9});
    sitemap.clearCache();
};

exports.initialize = () => {
    console.log("Sitemap module initialized");

    cfg.get_config().categories.forEach(category => {
        sitemap.add({ url: "/category/" + category.slug, priority: 0.9});
    });

};

exports.sitemap = () => {
    return sitemap;
};