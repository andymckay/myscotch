$(document).ready(function() {
    /* The code to change stuff. */
    var storage = 'scotch',
        edit = $('#scotch-edit'),
        show = $('#scotch-show'),
        list = $('#receipt-list'),
        current = window.localStorage.getItem(storage);

    if (!current) {
        edit.toggle();
    } else {
        show.toggle().find('h3').text(current);
    }

    $(edit).find('form').bind('submit', function(e) {
        var val = $(edit).find('input').val();
        window.localStorage.setItem(storage, val);
        edit.toggle();
        show.toggle().find('h3').text(val);
        return false;
    });

    $(show).find('button').bind('click', function(e) {
        edit.toggle().find('input').val(window.localStorage.getItem(storage));
        show.toggle();
    });

    /* Sample receipt handling code. */
    var receipt_list = function() {
        list.find('span').innerHTML = '';
        var req = window.navigator.mozApps.getSelf();

        req.onsuccess = function(o) {
            $.each(req.result._receipts, function(index, value) {
                list.find('span')
                    .append('<span>' + value.substring(0, 10) + '...</span>');
                list.find('a').show();
            });
        };
    };

    var receipt_uninstall = function(e) {
        var req = window.navigator.mozApps.getSelf();

        req.onsuccess = function(o) {
            req.result.uninstall();
            receipt_list();
        };
    };

    list.find('a').bind('click', receipt_uninstall);
    /* Populate the receipt list. */
    receipt_list();
});
