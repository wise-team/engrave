$(document).ready(function () {

    let inProgress = false;
    let id = null;
    let btn = null;

    $('.btn-func-delete').click(function (e) {
        id = $(this)[0].id.replace("rm-","");
        btn = $(this);

        $('#modal-delete').modal();
    });

    $('.btn-chain-delete').click(function (e) {
        id = $(this)[0].id.replace("cdel-","");
        btn = $(this);
        
        $('#modal-chain-delete').modal({backdrop: 'static'});
    });

    $('.btn-func-publish').click(function (e) {
        id = $(this)[0].id.replace("pub-","");
        btn = $(this);

        $('#modal-publish').modal({backdrop: 'static'});
    });

    $('#btn-delete').click(function(e) {

        $.ajax({
            type: "POST",
            url: "/dashboard/draft/delete",
            data: {id: id},
            success: function (data) {
                $('#modal-delete').modal('hide');
                if (data.success) {
                    $.notify({
                        icon: "nc-icon nc-send",
                        message: data.success            
                    }, {
                        type: 'success',
                        timer: 8000,
                        spacing: 15,
                        placement: {
                            from: 'top',
                            align: 'right'
                        }
                    });
                    btn.parent().parent().parent().remove();
                } else if (data.error) {
                    $.notify({
                        icon: "nc-icon nc-fav-remove",
                        message: data.error            
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
            },
            error: function (data) {
                $('#modal-delete').modal('hide');
                $.notify({
                    icon: "nc-icon nc-fav-remove",
                    message: 'Something gone wrong. Try again'            
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
        });
    });

    $('#btn-publish').click(function(e) {
        if(!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');
    
            $('#btn-publish').prepend(i);
            inProgress = true;

            $.ajax({
                type: "POST",
                url: "/dashboard/draft/publish",
                data: {id: id},
                success: function (data) {
                    $('#modal-publish').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    if (data.success) {
                        $.notify({
                            icon: "nc-icon nc-send",
                            message: data.success            
                        }, {
                            type: 'success',
                            timer: 8000,
                            spacing: 15,
                            placement: {
                                from: 'top',
                                align: 'right'
                            }
                        });
                        btn.parent().parent().parent().remove();
                    } else if (data.error) {
                        $.notify({
                            icon: "nc-icon nc-fav-remove",
                            message: data.error            
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
                },
                error: function (data) {
                    $('#modal-publish').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    $.notify({
                        icon: "nc-icon nc-fav-remove",
                        message: 'Something gone wrong. Try again'            
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
            });

        }
        
    });

    $('#btn-chain-delete').click(function(e) {
        if(!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');
    
            $('#btn-chain-delete').prepend(i);
            inProgress = true;

            $.ajax({
                type: "POST",
                url: "/dashboard/delete",
                data: {permlink: id},
                success: function (data) {
                    $('#modal-chain-delete').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    if (data.success) {
                        $.notify({
                            icon: "nc-icon nc-trash",
                            message: data.success            
                        }, {
                            type: 'success',
                            timer: 8000,
                            spacing: 15,
                            placement: {
                                from: 'top',
                                align: 'right'
                            }
                        });
                    } else if (data.error) {
                        $.notify({
                            icon: "nc-icon nc-fav-remove",
                            message: data.error            
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
                },
                error: function (data) {
                    $('#modal-chain-delete').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    $.notify({
                        icon: "nc-icon nc-fav-remove",
                        message: 'Something gone wrong. Try again'            
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
            });

        }
        
    });

});


