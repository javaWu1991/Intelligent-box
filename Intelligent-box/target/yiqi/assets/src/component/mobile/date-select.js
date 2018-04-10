define(function (require, exports, moduel) {
    require('calendar');
    var globalCalendar;

    var datetimeSelect = function (elements, hasTime) {
        if (!globalCalendar) globalCalendar = new Calendar();

        if (hasTime) {
            elements.attr('hours', 'hours');
        }
        globalCalendar.bind(elements);
    };

    moduel.exports = datetimeSelect;
});
