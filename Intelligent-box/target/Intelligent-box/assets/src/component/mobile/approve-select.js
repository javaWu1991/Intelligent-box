define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');
    var userList = require('./user-list');

    var itemTemplate = '<div class="approver-item" data-key={{userId}}>\
        <div class="avatar" style="background:#{{colorCode}}">\
            {{subName}}\
        </div><span class="name">{{subName}}</span></div>';
    var itemRender = template(itemTemplate);

    var getSelectedIds = function (selectedItems) {
        var ids = [];
        for (var key in selectedItems) {
            if (selectedItems[key] === true) {
                ids.push(key);
            }
        }
        return ids.join(',');
    };

    var approveSelect = function (elem, multi) {
        var trigger = elem.find('.trigger'),
            inputer = elem.find('input[type=hidden]');
        var dataCache, selectedItems = {};
        var empSelect = userList.employeeSelect();

        trigger.on('click', function () {
            empSelect.show();
        });
        empSelect.on('select', function (e, emp) {
            if (selectedItems[emp.userId]) {
                alert('不能选择重复的审批人！');
                return false;
            }

            var $item = $(itemRender(emp));
            $item.find('.avatar').on('click', function () {
                selectedItems[emp.userId] = false;
                $item.remove();
                inputer.val(getSelectedIds(selectedItems));
                if (!multi) {
                    trigger.show();
                }
            });

            selectedItems[emp.userId] = true;
            $item.insertBefore(trigger);
            inputer.val(getSelectedIds(selectedItems));
            if (!multi) {
                trigger.hide();
            }
        });
    };

    module.exports = approveSelect;
});
