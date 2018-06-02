let sm = require('sitemap');
let Articles = require('../models/articles.js');
var config = require('../config').get_config();
let moment = require('moment');

let sitemap = sm.createSitemap({
    hostname: 'https://' + config.domain,
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
        { url: '/', changefreq: 'daily', priority: 0.9 },
        { url: '/o-nas/', changefreq: 'monthly', priority: 0.5 },
        { url: '/kontakt', changefreq: 'monthly', priority: 0.5 }
    ]
});

exports.addUrl = (url, image) => {
    sitemap.add({ url: "/" + url, img: image, lastmodISO: moment().toISOString(), priority: 0.9});
    sitemap.clearCache();
};

exports.initialize = () => {
    console.log("Sitemap module initialized");

    config.categories.forEach(category => {
        sitemap.add({ url: "/kategoria/" + category.slug, priority: 0.9});
    });

    Articles.find({status: "approved"}, function (err, articles) {
        if(err) {
            console.log(err);
        } else if (articles) {
            articles.map(function (article) {
                sitemap.add({ url: "/" + article.permlink, img: article.image, lastmodISO: moment(article.date).toISOString(), priority: 0.5});
            })
        }
    })

};

exports.sitemap = () => {
    return sitemap;
};