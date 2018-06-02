$(document).ready(function () {

    $('.accept-btn').click(function (e){
        var btn = $(this);
        $.ajax({
            type: "POST",
            url: "/dashboard/accept",
            data: {id: this.id},
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
    })

    $('.reject-btn').click(function (e) {
        var btn = $(this);
        $.ajax({
            type: "POST",
            url: "/dashboard/reject",
            data: { id: this.id },
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
    })

});