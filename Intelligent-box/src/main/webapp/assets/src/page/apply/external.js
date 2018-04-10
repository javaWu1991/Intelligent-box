'use strict';
define(function(require, exports) {
    var $ = require('jquery');
    require('jquery-util');
    require('jquery-form');
    require('metisMenu');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var template = require('template');
    var Pager = require('component/Pager');
    var App = require('./App');
    var Modal = require('./Modal');
    var DataTable = require('./DataTable');
    var AppCollection = require('./AppCollection');
    Backbone.emulateHTTP = true;

    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var appItemRender = template($('#tmpl-externalAppItem').html());
    var AppItemView = Backbone.View.extend({
        tagName: 'tr',
        template: appItemRender,
        events: {
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="delete"]': 'doDelete',
            'click [data-do="disable"]': 'doDisable',
            'click [data-do="enable"]': 'doEnable'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        doEdit: function() {
            Backbone.trigger('edit:app', this.model, this);
        },
        doDelete: function() {
            var model = this.model;
            confirm('确认删除？', function() {
                model.destroy({
                    success: function(model, resp, options) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);

                        if (resp.success) {
                            alert('操作成功').delay(1);
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    }
                });
            });
        },
        doDisable: function() {
            this.model.toggleStatus();
        },
        doEnable: function() {
            this.model.toggleStatus();
        },
        render: function() {
            var markup = this.template({
                model: this.model.serialize()
            });
            this.$el.html(markup);
            return this;
        }
    });

    function run() {
        $('.primary-nav').metisMenu();
        var query = new Backbone.Model({
            isInside: App.SCOPE_EXTERNAL
        });
        var list = new AppCollection();
        _.extend(list, {
            url: CONTEXT_PATH + '/web/apply/selectApplyByNameAndType.do?isInside=1',
            refresh: function(data) {
                var query = search.serialize();
                searchHandler(_.extend(query, data));
            }
        });
        var table = new DataTable({
            el: '#table-app',
            collection: list,
            itemView: AppItemView
        });
        // 搜索表单
        var search = new SearchForm({
            el: '#search',
            collection: list
        });
        search.on('search', function(data) {
            _.extend(data, query.toJSON());
            searchHandler(data);
        });
        // 分页
        var pager = new Pager({
            className: 'pagination pull-right',
            collection: list
        });
        pager.listenTo(list, 'sync', function(collection, resp) {
            if (collection instanceof Backbone.Collection) {
                var pageVo = resp.pageVo;
                if (_.isObject(pageVo)) {
                    var attrs = _.pick(pageVo, 'pageNo', 'pageSize', 'totalCount');
                    attrs.totalPages = pageVo.pageTotal;
                    this.update(attrs);
                } else {
                    this.$el.empty();
                }
            }
        });
        pager.on('page', function(pageNo) {
            var data = search.serialize();
            _.extend(data, {
                pageNo: pageNo
            }, query.toJSON());

            searchHandler(data);
        });
        table.$el.after(pager.render().$el);
        // 编辑操作
        Backbone.on('edit:app', function(model) {
            var type = model.get('type');
            if (type == 1) {
                var modal = new Modal.AndroidInputModal({
                    model: model,
                    collection: list
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            } else if (type == 2) {
                var modal = new Modal.iOSInputModal({
                    model: model,
                    collection: list
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            } else if (type == 3) {
                var modal = new Modal.H5InputModal({
                    model: model,
                    collection: list
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            } else if (type == 4) {
                var modal = new Modal.FWInputModal({
                    model: model,
                    collection: list
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            }

        });
        // 新建各类应用操作
        $('[data-do="create:android"]').on('click', function() {
            var modal = new Modal.AndroidInputModal({
                model: new App({
                    isInside: 1
                }),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:ios"]').on('click', function() {
            var modal = new Modal.iOSInputModal({
                model: new App({
                    isInside: 1
                }),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:h5"]').on('click', function() {
            var modal = new Modal.H5InputModal({
                model: new App({
                    isInside: 1
                }),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:fw"]').on('click', function() {
            var modal = new Modal.FWInputModal({
                model: new App({
                    isInside: 1
                }),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        function searchHandler(data) {
            var clean = data;
            // 过滤空的搜索条件
            if (_.isObject(data) && !_.isArray(data)) {
                var clean = {}
                _.each(data, function(value, key) {
                    if (_.isObject(value)) {
                        if (!_isEmpty(value)) clean[key] = value;
                    } else {
                        if (value.toString() != '') clean[key] = value;
                    }
                });
            }
            list.fetch({
                type: 'post',
                parse: true,
                reset: true,
                data: clean
            });
        }

        searchHandler(query.toJSON());
    }

    exports.run = run;
});