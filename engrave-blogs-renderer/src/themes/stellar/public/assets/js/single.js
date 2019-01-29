let comment_vote_clicked = false;

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

    // const power = $("#example_id").prop("value"); 

    // article voting
    $('#voting-icon').click(function (e) {
        if (getLoggedInToken()) {
            if (!comment_vote_clicked) {
                votingHandler = handleArticleVote;   
                $("#voting-power-modal").modal();
            }
        } else {
            toastr.error("Please login first");
        }
    })

    // comment voting
    $('#comments').on('click', '.comment-vote', function (e) {
        if (getLoggedInToken()) {
            if (!comment_vote_clicked) {
                votingHandler = () => { handleCommentVote(this) };   
                $("#voting-power-modal").modal();
            }
        } else {
            toastr.error("Please login first");
        }
    })

    // open comment reply form
    $('#comments').on('click', '.comment-reply', function (e) {
        if(getLoggedInToken()) {
            appendCommentForm(this);
        } else {
            toastr.error("Please login first");
        }
    });

    // close comment reply form
    $('#comments').on('click', '.cancel', function(e) {
        $(this).parent().parent().remove();
    });

    // accept voting power on modal
    $('#votingAccept').on('click', function (e) {

        votingHandler();

    });

    // submit comment
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


                        if(repliesList.length == 0) {
                            repliesList = document.createElement('ul')
                            $(repliesList).addClass("comments");
                            $(comment).parent().append(repliesList);
                        }

                        appendNewComment(data.body, data.author, repliesList);

                        box.remove();
                    } else if (data.error) {
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
});

function handleArticleVote() {
    
    $("#voting-power-modal").modal('hide');

    const power = $("#example_id").prop("value");
    const permlink = $("#permlink").val();
    const editorial = $("#editorial").val();

    if (!comment_vote_clicked) {
        comment_vote_clicked = true;
        $('#voting-icon').removeClass('fa-thumbs-up');
        $('#voting-icon').addClass('fa-spinner').addClass("fa-spin");
        $.ajax({
            type: "POST",
            url: "/action/vote",
            data: {
                permlink: permlink,
                author: editorial,
                weight: power * 100
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
                $('#voting-icon').addClass('fa-thumbs-up').addClass("voted");
                $('#voting-icon').removeClass('fa-spinner').removeClass('fa-spin');
            },
            error: function (data) {
                toastr.error("Something gone wrong...");
                comment_vote_clicked = false;
                $('#voting-icon').addClass('fa-thumbs-up');
                $('#voting-icon').removeClass('fa-spinner').removeClass('fa-spin');
            }
        });
    }
}

function handleCommentVote(comment_element) {
        
    $("#voting-power-modal").modal('hide');
    
    const power = $("#example_id").prop("value");  
    
    if (getLoggedInToken()) {
        if (!comment_vote_clicked) {
            comment_vote_clicked = true;

            var comment = $(comment_element).parent().parent();
            var comment_author = comment.find('[name="comment_author"]').val();
            var comment_permlink = comment.find('[name="comment_permlink"]').val();


            upvoteComment = $(comment_element).parent();

            var commentVotesCount = upvoteComment.find('[name="comment-votes"]');
            var voteIcon = upvoteComment.find('.comment-vote');
            var commentValue = upvoteComment.find('[name="comment-value"]');

            voteIcon.removeClass("fa-thumbs-up");
            voteIcon.removeClass("comment-vote");
            voteIcon.addClass("fa-spinner").addClass("fa-spin");

            $.ajax({
                type: "POST",
                url: "/action/vote",
                data: { permlink: comment_permlink, author: comment_author, weight: power * 100},
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
}

function appendNewComment(body, author, commentsList) {
    let newComment = renderComment({ body: body, author: author, pending_payout_value: "0.00 SBD", total_payout_value: "0.00 SBD", net_votes: 0, net_rshares: 0, created: moment() }, false, commentsList);
    $(newComment).addClass('comment-highlight');
    $('body').animate({ scrollTop: $(newComment).offset().top }, 500);
}

function appendCommentForm(element) {
    let commentBox = $(element).parent().parent();
        if(!commentBox.find('.comment-reply-form').length) {
            commentBox.append('<div class="comment-reply-form"><form class="comment-reply-form2"><textarea id="comment" name="comment_body"></textarea><button type="submit" class="submit-reply">Send reply</button><a class="cancel" id="submit-contact">Cancel</a></form></div>');
        }
}

function getLoggedInToken(){
    return localStorage.getItem('aMZr1grXqFXbiRzmOGRM');
}

function getAndRenderComments(username, permlink, target_element) {
    steem.api.getContentReplies(username, permlink, function (err, result) {
        if (!err && result) {
            if(result.length) {
                $('#comments-empty').remove();
            }
            (function(ul) {
                renderCommentsList(result, ul);
            })(target_element);
        }
    });
}

function renderCommentsList(comments, list_id) {
    
    let ul = document.createElement('ul');
    $(ul).addClass("comments").addClass('blog-level');
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

function renderComment(comment, voted, list_id) {
    
    const value = parseFloat(parseFloat(comment.pending_payout_value.replace(" SBD", "")) + parseFloat(comment.total_payout_value.replace(" SBD", ""))).toFixed(2);
    const newCommentHtml = `<img src="https://steemitimages.com/u/${comment.author}/avatar" class="avatar"><div class="post-comments"><p class="meta"><a href="https://steemit.com/@${comment.author}">@${comment.author}</a>, <span title="${moment.utc(comment.created).local().format('LLL')}">${moment.utc(comment.created).local().fromNow()}</span>: <input type="hidden" name="comment_permlink" value="${comment.permlink}"><input type="hidden" name="comment_author" value="${comment.author}"><input type="hidden" name="comment_title" value="${comment.title}"> </p><p>${marked(comment.body)}</p><p class="comment-actions"><i class="fa fa-thumbs-up comments-action comment-vote"></i>&nbsp;<span name="comment-votes">${comment.net_votes}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span name="comment-value">$${value}</span><span class="comment-action comment-reply">&nbsp;&nbsp;&nbsp;&nbsp;Reply</span></p></div>`;

    $(list_id).append(newCommentHtml); 

    return newCommentHtml;

}