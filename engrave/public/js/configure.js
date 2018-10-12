$(document).ready(function () {

    $("#category-select").imagepicker({show_label: true});

    $('#configure').submit(function (e) {
        e.preventDefault();

        var article = $(this).serialize();
        
        console.log(article);

        $.ajax({
            type: "POST",
            url: "/dashboard/configure/finish",
            data: article,
            success: function (data) {
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

                    setTimeout(function(){
                        location.reload(true);
                    }, 1500);
                    // location.reload(true);

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
    });
});

