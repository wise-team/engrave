$(document).ready(function () {

    let blogsCounter = 12;
    let articlesCounter = 12;

    $('#load-more').click(function (e) {

        $.ajax({
            type: "POST",
            url: "/explore/blogs",
            data: {
                skip: blogsCounter
            },
            success: function (data) {
                data.blogs.forEach((blog) => {
                    renderBlog(blog);
                }); 
               blogsCounter+= 12;
            },
            error: function (data) {
                $.notify({
                    icon: "nc-icon nc-fav-remove",
                    message: "Something went wrong. Try again"
                }, {
                    type: 'danger',
                    timer: 8000,
                    spacing: 15,
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
            }
        });
    });

    $('#load-more-articles').click(function (e) {

        $.ajax({
            type: "POST",
            url: "/explore/articles",
            data: {
                skip: articlesCounter
            },
            success: function (data) {
                data.articles.forEach((article) => {
                    renderArticle(article);
                }); 
               articlesCounter+= 12;
            },
            error: function (data) {
                $.notify({
                    icon: "nc-icon nc-fav-remove",
                    message: "Something went wrong. Try again"
                }, {
                    type: 'danger',
                    timer: 8000,
                    spacing: 15,
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
            }
        });
    });

    function renderBlog(blog) {
        const newBlogDOM = `<div class="col-xl-3 col-lg-6"><div class="row"><div class="col-2"><i class="fa fa-globe fa-2x mb-1 indigo-text" aria-hidden="true"></i></div><div class="col-10 mb-2 pl-3"><h5 class="feature-title font-bold mb-1">${blog.blog_title}</h5><p class="grey-text mt-2">${blog.blog_slogan}</p><p class="grey-text mt-2"><a href="https://${blog.domain}">${blog.domain}</a></p></div></div></div>`
        const html = $.parseHTML(newBlogDOM);
        $('#blog-list').append(html);
    }
    
    function renderArticle(article) {
        const newArticleDOM = `<div class="col-lg-4 col-md-6 mb-4"><div class="card"><div class="article-image"><a href="${article.engrave_permlink}"><img class="card-img-top" src="${article.image}" title="${article.title}" style=""></a></div><div class="card-body text-center"><a href="${article.engrave_permlink}"><h4 class="card-title">${article.title}</h4></a><h6>@${article.steem_username}</h6><p class="card-text">${article.body.substr(0,240)}...</p><p class="card-text"><a href="${article.steemit_permlink}"><img class="steemit" src="/img/steemit-icon.png"></a></p></div></div></div>`
        const html = $.parseHTML(newArticleDOM);
        $('#articles-list').append(html);
    }

});