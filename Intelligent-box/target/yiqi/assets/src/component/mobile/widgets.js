define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');

    var itemSelect = require('./item-select');
    var datetimeSelect = require('./date-select');
    var tableField = require('./table-field');
    var userList = require('./user-list');
    var approveSelect = require('./approve-select');

    var isDecimal = function (val) { return /^\d+(\.\d*){0,1}$/.test(val); };
    var isInteger = function (val) { return /^\d+$/.test(val); };

    var renderMap = {};
    var componentRender = function (type, content) {
        if (!renderMap[type]) {
            var templateStr = '<div class="form-item ' + type.toLowerCase() + '">'
                + content + '</div>';
            renderMap[type] = template(templateStr);
        }
        return renderMap[type];
    };

    var widgets = {
        TextField: function (option) {
            var render = componentRender('TextField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" {{isRequired ? "required" : ""}}>');
            return $(render(option));
        },
        TextareaField: function (option) {
            var render = componentRender('TextareaField',
                '<label>{{describeName}}</label>' +
                '<textarea name="{{reName}}" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" {{isRequired ? "required" : ""}}></textarea>');
            return $(render(option));
        },
        NumberField: function (option) {
            var render = componentRender('NumberField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" {{isRequired ? "required" : ""}}>');
            var element = $(render(option));

            element.find('input[type=text]').on('input', function (e) {
                var val = $(this).val();
                if (!isDecimal(val)) {
                    e.target.value = val.slice(0,-1);
                    e.preventDefault();
                    return false;
                }
            });
            return element;
        },
        DDSelectField: function (option) {
            var render = componentRender('DDSelectField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly {{isRequired ? "required" : ""}}>');
            var element = $(render(option));
            itemSelect(element.find('input.trigger'), option.jsonData.options, false);
            return element;
        },
        DDMultiSelectField: function (option) {
            var render = componentRender('DDMultiSelectField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly {{isRequired ? "required" : ""}}>');
            var element = $(render(option));
            itemSelect(element.find('input.trigger'), option.jsonData.options, true);
            return element;
        },
        DDDateField: function (option) {
            var render = componentRender('DDDateField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly {{isRequired ? "required" : ""}}>');
            var element = $(render(option));
            datetimeSelect(element.find('input.trigger'), false);
            return element;
        },
        DDDateRangeField: function (option) {
            option.label = option.describeName.split(',');
            var render = componentRender('DDDateRangeField',
                '<div class="range-item">' +
                    '<label>{{label[0]}}</label>' +
                    '<input name="{{reName}}" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly {{isRequired ? "required" : ""}}>' +
                '</div><div class="range-item">' +
                    '<label>{{label[1]}}</label>' +
                    '<input name="{{reName}}" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly {{isRequired ? "required" : ""}}>' +
                '</div>');
            var element = $(render(option));
            datetimeSelect(element.find('input.trigger'), false);
            return element;
        },
        DDPhotoField: function (option) {
            var render = componentRender('DDPhotoField',
                '<label class="trigger">{{describeName}}</label>' +
                '<input name="{{reName}}" type="file" accept="image/*" multiple style="display:none;">' +
                '<div class="list"></div>');
            var element = $(render(option));
            imageSelect(element);
            return element;
        },
        TableField: function (option, children) {
            var render = componentRender('TableField',
                '<div class="table-container"></div>' +
                '<div class="compute-container"></div>' +
                '<div class="add-button">+ {{exp}}</div>');
            var element = $(render(option));
            tableField(element, option, children, widgets);
            return element;
        },
        TextNote: function (option) {
            var render = componentRender('TextNote', '<p>{{exp}}</p>');
            return $(render(option));
        },
        MoneyField: function (option) {
            var render = componentRender('MoneyField',
                '<label>{{describeName}}</label>' +
                '<input name="{{reName}}" type="text" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" {{isRequired ? "required" : ""}}>');
            var element = $(render(option));
            element.find('input[type=text]').on('input', function (e) {
                var val = $(this).val();
                if (!isDecimal(val)) {
                    e.target.value = val.slice(0,-1);
                    e.preventDefault();
                    return false;
                }
            });
            return element;
        },
        DDAttachment: function (option) {
            var render = componentRender('DDAttachment',
                '<label class="trigger">{{describeName}}</label>' +
                '<input name="{{reName}}" type="file" accept="application/*" multiple style="display:none;">' +
                '<div class="list"></div>');
            var element = $(render(option));
            attachSelect(element);
            return element;
        }
    };

    //附加
    widgets['ApproveSelect'] = function (option) {
        var render = componentRender('ApproveSelect',
            '<span>{{describeName}}</span>' +
            '<input name="{{reName}}" type="hidden">' +
            '<div class="list">\
                <div class="trigger">+</div>\
            </div>');
        var element = $(render(option));
        approveSelect(element, false);
        return element;
    };
    widgets['NumberCompute'] = function (option, children, afterRender) {
        var render = componentRender('NumberCompute',
            '<label>{{describeName}}</label>' +
            '<input name="{{reName}}" type="text" readonly>');
        var element = $(render(option));

        var inputer = element.find('input[type=text]');
        var selectStr = _.map(option.factors, function (item) {
                return '[name=' + item + ']';
            }).join(',');
        var operation,
            parseType = option.type === 'float' ? parseFloat : parseInt;
        if (option.operation === 'multiply') {
            operation = function (items) {
                var product, temp;
                while (items.length > 0) {
                    temp = items.pop();
                    if (temp === '') { product = 0; break; }
                    if (typeof product === 'undefined') { product = parseType(temp); }
                    else { product *= parseType(temp); }
                }

                return option.type === 'float' ? product.toFixed(option.fixed || 2) : product.toString();
            };
        }
        else {
            operation = function (items) {
                var sum = 0;
                for (var i = 0; i < items.length; i++) {
                    if (items[i] === '') { continue; }
                    sum += parseType(items[i]) || 0;
                }
                return option.type === 'float' ? sum.toFixed(option.fixed || 2) : sum.toString();
            };
        }

        afterRender.push(function ($form) {
            //var factorElems = $form.find(selectStr);
            $form.on('change input', selectStr, function () {
                var values = $form.find(selectStr)
                        .map(function (index, elem) { return $.trim(elem.value); })
                        .toArray();
                inputer.val(operation(values));
                inputer.trigger('change');
            });
        });

        return element;
    };
    widgets['EmployeeField'] = function (option) {
        var render = componentRender('DDSelectField',
            '<label>{{describeName}}</label>' +
            '<input name={{reName}} type="hidden" {{isRequired ? "required" : ""}}>' +
            '<input name="{{reName}}-text" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly>');
        var element = $(render(option));
        var empSelect = userList.employeeSelect();
        element.find('input.trigger').on('click', function () { empSelect.show(); });
        empSelect.on('select', function (e, emp) {
            element.find('input.trigger').val(emp.userName);
            element.find('input[type=hidden]').val(emp.userId);
        });
        return element;
    };
    widgets['DepartmentField'] = function (option) {
        var render = componentRender('DDSelectField',
            '<label>{{describeName}}</label>' +
            '<input name={{reName}} type="hidden" {{isRequired ? "required" : ""}}>' +
            '<input name="{{reName}}-text" type="text" class="trigger" placeholder="{{exp}}{{isRequired ? \'(必填)\' : \'\'}}" readonly>');
        var element = $(render(option));
        var depSelect = userList.departmentSelect();
        element.find('input.trigger').on('click', function () { depSelect.show(); });
        depSelect.on('select', function (e, dep) {
            element.find('input.trigger').val(dep.orgName);
            element.find('input[type=hidden]').val(dep.orgId);
        });
        return element;
    };

    module.exports = widgets;
});
