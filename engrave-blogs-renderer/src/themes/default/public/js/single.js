var comment_vote_clicked = false;
let loggedInUser = null;

let upvotePermlink = null;
let upvoteAuthor = null;
let upvoteComment = null;

let votingHandler = handleCommentVote;

function getLoggedInToken(){
    return localStorage.getItem('aMZr1grXqFXbiRzmOGRM');
}

$(document).ready(function () {

    loggedInUser = $('#logged_user').val();

    $("#example_id").ionRangeSlider({
        min: 1,
        max: 100,
        type: 'single',
        postfix: "%",
        grid: true,
        grid_num: 10
    });

    $('#votingAccept').on('click', function (e) {

        votingHandler();

    });

    $('#comments').on('click', '.cancel', function(e) {
        const element = $(this).parent().parent().remove();
    });

    $('#comments').on('click', '.comment-vote', function (e) {

        if (getLoggedInToken()) {
            if (!comment_vote_clicked) {

                var comment = $(this).parent().parent();
                var comment_author = comment.find('[name="comment_author"]').val();
                var comment_permlink = comment.find('[name="comment_permlink"]').val();

                upvotePermlink = comment_permlink;
                upvoteAuthor = comment_author;
                upvoteComment = $(this).parent();

                votingHandler = handleCommentVote;

                $("#loggedinModal").modal();
            }
        } else {
            toastr.error('You must login first');
        }
            
    });


    $('#comments').on('click', '.comment-reply', function (e) {
        if (getLoggedInToken()) {
            let commentBox = $(this).parent().parent();
            if(!commentBox.find('.comment-reply-form').length) {
                commentBox.append('<div class="comment-reply-form"><form class="comment-reply-form2"><textarea id="comment" name="comment_body"></textarea><button type="submit" class="submit-reply"><i class="fa fa-comment"></i>Send reply</button><a class="btn cancel" id="submit-contact">Cancel</a></form></div>');
            }
        } else {
            toastr.error('You must login first');
        }
    });

    $('#comments').on('submit', '.comment-reply-form2', function (e) {

        e.preventDefault();
        var box = $(this);
        var comment = $(this).parent().parent();
        var comment_author = comment.find('[name="comment_author"]').val();
        var comment_permlink = comment.find('[name="comment_permlink"]').val();
        var comment_title = comment.find('[name="comment_title"]').val();

        let reply_data = {};
        reply_data.body = $(this).find('[name="comment_body"]').val();
        reply_data.parent_author = comment_author;
        reply_data.parent_permlink = comment_permlink;
        reply_data.parent_title = comment_title;


        if (reply_data.comment_body != "") {
            $(this).find('[name="comment_body"]').css("visibility", "hidden");
            $(this).find('.submit-reply').css("visibility", "hidden");
            $(this).addClass('formGrayOut');

            $.ajax({
                type: "POST",
                url: "/action/comment",
                data: reply_data,
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", getLoggedInToken());
                },
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);
                        
                        let repliesList = $(comment).parent().find('.comment-tree');


                        if(repliesList.length == 0) {
                            repliesList = document.createElement('ul')
                            $(repliesList).addClass("comment-tree");
                            $(comment).parent().parent().append(repliesList);
                        }

                        appendNewComment(data.body, data.author, repliesList);
                        
                        box.remove();
                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                    $(this).removeClass('formGrayOut');
                },
                error: function (data) {
                    showResponseError(data);
                    box.removeClass('formGrayOut');
                }
            });
        } else {
            toastr.error("You can't send empty comment");
        }

        

    });
    

    $(".text-boxes img").each(function () {
        var imageCaption = $(this).attr("alt");
        if (imageCaption != '') {
            var imgWidth = $(this).width();
            var imgHeight = $(this).height();
            var position = $(this).position();
            var positionTop = (position.top + imgHeight - 26)
            $("<span class='img-caption'><em>" + imageCaption +
                "</em></span>").css({
                    "width": "100%"
                }).insertAfter(this);
        }
    });

    let permlink = $("#permlink").val();
    let editorial = $("#editorial").val();

    get_content_replies(editorial, permlink, "#comments");

    $('#voting-icon').click(function (e) {

        if (getLoggedInToken()) {

            if (!comment_vote_clicked) {

                votingHandler = handleArticleVote;

                $("#loggedinModal").modal();
            }
        } else {
            toastr.error("You must login first");
        }
        
    })

    // submit main comment form!
    $('#comment-form').submit(function (e) {

        e.preventDefault();


        e.preventDefault();
        $('#submit-contact').css("visibility", "hidden");
        $('#comment').css("visibility", "hidden");
        $('#comment-form').addClass('formGrayOut');

        if ($("#comment").val() != "") {
            var post_data = $(this).serialize();
            $("#comment").val("");
            $("#parent_author").val("");

            $.ajax({
                type: "POST",
                url: "/action/comment",
                data: post_data,
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", getLoggedInToken());
                },
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);
                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                    $('#comment-form').removeClass('formGrayOut');
                    $('#submit-contact').css("visibility", "visible");
                    $('#comment').css("visibility", "visible");

                    var comment_list = $("#comments").children()[1];

                    appendNewComment(data.body, data.author, comment_list);

                },
                error: function (data) {
                    showResponseError(data);
                    $('#comment-form').removeClass('formGrayOut');
                    $('#submit-contact').css("visibility", "visible");
                    $('#comment').css("visibility", "visible");
                }
            });
        } else {
            toastr.error("You can't send empty comment");
            $('#submit-contact').css("visibility", "visible");
            $('#comment').css("visibility", "visible");
            $('#comment-form').removeClass('formGrayOut');
        }
    });

});

function renderCommentsList(comments, list_id) {
    
    let ul = document.createElement('ul');
    $(ul).addClass("comment-tree");
    $(list_id).append(ul);

    comments.forEach(comment => {

        (function(comment, ul) {
            let cmt = comment;
            let li = document.createElement('li');
            $(ul).append(li);

            (function (lli, lcmt) {
                renderComment(lcmt, false, lli);
            })(li, cmt);

            if (cmt.children > 0) {

                (function (aa, pepe, lili) {
                    get_content_replies(aa, pepe, lili);
                })(cmt.author, cmt.permlink, li);

            }
        })(comment, ul);

  
    });
}

function get_content_replies(author, permlink, list_id) {
    
    steem.api.getContentReplies(author, permlink, function (err, result) {
        if (!err && result) {
            (function(ul) {
                renderCommentsList(result, ul);
            })(list_id);
        }
    });
}

function appendNewComment(body, author, commentsList) {
    let li = document.createElement('li');
    let newComment = renderComment({ body: body, author: author, pending_payout_value: "0.00 SBD", total_payout_value: "0.00 SBD", net_votes: 0, net_rshares: 0, created: moment() }, false, li);
    $(newComment).addClass('comment-highlight');
    $(commentsList).append(li);
    $('html, body').animate({ scrollTop: $(newComment).offset().top - 500 }, 500);
}

function renderComment(comment, voted, list_id) {


    var new_comment_box = document.createElement('div');
    $(new_comment_box).addClass('comment-box');

    var image = document.createElement('img');
    $(image).prop('src', "https://steemitimages.com/u/" + comment.author + "/avatar");

    $(new_comment_box).append(image);

    var content = document.createElement('div');
    $(content).addClass('comment-content');

    var h4 = document.createElement('h4');
    $(h4).append(comment.author);

    var span = document.createElement('span');
    var i = document.createElement('i');
    $(i).addClass('fa').addClass('fa-clock-o');
    $(span).append(i);
    // $(span).append(comment.created);
    $(span).append(moment.utc(comment.created).local().fromNow());

    var comment_body = document.createElement('p');

    if (comment.net_rshares >= 0) {
        $(comment_body).append(marked(comment.body));
    } else {
        $(comment_body).append('Comment hidden due to low rating');
    }
    

    var comment_action = document.createElement('div');
    $(comment_action).addClass('comment-action');
    var i_voted = document.createElement('i');
    $(i_voted).addClass('fa').addClass('fa-thumbs-up').addClass('comments-action').addClass('comment-vote');

    if (voted) {
        $(i_voted).addClass('voted');
    }

    var span_votes = document.createElement('span');
    $(span_votes).attr('name', "comment-votes").append(comment.net_votes);

    let value = parseFloat(parseFloat(comment.pending_payout_value.replace(" SBD", "")) + parseFloat(comment.total_payout_value.replace(" SBD", ""))).toFixed(2);
    var span_value = document.createElement('span');
    $(span_value).attr('name', "comment-value").append('$').append(value);

    var span_replay = document.createElement('span');
    $(span_replay).addClass('comment-action').addClass('comment-reply').append("&nbsp;&nbsp;&nbsp;&nbsp;Reply");

    $(comment_action).append(i_voted).append("&nbsp;").append(span_votes).append('&nbsp;&nbsp;&nbsp;&nbsp;').append(span_value).append(span_replay);

    let hidden_permlink = document.createElement('input');
    $(hidden_permlink).attr('type', 'hidden').attr('name', 'comment_permlink').attr('value', comment.permlink);
    let hidden_author = document.createElement('input');
    $(hidden_author).attr('type', 'hidden').attr('name', 'comment_author').attr('value', comment.author);
    let hidden_title = document.createElement('input');
    $(hidden_title).attr('type', 'hidden').attr('name', 'comment_title').attr('value', comment.title);

    $(content).append(hidden_permlink);
    $(content).append(hidden_author);
    $(content).append(hidden_title);
    $(content).append(h4);
    $(content).append(span);
    $(content).append(comment_body);
    $(content).append(comment_action);

    $(new_comment_box).append(content);

    $(list_id).append(new_comment_box); 

    return new_comment_box;

}

function handleCommentVote() {
    $("#loggedinModal").modal('hide');

    let power = $("#example_id").prop("value");

    var votes = upvoteComment.find('[name="comment-votes"]');
    var tetet = upvoteComment.find('.comment-vote');
    var value = upvoteComment.find('[name="comment-value"]');

    tetet.removeClass("fa-thumbs-up");
    tetet.removeClass("comment-vote");
    tetet.addClass("fa-spinner").addClass("fa-spin");

    comment_vote_clicked = true;

    $.ajax({
        type: "POST",
        url: "/action/vote",
        data: { permlink: upvotePermlink, author: upvoteAuthor, weight: power * 100},
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", getLoggedInToken());
        },
        success: function (data) {
            if (data.success) {
                toastr.success(data.success);
                votes.text(data.net_votes);
                value.text(data.value);
                tetet.addClass("fa-thumbs-up").addClass("voted");
                tetet.addClass("comment-vote");
                tetet.removeClass("fa-spinner").removeClass("fa-spin");

            } else if (data.error) {
                toastr.error(data.error);
                tetet.addClass("fa-thumbs-up");
                tetet.addClass("comment-vote");
                tetet.removeClass("fa-spinner").removeClass("fa-spin");
            }
            comment_vote_clicked = false;
        },
        error: function (data) {
            showResponseError(data);
            tetet.addClass("fa-thumbs-up");
            tetet.addClass("comment-vote");
            tetet.removeClass("fa-spinner").removeClass("fa-spin");
            comment_vote_clicked = false;
        }
    });
}

function handleArticleVote() {
    
    $("#loggedinModal").modal('hide');
    
    let permlink = $("#permlink").val();
    let editorial = $("#editorial").val();

    if (!comment_vote_clicked) {
        comment_vote_clicked = true;
        $('#voting-icon').removeClass('lnr-thumbs-up');
        $('#voting-icon').addClass('fa').addClass('fa-spinner').addClass("fa-spin");
        $.ajax({
            type: "POST",
            url: "/action/vote",
            data: {
                permlink: permlink,
                author: editorial,
                weight: 10000
            },
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", getLoggedInToken());
            },
            success: function (data) {
                if (data.success) {
                    toastr.success(data.success);
                    $('#voting-counter').text(data.net_votes);
                    $('#voting-value').text("$" + data.value);
                } else if (data.error) {
                    toastr.error(data.error);
                }
                comment_vote_clicked = false;
                $('#voting-icon').addClass('lnr-thumbs-up').addClass("voted");
                $('#voting-icon').removeClass('fa').removeClass('fa-spinner').removeClass('fa-spin');
            },
            error: function (data) {
                showResponseError(data);
                comment_vote_clicked = false;
                $('#voting-icon').addClass('lnr-thumbs-up');
                $('#voting-icon').removeClass('fa').removeClass('fa-spinner').removeClass('fa-spin');
            }
        });
    }
}


function showResponseError(response) {
    if(response.responseJSON.error) {
        toastr.error(response.responseJSON.error);
    } else {
        toastr.error("Something gone wrong...");
    }
}