$(document).ready(function () {
    let inProgress = false;

    function showSuccessMessage(message) {
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

    function showErrorMessage(message) {
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

    $.ajax({
        type: "POST",
        url: "/dashboard/statistics",
        success: function (data) {
            console.log(data);

            let chartOptions = {
                type: "line",
                height: "50px",
                width: "100%",
                lineColor: "#26B99A",
                fillColor: false,
                lineWidth: 2,
                spotColor: "#34495E",
                minSpotColor: "#34495E"
            };

            $(".chart-steem").sparkline(data.statistics.steem, chartOptions);
            $(".chart-sbd").sparkline(data.statistics.sbd, chartOptions);
            $(".chart-sp").sparkline(data.statistics.steem_power, chartOptions);
            $(".chart-savings-sbd").sparkline(data.statistics.savings_sbd, chartOptions);
            $(".chart-savings-steem").sparkline(data.statistics.savings_steem, chartOptions);
        },
        error: function (data) {
            console.log(data);
            showErrorMessage('Something gone wrong while reading statistics data');
        }
    });

    $('#btn-claim').click(function (e) {

        if (!inProgress) {
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

                        showSuccessMessage(data.success);

                    } else if (data.error) {
                        showErrorMessage(data.error);
                    }
                },
                error: function (data) {
                    inProgress = false;
                    $('#progress-loader').remove();
                    showErrorMessage(data.error);
                }
            });

        }
    })
});

