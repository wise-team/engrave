$(document).ready(function () {
    
    $('[data-toggle="tooltip"]').tooltip();

    let id = $('#_id').val();

    console.log(id);

    var simplemde = new SimpleMDE(
        {
            autosave: {
                enabled: true, 
                uniqueId: id ? id : "new", 
                delay: 1000
            },
            shortcuts: {
                "toggleOrderedList": "Ctrl-J", // alter the shortcut for toggleOrderedList
                "toggleCodeBlock": null, // bind to Ctrl-Shift-C
                "drawTable": null // bind Cmd-Alt-T to drawTable action, which doesn't come with a default shortcut
            },
            forceSync: true, 
            spellChecker: true,
            element: document.getElementById("post-body"),
            showIcons: ["code", "table"],
          
        });

    $('#article').parsley();

    let inProgress = false;

    $('#btn-publish').click(function(e) {    

        $('#article').parsley().validate();
        if ($('#article').parsley().isValid()) {
            $('#myModal1').modal({backdrop: 'static'});
        }
    });

    $('#btn-draft').click(function(e) {    
        $('#article').parsley().validate();
        if ($('#article').parsley().isValid()) {
            var article = $('#article').serialize();
            console.log(article);
            $.ajax({
                type: "POST",
                url: "/dashboard/draft",
                data: article,
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

                        if(data._id) {
                            console.log('New draft ID: ', data._id);
                            $('#_id').attr('value', data._id);
                            $('#btn-draft').html("Update draft");
                        }

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
                        message: "Something gone wrong..."        
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
    });

    $('#btn-accept').click(function(e) {    

        if(!inProgress) {
            var i = document.createElement('i')
            $(i).addClass('fa').addClass('fa-refresh').addClass('fa-spin').attr('id', 'progress-loader');
    
            $('#btn-accept').prepend(i);
            $('#article').trigger('submit');
        }
    
    });

    $('#article').submit(function (e) {
        if(!inProgress) {
            inProgress = true;
            e.preventDefault();

            var article = $(this).serialize();
            
            console.log(article);

            $.ajax({
                type: "POST",
                url: "/dashboard/publish",
                data: article,
                success: function (data) {
                    $('#myModal1').modal('hide');
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

                        $('#article').trigger('reset');
                        simplemde.value("");
                        simplemde.clearAutosavedValue();
                        if(data.draft) {
                            window.location.replace("/dashboard/write");
                        }
                        

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
                    $('#myModal1').modal('hide');
                    inProgress = false;
                    $('#progress-loader').remove();
                    $.notify({
                        icon: "nc-icon nc-fav-remove",
                        message: "Something gone wrong..."        
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
    });

});

