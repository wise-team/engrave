$(document).ready(function () {
    let inProgress = false;

    $('#settings').parsley();
   
    $('#settings').on("click",".category_remove_btn", function(){
        $(this).parent().parent().parent().remove();
    });

    $('#add').click(function(e){
        const matches = $('#settings').serializeArray().filter( ({name}) => name.match(/(c_)([0-9]*)(_name)+/) );
        let last_id = 0;
        if(matches.length) {
            last_id = matches[matches.length - 1].name.replace('c_', "").replace('_name',"");
        }
        let next = parseInt(last_id)+1;
        console.log(last_id);
        $('#categories').append('<div class="row" id="celement' + next + '"> <div class="col-md-4"> <div class="form-group"> <input required name="c_'+ next +'_name" type="text" placeholder="Category name" class="form-control"/> </div> </div> <div class="col-md-4"> <div class="form-group"> <input required data-parsley-maxwords="1" name="c_'+ next +'_slug"  type="text" placeholder="slug" class="form-control"/> </div> </div> <div class="col-md-3"> <div class="form-group"> <input required name="c_'+ next +'_steem_tag"  type="text" placeholder="Steem tag" class="form-control"/> </div> </div> <div class="col-md-1"> <div class="form-group"> <button type="button" class="btn btn-danger btn-fill pull-right category_remove_btn">X</button> </div> </div> </div>'); 
    });

    $('#btn-enable-ssl').click(function(e) {
       
        if(!inProgress) {
            inProgress = true;

            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'ssl-progress-loader');
    
            $('#btn-enable-ssl').prepend(i);
            $.ajax({
                type: "POST",
                url: "/dashboard/ssl",
                data: 'ask',
                success: function (data) {
                    
                    inProgress = false;
                    $('#ssl-progress-loader').remove();

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
                    inProgress = false;
                    $('#ssl-progress-loader').remove();
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

        }
    })

    $('#settings').submit(function (e) {
        e.preventDefault();

        $('#settings').parsley().validate();
        if ($('#settings').parsley().isValid()) {

            if(!inProgress) {
                inProgress = true;
                var settings = $(this).serialize();

                var i = document.createElement('i')
                $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');
    
                $('#btn-save').prepend(i);
    
                $.ajax({
                    type: "POST",
                    url: "/dashboard/settings",
                    data: settings,
                    success: function (data) {
                        
                        inProgress = false;
                        $('#progress-loader').remove();
    
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
                        inProgress = false;
                        $('#progress-loader').remove();
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
            }                      
        }
    });
});

