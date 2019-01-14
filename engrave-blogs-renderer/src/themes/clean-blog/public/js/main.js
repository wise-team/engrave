$(document).ready(function () {

    let skip = 12;

    if($("#posts").children().length < 12) {
        $('.center-button').hide();
    }

    $("#load-more").click(function (e) {
        e.preventDefault();
        
        var category = $('#category_indicator').val();
        var username = $('#author_indicator').val();
    
        $('.center-button').hide();

        $.ajax({
            type: "GET",
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
                        $('#posts').append(articleBox);
                    });

                    if(data.posts.length == 12) {
                        $('.center-button').show();
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
    return `<div class="post-preview"><a href="/${article.permlink}"><h2 class="post-title">${article.title}</h2><h3 class="post-subtitle">${article.abstract}</h3></a><p class="post-meta"><span title="${moment.utc(article.created).local().format('LLL')}">${moment.utc(article.created).local().fromNow()}</span><span>, comments: ${article.comments}</span><span>, votes: ${article.votes_count}</span><span>, reward: $0.00</span></p></div>`;
}