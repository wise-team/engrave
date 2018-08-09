let inProgress = false;

$('#btn-claim').click(function(e) {
       
    if(!inProgress) {
        inProgress = true;

        var i = document.createElement('i')
        $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');

        $('#btn-claim').prepend(i);

        $.ajax({
            type: "POST",
            url: "/dashboard/claim",
            data: 'ask',
            success: function (data) {
                
                inProgress = false;
                $('#progress-loader').remove();

                if (data.success) {      
                    
                    $('#btn-claim').parent().parent().parent().remove();

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
                    message: "Something gone wrong. Try again..."        
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
})