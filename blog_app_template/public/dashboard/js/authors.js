$(document).ready(function () {

    $('.editor-accept-button').click(function (e) {
        var username = $(this)[0].id.replace("acc-", "");
        $.ajax({
            type: "POST",
            url: "/dashboard/editors/accept",
            data: { username: username },
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

    $('.editor-reject-button').click(function (e) {
        var username = $(this)[0].id.replace("rej-", "");
        $.ajax({
            type: "POST",
            url: "/dashboard/editors/reject",
            data: { username: username },
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
