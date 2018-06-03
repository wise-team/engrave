$(document).ready(function () {

    $('#article').parsley();

    let inProgress = false;

    $('#btn-publish').click(function(e) {    

        $('#article').parsley().validate();
        if ($('#article').parsley().isValid()) {
            $('#myModal1').modal({backdrop: 'static'});
        }
    });

    $('#btn-accept').click(function(e) {    

        if(!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');
    
            $('#btn-accept').prepend(i);
            $('#article').trigger('submit');
        }
    
    });

    $('#article').submit(function (e) {
        if(!inProgress) {
            inProgress = true;
            e.preventDefault();

            var article = $(this).serialize();
            
            console.log(article);

            $.ajax({
                type: "POST",
                url: "/dashboard/edit",
                data: article,
                success: function (data) {
                    $('#myModal1').modal('hide');
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
                    $('#myModal1').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    $.notify({
                        icon: "nc-icon nc-fav-remove",
                        message: "Coś poszło nie tak..."        
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

