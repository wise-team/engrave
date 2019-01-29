$(document).ready(function () {

    let permlink = $("#permlink").val();
    let editorial = $("#editorial").val();

    getAndRenderComments(editorial, permlink, "#comments");

});
function getLoggedInToken(){
    return localStorage.getItem('aMZr1grXqFXbiRzmOGRM');
}

function getAndRenderComments(username, permlink, target_element) {
    console.log(username, permlink, target_element);
    steem.api.getContentReplies(username, permlink, function (err, result) {
        if (!err && result) {
            if(result.length) {
                // $('#comments-empty').remove();
            }
            (function(ul) {
                renderCommentsList(result, ul);
            })(target_element);
        }
    });
}

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

function renderComment(comment, voted, list_id) {
    
    const newCommentHtml = `<img src="https://steemitimages.com/u/${comment.author}/avatar" class="avatar"><div class="post-comments"><p class="meta">${comment.published}, <input type="hidden" name="comment_permlink" value="${comment.permlink}"><input type="hidden" name="comment_author" value="${comment.author}"><a href="https://steemit.com/@${comment.author}">${comment.author}</a>: <i class="pull-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-up comments-action comment-vote"></i>&nbsp;<span name="comment-votes">${comment.net_votes}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span name="comment-value">$0.00</span><span class="comment-action comment-reply">&nbsp;&nbsp;&nbsp;&nbsp;Reply</span></i></p>${comment.body}<p>
    asdasd</p></div>`;

    $(list_id).append(newCommentHtml); 

    return newCommentHtml;

}