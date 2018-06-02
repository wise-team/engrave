$(document).ready(function () {

    $('#article').parsley();

    $("#article-body").markdown({ fullscreen: {enable: false}})

    $('#clear-btn').click(function (e) {
        e.preventDefault();
        $('#article').trigger('reset');
    });

    $('#preview-btn').click(function (e) {
        e.preventDefault();

        $('#article').parsley().validate();

        if ($('#article').parsley().isValid()) {
            var article = $('#article').serialize();
            $.ajax({
                type: "POST",
                url: "/dashboard/update",
                data: article,
                success: function (data) {
                    if (data.success) {
                        $('#_id').val(data._id);
                        var win = window.open('/dashboard/preview/' + data._id, '_blank');
                        if (win) {
                            //Browser has allowed it to be opened
                            win.focus();
                        } else {
                            //Browser has blocked it
                            alert('Please allow popups for this website');
                        }
                    } else if (data.error) {
                        toastr.error(data.error);
                    }
                },
                error: function (data) {
                    toastr.error("Coś poszło nie tak...");
                }
            });
        }
    })

    $('#article').submit(function (e) {
        var article = $(this).serialize();
        article.status="added";
        e.preventDefault();
        
        var id = ($('#article').serializeArray())[0].value;

        console.log(id);

        $.ajax({
            type: "POST",
            url: "/dashboard/add",
            data: article,
            success: function (data) {
                if (data.success) {
                    toastr.success(data.success);
                    if (id == '' || id == null) {
                        $('#article').trigger('reset');
                    }
                } else if (data.error) {
                    toastr.error(data.error);
                }
            },
            error: function (data) {
                toastr.error("Coś poszło nie tak...");
            }
        });
    });

    $('#update-btn').click(function (e) {
        var article = $('#article').serialize();
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/dashboard/update",
            data: article,
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

    $('#accept-btn').click(function (e) {
        e.preventDefault();
        var article = $('#article').serializeArray();
            
        console.log(article[0].value);

        $.ajax({
            type: "POST",
            url: "/dashboard/accept",
            data: { id: article[0].value },
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
    })

});