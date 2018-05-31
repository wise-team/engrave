$(document).ready(function () {

    $('#settings').parsley();

    let inProgress = false;

    $('#settings').submit(function (e) {
        e.preventDefault();
        $('#settings').parsley().validate();
        if ($('#settings').parsley().isValid()) {

            var settings = $(this).serialize();
            console.log(settings);

            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');

            $('#btn-save').prepend(i);

            $.ajax({
                type: "POST",
                url: "/dashboard/settings",
                data: settings,
                success: function (data) {
                    
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

