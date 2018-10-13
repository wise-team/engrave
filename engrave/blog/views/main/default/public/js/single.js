
//todo ukrywanie komentarzy z net_rshares < 0
// TODO pojawianie sie dodanego komentarza na stronie!
// przewijanie do komentarza
// zaznaczanie, ze komentarz jest nowy, jakis active border

var comment_vote_clicked = false;
let loggedInUser = null;

let upvotePermlink = null;
let upvoteAuthor = null;
let upvoteComment = null;

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

    moment.locale('pl');

    $('#votingAccept').on('click', function (e) {
        $("#loggedinModal").modal('hide');

        let power = $("#example_id").prop("value");

        console.log(power);

        var votes = upvoteComment.find('[name="comment-votes"]');
        var tetet = upvoteComment.find('.comment-vote');
        var value = upvoteComment.find('[name="comment-value"]');

        tetet.removeClass("fa-thumbs-up");
        tetet.removeClass("comment-vote");
        tetet.addClass("fa-spinner").addClass("fa-spin");

        $.ajax({
            type: "POST",
            url: "/action/comment-vote",
            data: { comment_permlink: upvotePermlink, comment_author: upvoteAuthor, power: power},
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
                toastr.error("Coś poszło nie tak...");
                tetet.addClass("fa-thumbs-up");
                tetet.removeClass("fa-spinner").removeClass("fa-spin");
                comment_vote_clicked = false;
            }
        });

    });

    // $('#loggedinModal').on('show.bs.modal', function (event) {
    //     // var button = $(event.relatedTarget) // Button that triggered the modal

    //     // console.log(button);

    //     // var recipient = button.data('whatever') // Extract info from data-* attributes
    //     // // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    //     // // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    //     // var modal = $(this)
    //     // modal.find('.modal-title').text('New message to ' + recipient)
    //     // modal.find('.modal-body input').val(recipient)
    // })

    $('#comments').on('click', '.comment-vote', function (e) {

        if (loggedInUser) {
            if (!comment_vote_clicked) {
                comment_vote_clicked = true;

                var comment = $(this).parent().parent();
                var comment_author = comment.find('[name="comment_author"]').val();
                var comment_permlink = comment.find('[name="comment_permlink"]').val();

                upvotePermlink = comment_permlink;
                upvoteAuthor = comment_author;
                upvoteComment = $(this).parent();


                $("#loggedinModal").modal();
            }
        } else {
            $("#loggedoutModal").modal();
        }
            
    });


    $('#comments').on('click', '.comment-reply', function (e) {
        if (loggedInUser) {
            let commentBox = $(this).parent().parent();
            if(!commentBox.find('.comment-reply-form').length) {
                commentBox.append('<div class="comment-reply-form"><form class="comment-reply-form2"><textarea id="comment" name="comment_body"></textarea><button type="submit" class="submit-reply"><i class="fa fa-comment"></i>Wyślij odpowiedź</button></form></div>');
            }
        } else {
            $("#loggedoutModal").modal();
        }
    });

    $('#comments').on('submit', '.comment-reply-form2', function (e) {

        e.preventDefault();
        var box = $(this);
        var comment = $(this).parent().parent();
        var comment_author = comment.find('[name="comment_author"]').val();
        var comment_permlink = comment.find('[name="comment_permlink"]').val();

        let reply_data = {};
        reply_data.comment_body = $(this).find('[name="comment_body"]').val();
        reply_data.parent_author = comment_author;
        reply_data.permlink = comment_permlink;


        if (reply_data.comment_body != "") {
            $(this).find('[name="comment_body"]').css("visibility", "hidden");
            $(this).find('.submit-reply').css("visibility", "hidden");
            $(this).addClass('formGrayOut');

            $.ajax({
                type: "POST",
                url: "/action/comment",
                data: reply_data,
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);
                        get_content_replies(reply_data.parent_author, reply_data.permlink, comment.parent().parent());
                        box.remove();
                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                    $(this).removeClass('formGrayOut');
                },
                error: function (data) {
                    toastr.error("Coś poszło nie tak...");
                    $(this).removeClass('formGrayOut');
                }
            });
        } else {
            toastr.error("Nie możesz wysłać pustego komentarza");
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

    var vote_clicked = false;

    $('#voting-icon').click(function (e) {

        console.log("Vote clicked");

        if (!vote_clicked) {
            vote_clicked = true;
            $('#voting-icon').removeClass('fa-thumbs-up');
            $('#voting-icon').addClass('fa-spinner').addClass("fa-spin");
            $.ajax({
                type: "POST",
                url: "/action/vote",
                data: "test",
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);
                        $('#voting-counter').text(data.net_votes);
                        $('#voting-value').text("$" + data.value);
                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                    vote_clicked = false;
                    $('#voting-icon').addClass('fa-thumbs-up').addClass("voted");
                    $('#voting-icon').removeClass('fa-spinner').removeClass('fa-spin');
                },
                error: function (data) {
                    console.log("error");
                    toastr.error("Coś poszło nie tak...");
                    vote_clicked = false;
                    $('#voting-icon').addClass('fa-thumbs-up');
                    $('#voting-icon').removeClass('fa-spinner').removeClass('fa-spin');
                }
            });
        }
    })

    // Listen to submit event on the <form> itself!
    $('#comment-form').submit(function (e) {

        function appendNewComment(body, author, commentsList) {
            // commentsList.append();
        }

        e.preventDefault();

        var comment_list = $("#comments").children()[1];
        console.log($("#comments").children()[1]);

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
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);
                    } else if (data.error) {
                        toastr.error(data.error);
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

});

function renderCommentsList(comments, list_id) {

    console.log("renderCommentsList", comments, list_id);
    
    let ul = document.createElement('ul');
    $(ul).addClass("comment-tree");
    $(list_id).append(ul);

    comments.forEach(comment => {

        (function(comment, ul) {
            let cmt = comment;
            let li = document.createElement('li');
            $(ul).append(li);
            if (loggedInUser) {
                (function (lli, lcmt) {
                    steem.api.getActiveVotes(lcmt.author, lcmt.permlink, function (err, result) {

                        if (!err && result) {
                            let voted = false;
                            result.forEach(voter => {
                                if (voter.voter == loggedInUser) {
                                    voted = true;
                                }
                            });

                            (function (lli2, lcmt2) {
                                renderComment(lcmt2, voted, lli2);
                            })(lli, lcmt);

                        }
                    });
                })(li, cmt);
            } else {
                (function (lli, lcmt) {
                    renderComment(lcmt, false, lli);
                })(li, cmt);
            }

            if (cmt.children > 0) {

                (function (aa, pepe, lili) {
                    get_content_replies(aa, pepe, lili);
                })(cmt.author, cmt.permlink, li);

            }
        })(comment, ul);

  
    });
}

function get_content_replies(author, permlink, list_id) {
    
    console.log("get_content_replies", author, permlink, list_id);

    steem.api.getContentReplies(author, permlink, function (err, result) {
        if (!err && result) {
            (function(ul) {
                renderCommentsList(result, ul);
            })(list_id);
        }
    });
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
    $(span).append(moment(comment.created).format("LLL"));

    var comment_body = document.createElement('p');

    if (comment.net_rshares >= 0) {
        $(comment_body).append(marked(comment.body));
    } else {
        $(comment_body).append('Komentarz ukryty');
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
    $(span_replay).addClass('comment-action').addClass('comment-reply').append("&nbsp;&nbsp;&nbsp;&nbsp;Odpowiedz");

    $(comment_action).append(i_voted).append("&nbsp;").append(span_votes).append('&nbsp;&nbsp;&nbsp;&nbsp;').append(span_value).append(span_replay);

    let hidden_permlink = document.createElement('input');
    $(hidden_permlink).attr('type', 'hidden').attr('name', 'comment_permlink').attr('value', comment.permlink);
    let hidden_author = document.createElement('input');
    $(hidden_author).attr('type', 'hidden').attr('name', 'comment_author').attr('value', comment.author);

    $(content).append(hidden_permlink);
    $(content).append(hidden_author);
    $(content).append(h4);
    $(content).append(span);
    $(content).append(comment_body);
    $(content).append(comment_action);

    $(new_comment_box).append(content);

    $(list_id).append(new_comment_box); 

}