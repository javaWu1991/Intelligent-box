define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');

    var boxRender = template('<div class="table-box">' +
            '<div class="box-title"><span>{{describeName}}({{boxIndex + 1}})</span>' +
            '<# if (boxIndex > 0)  { #><a href="javascript:" class="remove">删除</a><# } #>' +
            '</div>');

    var tableField = function (elem, option, children, widgets) {
        var container = elem.find('.table-container');
        var computeElems = [];
        var afterRender = [];

        elem.find('.add-button').on('click', function (e) {
            option.boxIndex = container.children().length;
            var $box = $(boxRender(option));
            $box.find('.remove').on('click', function () {
                $box.remove();
                _.each(children, function (child) {
                    if (child.compute !== false && (child.controlId === 'NumberField'
                        || child.controlId === 'MoneyField' || child.controlId === 'NumberCompute')) {
                        container.find('[name=' + child.reName + ']').trigger('change');
                    }
                });
            });

            var controls = [], childAfterRender = [];
            _.each(children, function (child) {
                var elem = widgets[child.controlId](child, null, childAfterRender);
                controls.push(elem);
            });

            $box.append(controls).appendTo(container);
            _.each(childAfterRender, function (func) {
                func($box);
            });
        }).click();

        _.each(children, function (child) {
            if (child.compute !== false && (child.controlId === 'NumberField'
                || child.controlId === 'MoneyField' || child.controlId === 'NumberCompute')) {
                var computeElem = widgets['NumberCompute']({
                    'describeName': '总' + child.describeName + '：',
                    'isRequired': false,
                    'reName': 'total' + child.reName,
                    'sequence': 100,
                    'controlId': 'NumberCompute',
                    'factors': [child.reName],
                    'type': 'float',
                    'operation': 'plus'
                }, null, afterRender);
                computeElems.push(computeElem);
            }
        });
        elem.find('.compute-container').append(computeElems);
        _.each(afterRender, function (func) {
            func(container);
        });
    };

    module.exports = tableField;
});
