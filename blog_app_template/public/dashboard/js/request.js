$(document).ready(function () {

    $('.login_content').on('submit', '#request_form', function (e) {
        e.preventDefault();

        $('#request_form').parsley().validate();

        if ($('#request_form').parsley().isValid()) {

            let data = $('#request_form').serialize();
            console.log(data);

            $.ajax({
                type: "POST",
                url: "/dashboard/request",
                data: data,
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.success);

                        setTimeout(() => {
                            $(location).attr('href', '/dashboard')
                        }, 1500);

                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                },
                error: function (data) {
                    toastr.error("Coś poszło nie tak...");
                }
            });

        }


    });


});