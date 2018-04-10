define(function (require, exports, module) {
    var _ = require('underscore');
    var widgets = require('./widgets');

    var initForm = function (formElem, options) {
        var controls = [], afterRender = [];
        options.control.sort(function (a,b) { return a.sequence - b.sequence; });
        _.each(options.control, function (item) {
            if (item.sequence % 100 !== 0) { return; }
            if (!widgets.hasOwnProperty(item.controlId)) { return; }

            var children = null;
            if (item.controlId === 'TableField') {
                children = _.filter(options.control, function (child) {
                    return child.sequence % 100 !== 0 && (Math.floor(child.sequence / 100) * 100 === item.sequence);
                });
            }

            var elem = widgets[item.controlId](item, children, afterRender);
            controls.push(elem);
        });

        formElem.append(controls);
        _.each(afterRender, function (item) {
            if (typeof item === 'function') {
                item(formElem);
            }
        });

        formElem.checkRequired = function () {
            var success = true, message = '', tempName = '';
            formElem.find('[required]').each(function () {
                if ($.trim($(this).val()) === '') {
                    tempName = $(this).attr('name');
                    success = false;
                    _.each(options.control, function (item) {
                        if (item.reName === tempName) {
                            message = item.describeName + '为必填项！';
                            return false;
                        }
                    });
                    return false;
                }
            });
            return { success: success, message: message };
        };
    };

    module.exports = initForm;
});
