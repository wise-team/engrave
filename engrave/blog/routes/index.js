let express = require('express');
let router = express.Router();
let utils = require('../modules/utils.js');
let authors = require('../modules/authors.js');
var cfg = require('../config');
let articles = require('../modules/articles.js');
let sitemap = require('../modules/sitemap');

router.get('/sitemap.xml', (req, res, next) => {

    let sm = sitemap.sitemap();

    sm.toXML(function (err, xml) {
        if (err) {
            return res.status(500).end();
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
});

router.get('/', (req, res, next) => {

    req.session.current_url = null;

    let category = {};
    category.latest = articles.getArticlesByCategory(null, cfg.get_config().posts_per_category_page);
    category.featured = articles.getFeaturedPosts();
    category.user = utils.prepareLoggedUserObject(req.session);
    category.category = "/";
    category.page_title = cfg.get_config().blog_title + " - " + cfg.get_config().blog_slogan;
    
    res.render('main/' + cfg.get_config().theme + '/theme/index', category);
});

router.get('/favicon.ico', (req, res) => {
    // console.log("Favicona bedzie pozniej!");
});

router.get('/kategoria/:category', (req, res) => {
    if(cfg.get_config().frontpage_language == 'pl') {
        handleCategoryRoute(req, res);
    } else {
        res.redirect('/category/' + req.params.category)
    }
});

router.get('/category/:category', (req, res) => {
    if(cfg.get_config().frontpage_language == 'en') {
        handleCategoryRoute(req, res);
    } else {
        res.redirect('/kategoria/' + req.params.category)
    }
});

router.get('/:permlink', (req, res, next) => {
    req.session.current_url = req.params.permlink;

    articles.getArticleWithPermlink(req.params.permlink, function (art) {
        if (art) {
            art.user = utils.prepareLoggedUserObject(req.session);
            art.featured = articles.getFeaturedPosts();
            res.render('main/' + cfg.get_config().theme + '/theme/single', art);
        } else {
            res.render('main/' + cfg.get_config().theme + '/theme/404', { featured: articles.getFeaturedPosts(), page_title: "Nie znaleziono - " + cfg.get_config().blog_title });
        }
    });

});

router.get('/autor/:author', (req, res, next) => {
    if(cfg.get_config().frontpage_language == 'pl') {
        handleAuthorRoute(req, res);
    } else {
        res.redirect('/author/' + req.params.author)
    }
});

router.get('/author/:author', (req, res, next) => {
    if(cfg.get_config().frontpage_language == 'en') {
        handleAuthorRoute(req, res);
    } else {
        res.redirect('/autor/' + req.params.author)
    }
});

router.post('/settings/refresh', (req, res) => {
    cfg.refresh_config(() => {
        res.json({status: "OK"});
    });
});

handleCategoryRoute = (req, res) => {
    if (utils.isCategoryValid(req.params.category)) {
        req.session.current_url = 'kategoria/' + req.params.category.replace("pl-", "");

        let category = {};
        category.latest = articles.getArticlesByCategory(req.params.category, cfg.get_config().posts_per_category_page);
        category.user = utils.prepareLoggedUserObject(req.session);
        category.category = req.params.category;
        category.category_fullname = utils.getCategoryFullName(req.params.category);
        category.page_title = utils.getCategoryFullName(req.params.category) + " - " + cfg.get_config().blog_title;
        res.render('main/' + cfg.get_config().theme + '/theme/category', category);
    } else {
        res.redirect('/'); 
    }
}

handleAuthorRoute = (req, res) => {
    req.session.current_url = 'autor/' + req.params.author;

    if (authors.getAuthorDetails(req.params.author)) {
        let authorListing = {};
        authorListing.latest = articles.getArticlesByAuthor(req.params.author, cfg.get_config().posts_per_category_page);
        authorListing.user = utils.prepareLoggedUserObject(req.session);
        authorListing.author = authors.getAuthorDetails(req.params.author)
        let page_title = req.params.author;
        if (authorListing.author.name) {
            page_title = authorListing.author.name;
            if (authorListing.author.surname) {
                page_title += ' ' + authorListing.author.surname;
            }
        }        

        authorListing.page_title = page_title + " - " + cfg.get_config().blog_title;
        res.render('main/' + cfg.get_config().theme + '/theme/author', authorListing);
    } else {
        res.redirect('/'); 
    }
}

module.exports = router;