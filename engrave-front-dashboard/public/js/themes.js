$(document).ready(function () {

    $("#theme-select").imagepicker({
        show_label: true
    });

    $('#themes').submit(function (e) {
        e.preventDefault();

        var themesSettings = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "/dashboard/themes",
            data: themesSettings,
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
                    message: data.responseJSON.error
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
