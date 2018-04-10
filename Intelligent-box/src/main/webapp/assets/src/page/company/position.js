define(function(require, exports, module) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var Pager = require('component/Pager');
    var Model = require('component/Model');
    var template = require('template');
    var moment = require('moment');
    require('umeditor-config');
    require('umeditor');
    require('umeditor-lang');
    require('jquery-form');
    require('metisMenu');
    require('jquery-validate');
    Backbone.emulateHTTP = true;
    /*
     * 模型
     */
    var Position = Model.extend({
        defaults: {
            positionName: '',
            cid: 0,
            detail: '',
            content: '',
            createTime: '',
            cname: '',
            dname: ''
        },
        serialize: function() {
            var data = this.toJSON();
            var createTime = parseInt(this.get('createTime'), 10);
            var createTimeText = '';
            if (createTime > 0) {
                createTime = moment(createTime);
                createTimeText = createTime.isValid() ? createTime.format('YYYY-MM-DD HH:mm') : '';
            }
            var cname = this.get('cname');
            var dname = this.get('dname');
            var sender = dname != '' ? dname : cname;
            data.createTimeText = createTimeText;
            data.sender = sender;
            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        },
        destroy: function(options) {
            var id = this.id;
            $.ajax({
                type: 'delete',
                dataType: 'json',
                context: this,
                url: CONTEXT_PATH + '/api/position/delete/' + id,
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);

                    if (resp.success) {
                        this.trigger('destroy', this, this.collection);
                    } else {
                        if (resp.message == '') resp.message = '操作失败';
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
            });
        },
        save: function(attrs, options) {
            Position.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        }
    });
    require('json2');
    var positionCreateModalRender = template($('#tmpl-positionCreateModal').html());
    var PositionCreateModal = FormModal.extend({
        template: positionCreateModalRender,
        initForm: function() {
            this.$form.validate({
                rules: {
                    positionName: {
                        required: true,
                        rangelength: [1, 255]
                    },
                    level: {
                        required: true,
                        digits: true
                    }
                },
                messages: {
                    positionName: {
                        required: '必填项',
                        rangelength: '字符数不超过255个'
                    },
                    level: {
                        required: '必填项',
                        digits: '请输入数字'
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: CONTEXT_PATH + '/api/position/add',
                    context: this,
                    data: params,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);
                        if (resp.success) {
                            this.collection.refresh();
                            alert('操作成功').delay(1);
                            this.hide();
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    },
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        }
    });

    var positionEditModalRender = template($('#tmpl-positionEditModal').html());
    var PositionEditModal = PositionCreateModal.extend({
        template: positionEditModalRender,
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: CONTEXT_PATH + '/api/position/update',
                    context: this,
                    data: params,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);
                        if (resp.success) {
                            this.collection.refresh();
                            alert('操作成功').delay(1);
                            this.hide();
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    },
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
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
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="delete"]': 'doDelete'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        doEdit: function() {
            Backbone.trigger('edit:position', this.model, this);
        },
        doDelete: function() {
            var model = this.model;
            confirm('确认删除？', function() {
                model.destroy();
            });
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
    var DataTable = Backbone.View.extend({
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
                    count: this.colHeadersCount
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
            this.colHeadersCount = this.$headers.find('th').size();
        },
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colHeadersCount
                });

                this.$items.empty().html(markup);
            }
        },
        refresh: function() {
            this.collection.refresh();
        }
    });

    function run() {
        $('.primary-nav').metisMenu();
        var query = new Backbone.Model();
        _.extend(query, {
            autoParam: function() {
                return {
                    cid: COMPANY_ID
                }
            },
            getData: function() {
                var attrs = this.toJSON();
                return attrs;
                // return _.extend(attrs, this.autoParam());
            }
        });
        var list = new Backbone.Collection(null, {
            model: Position
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/api/position/list/' + COMPANY_ID,
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);
                var items = _.isArray(parsed.model) ? parsed.model : [];
                _.each(items, function(item, index) {
                    item.companyId = item.cid;
                    delete item.cid;
                });
                return items;
            },
            refresh: function(options) {
                var data = query.getData();
                options = $.extend(true, {
                    type: 'post',
                    parse: true,
                    reset: true,
                    data: data
                }, options);

                this.fetch(options);
            }
        });

        var table = new DataTable({
            el: '#sole-table',
            model: query,
            collection: list
        });

        var pager = new Pager({
            className: 'pagination pull-right'
        });

        pager.listenTo(list, 'sync', function(collection, resp, options) {
            var pageVo = resp.pageVo;
            if (pageVo == null) {
                this.$el.empty();
            } else {
                var attrs = _.pick(pageVo, 'pageNo', 'pageSize', 'totalCount');
                attrs.totalPages = pageVo.pageTotal;
                this.update(attrs);
            }
        });

        pager.on('page', function(pageNo) {
            query.set('pageNo', pageNo);
            searchHandler(query.getData());
        });

        table.$el.after(pager.render().$el);

        function searchHandler(data) {
            var clean = data;
            // 过滤空的搜索条件
            if (_.isObject(data) && !_.isArray(data)) {
                clean = {};
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

        searchHandler(query.getData());

        var modal;
        $('[data-do="create:position"]').on('click', function() {
            var attrs = {
                companyId: COMPANY_ID
            }
            modal = new PositionCreateModal({
                model: new Position(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:position', function(model) {
            modal = new PositionEditModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });
    }

    exports.run = run;
});