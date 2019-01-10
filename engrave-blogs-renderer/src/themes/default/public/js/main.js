toastr.options.positionClass = "toast-bottom-right";

$(document).ready(function () {

    let skip = 12;
    var username = $('#author_indicator').val();
    if($("#posts").children().length < 12) {
        $('.center-button').hide();
    }

    $(".load-more").click(function (e) {
        e.preventDefault();
        
        var category = $('#category_indicator').val();
    
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
                    data.posts.map(function (post) {
                        var x = document.createElement('div');
                        $(x).addClass('col-lg-4').addClass('col-md-6');
                        $(x).append(generateNewPostInfo(post));
                        $('#posts').append(x);
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

function generateNewPostInfo(post) {
    var username = $('#author_indicator').val();

    var new_post_div = document.createElement('div');
    $(new_post_div).addClass('news-post').addClass('standart-post');
    
    var post_image = document.createElement('div');
    $(post_image).addClass('post-image');
    
    var a_image = document.createElement('a');
    $(a_image).prop('href', '/' + post.permlink);
    

    var a_category = document.createElement('a');
    $(a_category).addClass('category');
    $(a_category).addClass('category-' + post.category.slug);
    $(a_category).prop('href', '/category/' + post.category.slug);
    $(a_category).html(post.category.name);

    var image = document.createElement('img');

    $(image).prop('src', post.thumbnail ? post.thumbnail : '/img/default.jpg');
    
    $(a_image).html(image);
    $(post_image).append(a_image);
    $(post_image).append(a_category);

    var a_title = document.createElement('a');
    $(a_title).prop('href', '/' + post.permlink);
    $(a_title).html(post.title);
    
    var h2 = document.createElement('h2');
    $(h2).append(a_title);

    var ul = document.createElement('ul');
    $(ul).addClass('post-tags');

    var li1 = document.createElement('li');
    var i1 = document.createElement('i');
    $(i1).addClass('lnr').addClass('lnr-user')

    $(li1).append(i1);
    $(li1).append("@");
    $(li1).append(username); 
    

    var li2 = document.createElement('li');
    var a_comments = document.createElement('a');
    $(a_comments).prop('href', '/' + post.permlink + '#comments');
    var i2 = document.createElement('i');
    $(i2).addClass('lnr').addClass('lnr-bubble');
    var span = document.createElement('span');
    $(span).html(post.comments);
    $(a_comments).append(i2).append(span);
    $(li2).append(a_comments);

    var li3 = document.createElement('li');
    var i3 = document.createElement('i');
    $(i3).addClass('lnr').addClass('lnr-thumbs-up');
    $(li3).append(i3);
    $(li3).append(post.votes_count);

    var li4 = document.createElement('li');
    var i4 = document.createElement('i');
    $(i4).addClass('lnr').addClass('lnr-diamond');
    $(li4).append(i4);
    $(li4).append('$');
    $(li4).append(post.value.toFixed(2));

    $(ul).append(li1);
    $(ul).append(li2);
    $(ul).append(li3);
    $(ul).append(li4);

    ////

    var p = document.createElement('p');
    $(p).html(post.abstract);

    $(new_post_div).append(post_image);
    $(new_post_div).append(h2);
    $(new_post_div).append(ul);
    $(new_post_div).append(p);
    
    return new_post_div;

}