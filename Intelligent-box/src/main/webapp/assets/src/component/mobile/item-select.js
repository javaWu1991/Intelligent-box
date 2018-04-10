define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');

    var popupTemplate = '<div class="mask"><div class="select-list">\
        <ul>\
            <# _.each(list, function(item) { #>\
                <li>{{item}}</li>\
            <# }) #>\
        </ul>\
        </div></div>';
    var popupRender = template(popupTemplate);

    var itemSelect = function (trigger, list, multi) {
        var $popup = $(popupRender({ list: list }));
        $popup.hide().appendTo(document.body);

        trigger.on('click', function () { $popup.show(); });
        $popup.on('click', function (e) {
            var elem = $(e.target);
            if (elem.is('li')) {
                if (multi) {
                    elem.is('.current') ? elem.removeClass('current') : elem.addClass('current');
                    var vals = $popup.find('li.current').map(function (index, item) {
                            return $(item).text();
                        }).toArray().join(',');
                    trigger.val(vals);
                }
                else {
                    $popup.find('li').each(function (i, item) { $(item).removeClass('current'); });
                    if (elem.data('value') !== '') {
                        trigger.val(elem.text());
                        elem.addClass('current');
                    }
                    else {
                        trigger.val('');
                    }
                    $popup.hide();
                }
            }
            else {
                $popup.hide();
            }
        });
    };

    module.exports = itemSelect;
});
