$(document).ready(function () {

    $('.remove-button').click(function (e) {
        var id = $(this)[0].id.replace("rm-","");
        var btn = $(this);

        $.ajax({
            type: "POST",
            url: "/dashboard/remove",
            data: {id: id},
            success: function (data) {
                if (data.success) {
                    toastr.success(data.success);
                    btn.parent().parent().remove();
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
