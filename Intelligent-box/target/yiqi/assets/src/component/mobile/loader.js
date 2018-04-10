define(function (require, exports, module) {
    module.exports = {
        show: function () {
            var loadbox = $('.load-box');
            if (!loadbox || loadbox.length === 0) {
                loadbox = $('<div class="load-box"><div class="loader">Loading...</div></div>')
                    .appendTo(document.body);
            }
            loadbox.show();
        },
        hide: function () {
            $('.load-box').hide();
        }
    };
});
