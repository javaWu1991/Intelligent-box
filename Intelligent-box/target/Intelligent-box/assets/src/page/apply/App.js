define(function(require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Model = require('component/Model');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var App = Model.extend({
        defaults: {
            name: '',
            version: '',
            isInside: 0, // 0 内部应用
            intro: '',
            state: 1,
            type: 0,
            tokentype: 0, // 0 普通模式 1 回调模式
            token: '',
            needlogin: 0, // 0 需要 1 不需要
            isopen: 1, // 0 不开放 1 开放
            hide: 1, // 0 是 1 否
            preset: 1 // 0 是 1 否
        },
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('state');
            var statusMap = {
                0: '禁用',
                1: '启用'
            };

            var type = this.get('type');
            var typeMap = {
                1: '安卓',
                2: 'iOS',
                3: 'H5',
                4: '服务号'
            }
            
            data.typeText = typeMap[type] || '未知';
            data.statusText = statusMap[state] || '未知状态';
            data._isNew = this.isNew();

            return data;
        },
        destroy: function(options) {
            App.__super__.destroy.call(this, _.extend({
                url: CONTEXT_PATH + '/web/apply/deleteApply.do',
                data: {
                    applyId: this.id
                }
            }, this.syncOptions, options));
        },
        toggleStatus: function() {
            var state = this.get('state');
            if (state == 0) {
                state = 1;
            } else if (state == 1) {
                state = 0;
            }
            var confirmText = state == 0 ? '确认停用？' : '确认启用？';
            var that = this;
            confirm(confirmText, function (){
                that.save(null, {
                    url: CONTEXT_PATH + '/web/apply/updateApplyState.do',
                    context: that,
                    data: {
                        applyId: that.id
                    },
                    success: function(model, resp, options) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);
                        if (resp.success == true) {
                            alert('操作成功').delay(1);
                            that.set('state', state);
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    }
                });
            })
            
        }
    }, {
        SCOPE_INTERNAL: 0,
        SCOPE_EXTERNAL: 1
    });

    return App;
});