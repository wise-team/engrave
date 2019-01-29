var comment_vote_clicked = false;

function getLoggedInToken(){
    return localStorage.getItem('aMZr1grXqFXbiRzmOGRM');
}

$(document).ready(function () {
    let permlink = $("#permlink").val();
    let editorial = $("#editorial").val();
    
    getAndRenderComments(editorial, permlink, "#comments");
    
    $("#example_id").ionRangeSlider({
        min: 1,
        max: 100,
        type: 'single',
        postfix: "%",
        grid: true,
        grid_num: 10
    });
    
    function renderCommentsList(comments, list_id) {
    
        let ul = document.createElement('ul');
        $(ul).addClass("comments");
        $(list_id).append(ul);
    
        comments.forEach(comment => {
    
            (function(comment, ul) {
                let cmt = comment;
                let li = document.createElement('li');
                $(li).addClass('clearfix');
                $(ul).append(li);
                (function (lli, lcmt) {
                    renderComment(lcmt, false, lli);
                })(li, cmt);
    
                if (cmt.children > 0) {
    
                    (function (aa, pepe, lili) {
                        getAndRenderComments(aa, pepe, lili);
                    })(cmt.author, cmt.permlink, li);
    
                }
            })(comment, ul);
    
      
        });
    }
    
    function getAndRenderComments(author, permlink, list_id) {
    
        steem.api.getContentReplies(author, permlink, function (err, result) {
            if (!err && result) {
                if(result.length) {
                    $('#comments-empty').remove();
                }
                (function(ul) {
                    renderCommentsList(result, ul);
                })(list_id);
            }
        });
    }
    
    function renderComment(comment, voted, list_id) {
    
        var new_comment_box = document.createElement('div');
        $(new_comment_box).addClass('post-comments');
    
        var image = document.createElement('img');
        $(image).prop('src', "https://steemitimages.com/u/" + comment.author + "/avatar").addClass('avatar');
    
        $(list_id).append(image);
    
        var content = document.createElement('p');
        $(content).addClass('meta');

        $(content).append(moment(comment.created).format('LLL') + ", ");

        var authorsLink = document.createElement('a');
        $(authorsLink).prop('href', "https://steemit.com/@" + comment.author);
        $(authorsLink).append(comment.author);
    
        var created_span = document.createElement('span');
        var i = document.createElement('i');
        $(i).addClass('fa').addClass('fa-clock-o');
        $(created_span).append(i);
        $(created_span).append(moment(comment.created).format("LLL"));
    
        var comment_body = document.createElement('p');
    
        if (comment.net_rshares >= 0) {
            $(comment_body).append(marked(comment.body));
        } else {
            $(comment_body).append(comment_hidden);
        }
    
       
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
        $(span_replay).addClass('comment-action').addClass('comment-reply').append("&nbsp;&nbsp;&nbsp;&nbsp;" + btn_reply_text);
        
        var comment_action = document.createElement('i');
        $(comment_action).addClass('pull-right');
        $(comment_action).append(i_voted).append("&nbsp;").append(span_votes).append('&nbsp;&nbsp;&nbsp;&nbsp;').append(span_value);
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
        $(content).append(authorsLink);
        $(content).append(": ");
        $(content).append(comment_action);
    
        $(new_comment_box).append(content);
        $(new_comment_box).append(comment_body);

    
        $(list_id).append(new_comment_box); 

        return new_comment_box;
    
    }

    $('#loggedinModal').on('hidden.bs.modal', function () {
        comment_vote_clicked = false;
    })

    $('#comments').on('click', '.comment-vote', function (e) {

        if (getLoggedInToken()) {
            if (!comment_vote_clicked) {
                comment_vote_clicked = true;

                var comment = $(this).parent().parent();
                var comment_author = comment.find('[name="comment_author"]').val();
                var comment_permlink = comment.find('[name="comment_permlink"]').val();

                upvotePermlink = comment_permlink;
                upvoteAuthor = comment_author;
                upvoteComment = $(this).parent();

                var commentVotesCount = upvoteComment.find('[name="comment-votes"]');
                var voteIcon = upvoteComment.find('.comment-vote');
                var commentValue = upvoteComment.find('[name="comment-value"]');

                voteIcon.removeClass("fa-thumbs-up");
                voteIcon.removeClass("comment-vote");
                voteIcon.addClass("fa-spinner").addClass("fa-spin");

                $.ajax({
                    type: "POST",
                    url: "/action/vote",
                    data: { permlink: upvotePermlink, author: upvoteAuthor, weight: 10000},
                    beforeSend: function(request) {
                        request.setRequestHeader("Authorization", getLoggedInToken());
                    },
                    success: function (data) {
                        if (data.success) {
                            toastr.success(data.success);
                            commentVotesCount.text(data.net_votes);
                            commentValue.text(data.value);
                            voteIcon.addClass("fa-thumbs-up").addClass("voted");
                            voteIcon.addClass("comment-vote");
                            voteIcon.removeClass("fa-spinner").removeClass("fa-spin");

                        } else if (data.error) {
                            toastr.error(data.error);
                            voteIcon.addClass("fa-thumbs-up");
                            voteIcon.addClass("comment-vote");
                            voteIcon.removeClass("fa-spinner").removeClass("fa-spin");
                        }
                        comment_vote_clicked = false;
                    },
                    error: function (data) {
                        toastr.error("Coś poszło nie tak...");
                        voteIcon.addClass("fa-thumbs-up");
                        voteIcon.removeClass("fa-spinner").removeClass("fa-spin");
                        comment_vote_clicked = false;
                    }
                });
            }
        } else {
            toastr.error("Please login first");
        }
    });

    function appendNewComment(body, author, commentsList) {
        let newComment = renderComment({ body: body, author: author, pending_payout_value: "0.00 SBD", total_payout_value: "0.00 SBD", net_votes: 0, net_rshares: 0, created: moment() }, false, commentsList);
        $(newComment).addClass('comment-highlight');
        $('body').animate({ scrollTop: $(newComment).offset().top }, 500);
    }

    $('#comments').on('click', '.cancel', function(e) {
        const element = $(this).parent().parent().remove();
        console.log(element);
    });

    $('#comments').on('click', '.comment-reply', function (e) {
        if(getLoggedInToken()) {
            appendCommentForm(this);
        } else {
            toastr.error("Please login first");
        }
    });

    $('#comment-form').submit(function (e) {

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
                        $('#comments-empty').remove();
                        
                        var comment_list = $("#comments").children()[1];

                        appendNewComment(data.body, data.author, comment_list);
                    } else {
                        toastr.error(data.error);
                        toastr.error(data);
                        console.log(data);
                    }
                    
                    $('#comment-form').removeClass('formGrayOut');
                    $('#submit-contact').css("visibility", "visible");
                    $('#comment').css("visibility", "visible");

                },
                error: function (data) {
                    toastr.error("Coś poszło nie tak...");
                    $("#comment").val("");
                    $('#comment-form').removeClass('formGrayOut');
                    $('#submit-contact').css("visibility", "visible");
                    $('#comment').css("visibility", "visible");
                }
            });
        } else {
            toastr.error("Nie możesz wysłać pustego komentarza");
            $('#submit-contact').css("visibility", "visible");
            $('#comment').css("visibility", "visible");
            $('#comment-form').removeClass('formGrayOut');
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

                        let repliesList = $(comment).parent().find('.comments');

                        console.log(repliesList);

                        if(repliesList.length == 0) {
                            repliesList = document.createElement('ul')
                            $(repliesList).addClass("comments");
                            $(comment).parent().append(repliesList);
                        }

                        appendNewComment(data.body, data.author, repliesList);

                        box.remove();
                    } else if (data.error) {
                        console.log(data.error);
                        toastr.error(data.error);
                    }
                    box.find('[name="comment_body"]').css("visibility", "visible");
                    box.find('.submit-reply').css("visibility", "visible");
                    box.removeClass('formGrayOut');
                },
                error: function (data) {
                    toastr.error("Coś poszło nie tak...");
                    box.find('[name="comment_body"]').css("visibility", "visible");
                    box.find('.submit-reply').css("visibility", "visible");
                    box.removeClass('formGrayOut');
                }
            });
        } else {
            toastr.error("Nie możesz wysłać pustego komentarza");
        }
    });

    function appendCommentForm(element) {
        let commentBox = $(element).parent().parent().parent();
            if(!commentBox.find('.comment-reply-form').length) {
                commentBox.append('<div class="comment-reply-form"><form class="comment-reply-form2"><textarea id="comment" name="comment_body"></textarea><button type="submit" class="submit-reply">' + btn_send_reply_text + '</button><a class="cancel" id="submit-contact">Cancel</a></form></div>');
            }
    }

});
