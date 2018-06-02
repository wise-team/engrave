toastr.options.positionClass = "toast-bottom-right";

$(document).ready(function () {

    $(".load-more").click(function (e) {
        e.preventDefault();
        
        var last_permlink = $($('.news-post').last().children()[0]).children()[0].getAttribute("href");
        var category = $('#category_indicator').val();
        var author = $('#author_indicator').val();
       
        $('.center-button').hide();

        $.ajax({
            type: "POST",
            url: "/action/more",
            data: { start_permlink: last_permlink, category: category, author: author},
            success: function (data) {
                if (data.error) {
                    toastr.error("Coś poszło nei tak");
                } else {
                    if(data.more) {
                        data.more.map(function (post) {
                            var x = document.createElement('div');
                            $(x).addClass('col-lg-4').addClass('col-md-6');
                            $(x).append(generateNewPostInfo(post));
                            $('#posts').append(x);
                        });

                        $('.center-button').show();
                    }
                }
                 // TODO disable and enable load more button
            },
            error: function (data) {
                toastr.error("Coś poszło nie tak...");
            }
        });

    });

});

function generateNewPostInfo(post) {
    var new_post_div = document.createElement('div');
    $(new_post_div).addClass('news-post').addClass('standart-post');
    
    var post_image = document.createElement('div');
    $(post_image).addClass('post-image');
    
    var a_image = document.createElement('a');
    $(a_image).prop('href', '/' + post.url);
    

    var a_category = document.createElement('a');
    $(a_category).addClass('category');
    $(a_category).addClass('category-' + post.category);
    $(a_category).prop('href', '/kategoria/' + post.category);
    $(a_category).html(post.category_fullname);

    var image = document.createElement('img');
    $(image).prop('src', post.image);
    
    $(a_image).html(image);
    $(post_image).append(a_image);
    $(post_image).append(a_category);

    var a_title = document.createElement('a');
    $(a_title).prop('href', '/' + post.url);
    $(a_title).html(post.title);
    
    var h2 = document.createElement('h2');
    $(h2).append(a_title);

    var ul = document.createElement('ul');
    $(ul).addClass('post-tags');

    var li1 = document.createElement('li');
    var i1 = document.createElement('i');
    $(i1).addClass('lnr').addClass('lnr-user')
    var a_root_author = document.createElement('a');

    let author_text = post.root_author;
    
    if (post.author.name) {
        author_text = post.author.name;
    }
    if (post.author.name && post.author.surname) {
        author_text = post.author.name + ' ' + post.author.surname;
    }

    $(a_root_author).prop('href', '/autor/' + post.root_author).html(author_text);
    $(li1).append(i1);
    $(li1).append("autor ");
    $(li1).append(a_root_author); 
    

    var li2 = document.createElement('li');
    var a_comments = document.createElement('a');
    $(a_comments).prop('href', '/' + post.url + '#comments');
    var i2 = document.createElement('i');
    $(i2).addClass('lnr').addClass('lnr-bubble');
    var span = document.createElement('span');
    $(span).html(post.comments_quantity);
    $(a_comments).append(i2).append(span);
    $(li2).append(a_comments);

    var li3 = document.createElement('li');
    var i3 = document.createElement('i');
    $(i3).addClass('lnr').addClass('lnr-thumbs-up');
    $(li3).append(i3);
    $(li3).append(post.net_votes);

    var li4 = document.createElement('li');
    var i4 = document.createElement('i');
    $(i4).addClass('lnr').addClass('lnr-diamond');
    $(li4).append(i4);
    $(li4).append('$');
    $(li4).append(post.value);

    $(ul).append(li1);
    $(ul).append(li2);
    $(ul).append(li3);
    $(ul).append(li4);

    ////

    var p = document.createElement('p');
    $(p).html(post.body_abbr);

    $(new_post_div).append(post_image);
    $(new_post_div).append(h2);
    $(new_post_div).append(ul);
    $(new_post_div).append(p);
    
    return new_post_div;

}