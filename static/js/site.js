$(document).ready(function() {
    var storage = 'scotch',
        edit = $('#scotch-edit'),
        show = $('#scotch-show'),
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
        edit.toggle();
        show.toggle();
    });


});
