$(document).ready(function () {

    let skip = 12;

    if($(".card-body").children().length < 12) {
          $('.load-more-button').hide();
    }

    $(".load-more-text").click(function (e) {
        e.preventDefault();

        var category = $('#category_indicator').val();
        var username = $('#author_indicator').val();

        $('.load-more-button').hide();

        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("username", username);
                request.setRequestHeader("skip", skip);

                if(category) request.setRequestHeader("category", category);
            },
            url: "/posts",

            success: function (data) {

                skip = skip + 12;

                if(data.posts) {
                    data.posts.map(function (article) {
                        const articleBox = generateNewArticleBox(article);
                        $('.card-body').append(articleBox);
                    });

                    if(data.posts.length == 12) {
                        $('.load-more-button').show();
                    }
                }
            },
            error: function (data) {
                console.log(data);
                toastr.error("Coś poszło nie tak...");
            }
        });

    });

});

function generateNewArticleBox(article) {
    console.log(article);
    const value = article.value.toFixed(2);
    return `<div class="post-preview"><a href="/${article.permlink}"><h2 class="post-title">${article.title}</h2><h3 class="post-subtitle">${article.abstract}</h3></a><p class="post-meta"><span title="${moment.utc(article.created).local().format('LLL')}">${moment.utc(article.created).local().fromNow()}</span><span>, comments: ${article.comments}</span><span>, votes: ${article.votes_count}</span><span>, reward: $${value}</span></p></div>`;
}