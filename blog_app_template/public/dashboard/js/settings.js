$(document).ready(function () {
    $('#save-settings').click(function (e) {

        e.preventDefault();
        var settings = $('#settings').serialize();
        
        $.ajax({
            type: "POST",
            url: "/dashboard/settings",
            data: settings,
            success: function (data) {
                if (data.success) {
                    toastr.success(data.success);
                } else if (data.error) {
                    toastr.error(data.error);
                }
            },
            error: function (data) {
                toastr.error("Coś poszło nie tak...");
            }
        });

    });
});
