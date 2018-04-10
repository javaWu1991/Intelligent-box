var monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
var monthNamesShort = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
var DayPad = 86399000; // 23:59:59 -> ms

$.fn.extend({
    serializeObject: function() {
        var data = {};
        if (this.length > 0) {
            var element = this[0];
            var fields = $(element).serializeArray();
            var data = {};
            $.each(fields, function(index, field) {
                var name = field.name;
                var value = field.value;
                if (data[name]) {
                    if ($.type(data[name]) == 'array') data[name].push(value);
                    else data[name] = [data[name], value];
                } else {
                    data[name] = value;
                }
            });
        }
        return data;
    }
});

function ajaxError() {
    Yiqi.hidePreloader();
    Yiqi.toast('请求失败', '<i class="iconfont">&#xe60b;</i>').show();
}

function ajaxBeforeSend() {
    Yiqi.showPreloader();
}

function parseTime(time, format, defaults) {
    format = format || 'YYYY-MM-DD';
    time = moment(time, 'x');
    if (time.isValid()) {
        time = time.format(format);
    } else {
        time = defaults || '';
    }
    return time;
}

function nl2br(str) {
    return _.isString(str) ? str.replace(/\r\n/g, '<br/>') : str;
}

var walkListLevel = 0;

function walkList(list, parent, func, key) {
    if (_.isArray(list) && _.isFunction(func)) {
        key = !_.isString(key) ? 'children' : key;
        walkListLevel++;
        _.each(list, function(element, index, list) {
            // 如果 element 是一个对象
            // 为其添加一个 __level 属性，表示当前元素所在的层级
            // if (typeof element === 'object')
            //     element.__level = walkListLevel;

            func(element, parent, walkListLevel);

            if (_.isArray(element[key])) {
                // 如果有下一级，则当前元素作为父级元素
                walkList(element[key], element, func, key);
            }
        });
        walkListLevel--;
    }
}

function str2color(str) {
    if (!_.isString(str)) {
        // 默认颜色
        return 'c7c7c7';
    }
    var code = 0;
    var temp = 0;
    var codeStr = '';
    var i = 0;
    for (i = 0; i < str.length; i++) {
        code += str.charCodeAt(i);
    }
    for (i = 0; i < 3; i++) {
        temp = code % 192;
        codeStr += ('00' + temp.toString(16)).slice(-2);
        code = Math.round(code * temp / 127);
    }
    return codeStr;
}

function getShortName(name) {
    return _.isString(name) && name.length > 2 ? name.substr(-2) : name;
}

/*
 * modal的通用ajax回调
 */
var ajaxCallback = {
    beforeSend: function() {
        Yiqi.showPreloader('正在提交...');
    },
    error: function() {
        Yiqi.hidePreloader();
        Yiqi.toastError('请求失败');
    },
    success: function(resp) {
        Yiqi.hidePreloader();
        resp = _.extend({
            success: false,
            message: '操作失败'
        }, resp);
        if (resp.success) {
            Yiqi.toastSuccess();
            Yiqi.closeModal(this.el);
            if (Yiqi.mainView.activePage.name == 'index') getIndexPageView().load();
            else Yiqi.mainView.router.refreshPage();
        } else {
            Yiqi.toastWarning(resp.message);
        }
    }
}