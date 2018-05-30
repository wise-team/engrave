let express = require('express');
const removeMd = require('remove-markdown');
let router = express.Router();
let utils = require('../modules/utils.js');
let authors = require('../modules/authors.js');
let steem = require('steem');
var config = require('../config');
let moment = require('moment');
var showdown = require('showdown')
var converter = new showdown.Converter();
let featured_posts = require('../modules/featured.js');
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

router.get('/o-nas', (req, res, next) => {

    req.session.current_url = "o-nas";
    res.render('main/' + config.theme + '/static/about', { 
        categories: config.categories, 
        page_title: "O nas - Głodni Wiedzy", 
        user: utils.prepareLoggedUserObject(req.session), 
        featured: articles.getFeaturedPosts() 
    });
});

router.get('/jak-zarabiac', (req, res, next) => {

    req.session.current_url = "jak-zarabiac";
    res.render('main/' + config.theme + '/static/jak-zarabiac', { 
        categories: config.categories, 
        page_title: "Jak zarabiać - Głodni Wiedzy", 
        user: utils.prepareLoggedUserObject(req.session), 
        featured: articles.getFeaturedPosts() 
    });
});

router.get('/kontakt', (req, res, next) => {

    req.session.current_url = "kontakt";
    res.render('main/' + config.theme + '/static/contact', { 
        categories: config.categories, 
        page_title: "Kontakt - Głodni Wiedzy",
        user: utils.prepareLoggedUserObject(req.session), 
        featured: articles.getFeaturedPosts() 
    });
});

router.get('/', (req, res, next) => {

    req.session.current_url = null;

    let category = {};
    category.latest = articles.getArticlesByCategory(null, config.category_articles_quantity);
    category.featured = articles.getFeaturedPosts();
    category.user = utils.prepareLoggedUserObject(req.session);
    category.category = "/";
    category.page_title = config.website_title + " - " + config.website_slogan;
    
    res.render('main/' + config.theme + '/index', category);
});

router.get('/favicon.ico', (req, res) => {
    // console.log("Favicona bedzie pozniej!");
});

router.get('/kategoria/:category', (req, res) => {

    if (utils.isCategoryValid(req.params.category)) {
        req.session.current_url = 'kategoria/' + req.params.category.replace("pl-", "");

        let category = {};
        category.latest = articles.getArticlesByCategory(req.params.category, config.category_articles_quantity);
        category.user = utils.prepareLoggedUserObject(req.session);
        category.category = req.params.category;
        category.page_title = utils.categoryGetFullName(req.params.category) + " - " + config.website_title;
        res.render('main/' + config.theme + '/category', category);
    } else {
        res.redirect('/'); 
    }
});

router.get('/:permlink', (req, res, next) => {
    req.session.current_url = req.params.permlink;

    articles.getArticleWithPermlink(req.params.permlink, function (art) {
        if (art) {
            art.user = utils.prepareLoggedUserObject(req.session);
            art.featured = articles.getFeaturedPosts();
            res.render('main/' + config.theme + '/single', art);
        } else {
            res.render('main/' + config.theme + '/404', { featured: articles.getFeaturedPosts(), page_title: "Nie znaleziono - " + config.website_title });
        }
    });

});

router.get('/autor/:author', (req, res, next) => {

    req.session.current_url = 'autor/' + req.params.author;

    if (authors.getAuthorDetails(req.params.author)) {
        let authorListing = {};
        authorListing.latest = articles.getArticlesByAuthor(req.params.author, config.category_articles_quantity);
        authorListing.user = utils.prepareLoggedUserObject(req.session);
        authorListing.author = authors.getAuthorDetails(req.params.author)
        let page_title = req.params.author;
        if (authorListing.author.name) {
            page_title = authorListing.author.name;
            if (authorListing.author.surname) {
                page_title += ' ' + authorListing.author.surname;
            }
        }        

        authorListing.page_title = page_title + " - " + config.website_title;
        res.render('main/' + config.theme + '/author', authorListing);
    } else {
        res.redirect('/'); 
    }
});

module.exports = router;