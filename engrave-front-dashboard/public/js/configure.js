$(document).ready(function () {

    setButtonsEnableState(false);
    var customDomainField = $('#custom-domain').parsley();

    $.event.special.inputchange = {
        setup: function () {
            var self = this, val;
            $.data(this, 'timer', window.setInterval(function () {
                val = self.value;
                if ($.data(self, 'cache') != val) {
                    $.data(self, 'cache', val);
                    $(self).trigger('inputchange');
                }
            }, 100));
        },
        teardown: function () {
            window.clearInterval($.data(this, 'timer'));
        },
        add: function () {
            $.data(this, 'cache', this.value);
        }
    };

    $('#custom-domain').on('inputchange', function () {
        console.log(this.value);
        setButtonsEnableState(false);
        $.ajax({
            type: "POST",
            url: "/domains/check",
            data: { "domain": this.value },
            success: function (data) {
                console.log(data);
                window.ParsleyUI.removeError(customDomainField, "domainError");
                if (data.status == 'taken') {
                    window.ParsleyUI.addError(customDomainField, "domainError", "Domain is taken. Try another one");
                } else if (data.status == 'invalid') {
                    window.ParsleyUI.addError(customDomainField, "domainError", "Invalid domain name");
                } else if (data.status == 'free') {
                    setButtonsEnableState(true);
                }
            },
            error: function (data) {
                setButtonsEnableState(false);
                window.ParsleyUI.removeError(customDomainField, "domainError");
                window.ParsleyUI.addError(customDomainField, "domainError", "Invalid domain name");
                console.log(data);
            }
        });
    });

    $("#theme-select").imagepicker({
        show_label: true
    });

    $('#configure').submit(function (e) {
        e.preventDefault();
        const article = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "/dashboard/configure/finish",
            data: article,
            success: function (data) {
                if (data.success) {
                    displaySuccessMessage(data.success)
                    setTimeout(function () {
                        location.reload(true);
                    }, 1500);
                } else if (data.error) {
                    displayErrorMessage(data.error);
                }
            },
            error: function (data) {
                displayErrorMessage(data.responseJSON.error);
            }
        });
    });

    $('#pay-steem').on('click', function () {
        const domain = $("#custom-domain").val();
        requestDomainPayment(domain, 'steem');
    });

    $('#pay-sbd').on('click', function () {
        const domain = $("#custom-domain").val();
        requestDomainPayment(domain, 'sbd');
    });

    function requestDomainPayment(domain, currency) {
        $.ajax({
            type: "POST",
            url: "/domains/choose",
            data: {
                domain: domain,
                currency: currency
            },
            success: function (data) {
                if (data.url) {
                    window.setTimeout(function () {
                        window.location.href = data.url;
                    }, 100);
                } else {
                    displayErrorMessage("Error occured...");
                }
            },
            error: function (data) {
                console.log(data);
                displayErrorMessage(data.responseJSON.error);
            }
        });
    }

    function setButtonsEnableState(state) {
        $('#pay-steem').attr("disabled", !state);
        $('#pay-sbd').attr("disabled", !state);
    }

    function displayErrorMessage(message) {
        $.notify({
            icon: "nc-icon nc-fav-remove",
            message: message
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

    function displaySuccessMessage(message) {
        $.notify({
            icon: "nc-icon nc-send",
            message: message
        }, {
                type: 'success',
                timer: 8000,
                spacing: 15,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
    }

});

