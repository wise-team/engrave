$(document).ready(function () {
    $('#user-details').submit(function (e) {
        e.preventDefault();

        var user = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "/dashboard/profile",
            data: user,
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