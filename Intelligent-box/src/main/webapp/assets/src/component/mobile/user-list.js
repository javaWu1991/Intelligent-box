define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');
    var loader = require('./loader');

    var depUrl = CONTEXT_PATH + '/user/getDepts.do';
    var empUrl = CONTEXT_PATH + '/user/getDeptUsers.do';

    var getColor = function (str) {
        var code = 0, temp = 0, codeStr = '', i = 0;
        for (i = 0; i < str.length; i++) {
            code += str.charCodeAt(i);
        }
        for (i = 0; i < 3; i++) {
            temp = code % 192;
            codeStr += ('00' + temp.toString(16)).slice(-2);
            code = Math.round(code * temp / 127);
        }
        return codeStr;
    };
    var subname = function (name, length) {
        if (!length || length <= 0) {
            length = 2;
        }
        return name.slice(-1 * length);
    };
    var fuzzleSearcher = function (query) {
        var queryList = query.replace(/^\s+|\s+$/g, '').split(/\s+/);
        var regex = '.*';
        for (var i = 0; i < queryList.length; i++) {
            regex += '(' + queryList[i] + ')+.*';
        }
        return new RegExp(regex, 'ig');
    };

    var depTemplate = '<# _.each(depts, function (dep) { #>\
            <li data-key="{{dep.orgId}}">\
                <span class="name">{{dep.orgName}}</span>\
            </li>\
        <# }) #>';
    var depRender = template(depTemplate);
    var listTemplate = '<# _.each(approvers, function (item) { #>\
            <li data-key="{{item.userId}}">\
                <div class="avatar" style="background:#{{item.colorCode}}">\
                    {{item.subName}}\
                </div>\
                <span class="name">{{item.userName}}</span>\
            </li>\
        <# }) #>';
    var listRender = template(listTemplate);

    var DepartmentBuffer = null,
        EmployeeBuffer = {};
    var buildDepart= function (data) {
        var db = {};
        db['deproot'] = [];
        _.each(data, function (item) {
            if (!item.partId || item.partId === '') {
                db['deproot'].push(item);
            }
            else {
                if (!db['dep' + item.partId]) {
                    db['dep' + item.partId] = [];
                }
                db['dep' + item.partId].push(item);
            }
        });
        return db;
    };
    var getDepartment = function (parentId, cb) {
        if (DepartmentBuffer) { cb && cb(DepartmentBuffer['dep' + parentId]); }
        else {
            $.ajax({
                url: depUrl,
                type: 'get',
                dataType: 'json',
                data: {
                    parentId: parentId,
                    companyId: G.companyId
                },
                beforeSend: function () {
                    loader.show();
                },
                complete: function () {
                    loader.hide();
                },
                success: function (res) {
                    if (res.success) {
                        DepartmentBuffer = buildDepart(res.model);
                        cb && cb(DepartmentBuffer['dep' + parentId]);
                    }
                }
            });
        }
    };
    var getEmployees = function (orgId, cb) {
        if (EmployeeBuffer['emp' + orgId]) {
            cb && cb(EmployeeBuffer['emp' + orgId]);
        }
        else {
            $.ajax({
                url: empUrl,
                type: 'get',
                dataType: 'json',
                data: {
                    orgId: orgId,
                    companyId: G.companyId
                },
                beforeSend: function () {
                    loader.show();
                },
                complete: function () {
                    loader.hide();
                },
                success: function (res) {
                    if (res.success) {
                        EmployeeBuffer['emp' + orgId] = res.model;
                        cb && cb(EmployeeBuffer['emp' + orgId]);
                    }
                }
            });
        }
    };
    var toMap = function (key, list, parser) {
        var map = {};
        _.each(list, function (item) {
            map[item[key]] = parser ? parser(item) : item;
        });
        return map;
    };

    var createDepSelect = function () {
        var $depPopup = $('<div class="full-list">\
            <div class="list-header"><a href="javascript:" class="back">&lt;</a><span>部门</span></div>\
            <ul></ul></div>').hide().appendTo(document.body);
        return $depPopup;
    };
    var createEmpSelest = function () {
        var $empPopup = $('<div class="full-list">\
            <div class="list-header"><a href="javascript:" class="back">&lt;</a><span>审批人</span></div>\
            <div class="list-search"><input class="search" type="text" placeholder="搜索"></div>\
            <ul></ul></div>').hide().appendTo(document.body);
        return $empPopup;
    };

    var getDepartmentSelect = function () {
        var listStack = [], mapCache = {};

        var $depPopup = createDepSelect();

        var pushStack = function (list) {
            listStack.push(list);
            mapCache = toMap('orgId' ,listStack[listStack.length - 1]);
            $depPopup.find('ul').html(depRender({ depts: listStack[listStack.length - 1] }));
        };
        var popStack = function (list) {
            if (listStack.length <= 1) {
                $depPopup.hide();
                return;
            }
            listStack.pop(list);
            mapCache = toMap('orgId' ,listStack[listStack.length - 1]);
            $depPopup.find('ul').html(depRender({ depts: listStack[listStack.length - 1] }));
        };

        var orgShow = $depPopup.show;
        $depPopup.show = function (keep) {
            if (keep === true) {
                orgShow.apply($depPopup);
            }
            else {
                while (listStack.length > 0) { listStack.pop(); }
                getDepartment('root', function (list) {
                    pushStack(list);
                    orgShow.apply($depPopup);
                });
            }
        };

        $depPopup.on('click', '.back', function () {
            popStack();
        }).on('click', 'li', function () {
            var depkey = $(this).data('key');
            getDepartment(depkey, function (list) {
                if (!list) {
                    var hide = $depPopup.triggerHandler('select', mapCache[depkey]);
                    if (hide !== false) { $depPopup.hide(); }
                }
                else {
                    pushStack(list);
                }
            });
        });

        return $depPopup;
    };
    var getEmployeeSelect = function () {
        var mapCache = {}, listCache = [];
        var $depPopup = getDepartmentSelect(),
            $empPopup = createEmpSelest();

        var orgShow = $empPopup.show;
        $empPopup.show = function () {
            $depPopup.show();
        };
        $depPopup.on('select', function (e, dep) {
            getEmployees(dep.orgId, function (list) {
                listCache = list;
                mapCache = toMap('userId', list, function (item) {
                    item.subName = subname(item.userName);
                    item.colorCode = getColor(item.userName);
                    return item;
                });
                $empPopup.find('ul').html(listRender({ approvers: list }));
                orgShow.apply($empPopup);
            });
        });

        $empPopup.on('click', '.back', function () {
            $empPopup.hide();
            $depPopup.show(true);
        }).on('click', 'li', function () {
            var key = $(this).data('key');
            var emp = mapCache[key];

            var hide = $empPopup.triggerHandler('select', emp);
            if (hide !== false) { $empPopup.hide(); }
        });

        var inputTimer = null;
        $empPopup.find('.search').on('input', function (e) {
            if (inputTimer) { clearTimeout(inputTimer); }
            var _this = this;
            inputTimer = setTimeout(function () {
                var searchVal = $(_this).val();
                var query = fuzzleSearcher(searchVal);

                var filterList = _.filter(listCache, function (item) {
                    query.lastIndex = 0;
                    return query.test(item.userName) || query.test(item.mobile);
                });
                $empPopup.find('ul').html(listRender({ approvers: filterList }));

                inputTimer = null;
            }, 333);
        });

        return $empPopup;
    };

    module.exports = {
        departmentSelect: getDepartmentSelect,
        employeeSelect: getEmployeeSelect
    };
});
