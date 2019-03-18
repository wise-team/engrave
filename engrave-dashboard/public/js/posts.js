$(document).ready(function () {

    function showSuccessMessage(message) {
        $.notify({
            icon: "nc-icon nc-send",
            message: message
        }, {
                type: 'success',
                timer: 8000,
                spacing: 15,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
    }

    function showErrorMessage(message) {
        $.notify({
            icon: "nc-icon nc-fav-remove",
            message: message
        }, {
                type: 'danger',
                timer: 8000,
                spacing: 15,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
    }

    let inProgress = false;
    let id = null;
    let btn = null;

    $('.btn-func-delete').click(function (e) {
        id = $(this)[0].id.replace("rm-", "");
        btn = $(this);

        $('#modal-delete').modal();
    });

    $('body').on("click", ".btn-chain-delete", function () {
        id = $(this)[0].id.replace("cdel-", "");
        btn = $(this);

        $('#modal-chain-delete').modal({ backdrop: 'static' });
    });


    $('.btn-func-publish').click(function (e) {
        id = $(this)[0].id.replace("pub-", "");
        btn = $(this);

        $('#modal-publish').modal({ backdrop: 'static' });
    });

    $('#btn-delete').click(function (e) {

        $.ajax({
            type: "POST",
            url: "/dashboard/draft/delete",
            data: { id: id },
            success: function (data) {
                $('#modal-delete').modal('hide');
                if (data.success) {
                    showSuccessMessage(data.success);
                    btn.parent().parent().parent().remove();
                } else if (data.error) {
                    showErrorMessage(data.error);
                }
            },
            error: function (data) {
                $('#modal-delete').modal('hide');
                showErrorMessage('Something gone wrong.Try again');
            }
        });
    });

    $('#btn-publish').click(function (e) {
        if (!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');

            $('#btn-publish').prepend(i);
            inProgress = true;

            $.ajax({
                type: "POST",
                url: "/dashboard/draft/publish",
                data: { id: id },
                success: function (data) {
                    $('#modal-publish').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    if (data.success) {
                        showSuccessMessage(data.success);
                        btn.parent().parent().parent().remove();
                    } else if (data.error) {
                        showErrorMessage(data.error);
                    }
                },
                error: function (data) {
                    $('#modal-publish').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    showErrorMessage('Something gone wrong.Try again');
                }
            });

        }

    });

    $('#btn-chain-delete').click(function (e) {
        if (!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');

            $('#btn-chain-delete').prepend(i);
            inProgress = true;

            $.ajax({
                type: "POST",
                url: "/dashboard/delete",
                data: { permlink: id },
                success: function (data) {
                    $('#modal-chain-delete').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    if (data.success) {
                        showSuccessMessage(data.success);
                    } else if (data.error) {
                        showErrorMessage(data.error);
                    }
                },
                error: function (data) {
                    $('#modal-chain-delete').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    showErrorMessage('Something gone wrong. Try again');
                }
            });

        }

    });

    $('#btn-load-more').click(function (e) {
        if (!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');

            $('#btn-load-more').prepend(i);
            inProgress = true;

            let posts = $("#published-posts").children();
            let lastPostPermlink = $(posts[posts.length - 2]).attr('id').replace('art-',"");


            $.ajax({
                type: "POST",
                url: "/dashboard/posts",
                data: { start_permlink: lastPostPermlink },
                success: function (data) {
                    inProgress = false;
                    $('#progress-loader').remove();
                    if (data.success) {
                        const domain = data.domain;
                        data.posts.forEach(article => {
                            $('#published-posts').append(generateHtmlForNewArticle(article, domain));
                        });
                        $('body').tooltip({
                            selector: '[rel=tooltip]'
                        });
                        if (data.posts.length < 10) {
                            $('#btn-load-more').remove();
                        }

                    } else if (data.error) {
                        showErrorMessage(data.error);
                    }
                },
                error: function (data) {
                    inProgress = false;
                    $('#progress-loader').remove();
                    showErrorMessage('Something gone wrong. Try again');
                }
            });

        }

    });

    function generateHtmlForNewArticle(article, domain) {

        let image = '/img/default.jpg';
        if(article.thumbnail) {
            image = article.thumbnail;
        }
        
        let newArticleTemplate = `<div class="row" id="art-${article.permlink}"><div class="col-xs-12 col-sm-3 col-md-3"><img class="img-responsive img-box img-thumbnail" src="${image}"></div><div class="col-xs-12 col-sm-6 col-md-6"><label><a href="/dashboard/edit/${article.permlink}">${article.title}</a ></label><p class="card-category">${$($.parseHTML(article.body.substring(150, 0))).text()}</p><ul class="list-inline"><li class="list-inline-item card-category">&nbsp;<i class="fa fa-comments"></i>&nbsp;<span>${article.children}</span></li><li class="list-inline-item card-category">&nbsp;<i class="fa fa-thumbs-up"></i>&nbsp;${article.net_votes}</li><li class="list-inline-item card-category">&nbsp;<i class="fa fa-btc"></i>&nbsp;${'$' + parseFloat(parseFloat(article.pending_payout_value.replace(" SBD", "")) + parseFloat(article.total_payout_value.replace(" SBD", ""))).toFixed(2)}</li></ul></div > <div class="col-xs-12 col-sm-5 col-md-3"><div class="td-actions text-right"><button class="btn btn-danger btn-simple btn-link btn-chain-delete" id="cdel-it-s-just-posting-test-ignore-it" type="button" rel="tooltip" title="" data-original-title="Delete (hide on blockchain)"><i class="fa fa-trash"></i></button><a href="https://${domain}/${article.permlink}" target="_blank"><button class="btn btn-info btn-simple btn-link" type="button" rel="tooltip" title="" data-original-title="View at blog"><i class="fa fa-external-link"></i></button></a></div></div></div><hr>`
        
        return $.parseHTML(newArticleTemplate);
    }

});


