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
            $.each(req.result.receipts, function(index, value) {
                var parsed = receipt_json(value);
                // TODO: turn this into a template.
                list.find('dl')
                    .append('<dt data-receipt="' + value + '">'
                            + value.substring(0, 10) + '...</dt>'
                            + '<dd>'
                            + '<a href="#" class="verify" data-url="' + parsed.verify + '">'
                            + 'Naive verification</a> &middot; '
                            + 'status: <span class="status unknown">unknown</span> '
                            + '</dd>'
                            + '<dd>'
                            + '<a href="#" class="verify" data-url="http://django-receipts.herokuapp.com/receipts/receive">'
                            + 'Proxy verification</a> &middot; '
                            + 'status: <span class="status unknown">unknown</span> '
                            + '</dd>'
                            + '<dd>'
                            + '<a href="#" class="verify-mozmarket">'
                            + 'Recommended verification</a> &middot; '
                            + 'status: <span class="status unknown">unknown</span> '
                            + '</dd>'
                            );
                list.find('button').removeClass('hidden');
            });
        };
    };

    var receipt_json = function(receipt) {
        if (receipt.indexOf('~') > -1) {
            receipt = receipt.split('~')[1];
        }
        receipt = receipt.split('.')[1];
        return JSON.parse(atob(receipt));
    };

    var receipt_verify = function(e) {
        var $this = $(this);
        var $dt = $(this).parent().prevAll('dt:last');
        $.post($this.data('url'),
            $dt.data('receipt'),
            function(data) {
                $('span', $this.parent()).text(data.status)
                               .removeClass()
                               .addClass(data.status);
            }, 'json');
        return false;
    };

    var mozmarket_verify = function(e) {
        mozmarket.receipts.verify(
            function(result) {
                $('span', $this.parent()).text(result.state)
                               .removeClass()
                               .addClass(data.status);
        });
    };

    $('a.verify').live('click', receipt_verify);
    $('a.verify-mozmarket').live('click', mozmarket_verify);
    /* Populate the receipt list. */
    receipt_list();
});
