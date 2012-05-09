$(document).ready(function() {
    /* The code to change stuff. */
    var storage = 'scotch',
        edit = $('#scotch-edit'),
        show = $('#scotch-show'),
        list = $('#receipt-list'),
        current = window.localStorage.getItem(storage);

    if (!current) {
        edit.removeClass('hidden');
    } else {
        show.removeClass('hidden').find('h3').text(current);
    }

    $(edit).find('form').bind('submit', function(e) {
        var val = $(edit).find('input').val();
        window.localStorage.setItem(storage, val);
        edit.toggleClass('hidden');
        show.toggleClass('hidden').find('h3').text(val);
        return false;
    });

    $(show).find('button').bind('click', function(e) {
        edit.toggleClass('hidden').find('input').val(window.localStorage.getItem(storage));
        show.toggleClass('hidden');
    });

    /* Sample receipt handling code. */
    var receipt_list = function() {
        list.find('dl').innerHTML = '';
        var req = window.navigator.mozApps.getSelf();

        req.onsuccess = function(o) {
            $.each(req.result._receipts, function(index, value) {
                list.find('dl')
                    .append('<dt data-receipt="' + value + '">'
                            + value.substring(0, 10) + '...</dt>')
                    .append('<dd>' + receipt_json(value) + '</dd>');
                list.find('button').removeClass('hidden');
            });
        };
    };

    var receipt_json = function(receipt) {
        if (receipt.indexOf('~') > -1) {
            receipt = receipt.split('~')[1];
        }
        receipt = receipt.split('.')[1];
        return JSON.stringify(jwt.base64urldecode(receipt));
    }

    var receipt_uninstall = function(e) {
        var req = window.navigator.mozApps.getSelf();

        req.onsuccess = function(o) {
            req.result.uninstall();

            /* TODO: find out why there is a delay here */
            list.find('button').addClass('hidden');
            receipt_list();
        };
    };

    list.find('button').bind('click', receipt_uninstall);
    /* Populate the receipt list. */
    receipt_list();
});
