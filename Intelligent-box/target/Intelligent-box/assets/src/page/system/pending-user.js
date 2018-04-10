define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var Pager = require('component/Pager');
    var template = require('template');
    var Model = require('component/Model');
    require('jquery-form');
    require('jquery-util');
    require('metisMenu');
    Backbone.emulateHTTP = true;
    /*
     * 模型
     */
    var OrgUser = require('./OrgUser');
    /*
     * 审核
     */
    var reviewModalRender = template($('#tmpl-reviewModal').html());
    var ReviewModal = FormModal.extend({
        template: reviewModalRender,
        submit: function() {
            var data = this.$form.serializeObject();
            this.model.save(null, {
                url: CONTEXT_PATH + '/api/users/approval/commit',
                context: this,
                data: data,
                success: function(model, resp, options) {
                    resp = _.extend({
                        success: false,
                        message: '未知错误'
                    }, resp);

                    if (resp.success == true) {
                        alert('操作成功').delay(1);
                        this.collection.refresh();
                        this.hide();
                    } else {
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
            });
        }
    });
    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-item').html());
    var ItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click [data-do="delete"]': 'doDelete',
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="review"]': 'doReview'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        doEdit: function() {
            Backbone.trigger('edit:orgUser', this.model, this);
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
        doReview: function() {
            Backbone.trigger('review', this.model, this);
        },
        render: function() {
            var markup = this.template({
                model: this.model.serialize()
            });
            this.$el.html(markup);
            return this;
        }
    });
    /*
     * 表格
     * 
     * 监听集合的 reset 事件更新视图
     */
    var dataTableRender = template($('#tmpl-dataTable').html());
    var DataTable = Backbone.View.extend({
        template: dataTableRender,
        noDataRender: template('<tr><td colspan="{{count}}">暂无数据</td></tr>'),
        loadingRender: template('<tr><td colspan="{{count}}">数据加载中...</td></tr>'),
        initialize: function() {
            this.cacheEls();

            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'request', this.request);
            this.listenTo(this.collection, 'sync', this.sync);
            this.listenTo(this.collection, 'error', this.error);
            this.listenTo(this.collection, 'destroy', this.refresh);
        },
        addOne: function(model, collection, options) {
            var itemView = new ItemView({
                model: model
            });
            this.$items.append(itemView.render().el);
        },
        reset: function(collection, options) {
            var previousModels = options.previousModels;
            _.each(previousModels, function(model) {
                model.trigger('remove');
            });

            this.$items.empty();

            if (collection.length == 0) {
                this.$items.html(this.noDataRender({
                    count: 7
                }));
            } else {
                collection.each(function(model, index) {
                    model.set({
                        index: index + 1,
                        $index: index
                    });
                    this.addOne(model, collection);
                }, this);
            }
        },
        cacheEls: function() {
            this.$headers = this.$('[role="col-headers"]');
            this.$items = this.$('[role="items"]');
        },
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: 7
                });

                this.$items.empty().html(markup);
            }
        },
        error: function() {
            this.$items.html(this.noDataRender({
                count: 7
            }));
        },
        refresh: function() {
            var orgId = this.model.get('id');
            this.collection.refresh();
        }
    });

    function run() {
        $('.primary-nav').metisMenu();

        // 数据集合
        var list = new Backbone.Collection(null, {
            model: OrgUser
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/api/users/approval/' + COMPANY_ID,
            // 处理响应的数据，解析后返回
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);
                var items = _.isArray(parsed.model) ? parsed.model : [];
                return items;
            },
            refresh: function() {
                this.fetch({
                    parse: true,
                    reset: true
                });
            }
        });
        // 表格视图对象，监听数据集合的变化进行视图的刷新
        var table = new DataTable({
            el: '#sole-table',
            collection: list
        });

        var modal;
        Backbone.on('review', function(model) {
            confirm('通过对该用户的审核', function() {
                $.ajax({
                    url: CONTEXT_PATH + '/api/users/approval/commit',
                    context: this,
                    type: 'post',
                    data: {
                        id: model.get('id'),
                        mobile: model.get('account'),
                        status: 1,
                        company: COMPANY_NAME
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '未知错误'
                        }, resp);

                        if (resp.success == true) {
                            alert('操作成功').delay(1);
                            list.refresh();
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败，请重试');
                    }
                });


            });
        });

        list.fetch({
            parse: true,
            reset: true
        });
    }

    exports.run = run;
});