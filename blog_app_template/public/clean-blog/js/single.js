let loggedInUser = null;

$(document).ready(function () {
    let permlink = $("#permlink").val();
    let editorial = $("#editorial").val();
    
    get_content_replies(editorial, permlink, "#comments");
    
    loggedInUser = $('#logged_user').val();
    
    function renderCommentsList(comments, list_id) {
    
        console.log("renderCommentsList", comments, list_id);
        
        let ul = document.createElement('ul');
        $(ul).addClass("comments");
        $(list_id).append(ul);
    
        comments.forEach(comment => {
    
            (function(comment, ul) {
                let cmt = comment;
                let li = document.createElement('li');
                $(li).addClass('clearfix');
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
        $(new_comment_box).addClass('post-comments');
    
        var image = document.createElement('img');
        $(image).prop('src', "https://steemitimages.com/u/" + comment.author + "/avatar").addClass('avatar');
    
        $(list_id).append(image);
    
        var content = document.createElement('p');
        $(content).addClass('meta');

        $(content).append(moment(comment.created).format('LLL') + ", ");

        var authorsLink = document.createElement('a');
        $(authorsLink).prop('href', "#");
        $(authorsLink).append(comment.author);
    
        var span = document.createElement('span');
        var i = document.createElement('i');
        $(i).addClass('fa').addClass('fa-clock-o');
        $(span).append(i);
        $(span).append(moment(comment.created).format("LLL"));
    
        var comment_body = document.createElement('p');
    
        if (comment.net_rshares >= 0) {
            $(comment_body).append(comment.body);
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
        $(content).append(authorsLink);
        $(content).append(": ");
        // $(content).append(h4);
        // $(content).append(span);
        // $(content).append(comment_action);
    
        $(new_comment_box).append(content);
        $(new_comment_box).append(comment_body);

    
        $(list_id).append(new_comment_box); 
    
    }
});
