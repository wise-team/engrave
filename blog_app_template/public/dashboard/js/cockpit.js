$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://api.coinmarketcap.com/v1/ticker/steem-dollars/",
        success: function (data) {
            if (data[0]) {
                $('#sbd_price').text("$" + parseFloat(data[0].price_usd).toFixed(2));
                $('#sbd_price_change').text(data[0].percent_change_24h + "%").addClass(parseFloat(data[0].percent_change_24h) > 0 ? "green" : "red");
            }
        },
        error: function (data) {
            toastr.error("Coś poszło nie tak...");
        }
    });
    
    $.ajax({
        type: "GET",
        url: "https://api.coinmarketcap.com/v1/ticker/steem/",
        success: function (data) {
            if (data[0]) {
                $('#steem_price').text("$" + parseFloat(data[0].price_usd).toFixed(2));
                $('#steem_price_change').text(data[0].percent_change_24h + "%").addClass(parseFloat(data[0].percent_change_24h) > 0 ? "green" : "red");
            }
        },
        error: function (data) {
            toastr.error("Coś poszło nie tak...");
        }
    });

    $.ajax({
        type: "GET",
        url: "https://api.coinmarketcap.com/v1/ticker/bitcoin/",
        success: function (data) {
            if (data[0]) {
                $('#bitcoin_price').text("$" + parseFloat(data[0].price_usd).toFixed(2));
                $('#bitcoin_price_change').text(data[0].percent_change_24h + "%").addClass(parseFloat(data[0].percent_change_24h) > 0 ? "green" : "red");
            }
        },
        error: function (data) {
            toastr.error("Coś poszło nie tak...");
        }
    });
});

