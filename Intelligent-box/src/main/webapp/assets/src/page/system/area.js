'use strict';
define(function(require, exports) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('jquery-form');
    require('jquery-validate');
    require('metisMenu');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var Model = require('component/Model');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var template = require('template');
    var moment = require('moment');
    var Pager = require('component/Pager');
    Backbone.emulateHTTP = true;

    /*
     * 新建 - 企业
     */
    var areaCreateModalRender = template($('#tmpl-areaCreateModal').html());
    var AreaCreateModal = FormModal.extend({
        template: areaCreateModalRender,
        initialize: function() {
            AreaCreateModal.__super__.initialize.call(this);
        },
        render: function() {
            AreaCreateModal.__super__.render.call(this);
            return this;
        },
        initForm: function() {
            this.$form.validate({
                rules: {
                    name: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: '必填项'
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/city/addcity.do',
                    context: this,
                    data: {
                        parent_id: this.model.get('parent_id'),
                        level: this.model.get('level')
                    },
                    success: function(resp) {

                        if (resp.success) {
                            alert('操作成功').delay(1);
                            this.collection.refresh();
                            if (this.model.get('level') == 1) {
                                $("#table-city").find("tr").remove();
                                $("#table-qu").find("tr").remove();
                            }
                            if (this.model.get('level') == 2) {
                                $("#table-qu").find("tr").remove();
                            }
                            this.hide();
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    },
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            AreaCreateModal.__super__.remove.call(this);
        }
    });

    /*
     * 编辑 - 角色
     */
    var areaEditModalRender = template($('#tmpl-areaEditModal').html());
    var AreaEditModal = FormModal.extend({
        template: areaEditModalRender,
        initialize: function() {
            AreaEditModal.__super__.initialize.call(this);
        },
        render: function() {
            AreaEditModal.__super__.render.call(this);
            return this;
        },

        initForm: function() {
            this.$form.validate({
                rules: {
                    name: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: '必填项'
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/city/editcity.do',
                    context: this,
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            messages: '操作失败'
                        }, resp);

                        if (resp.success) {
                            alert('操作成功').delay(1);
                            this.collection.refresh();
                            this.hide();
                        } else {
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    },
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            AreaEditModal.__super__.remove.call(this);
        }
    });

    /*
     * 模型
     */
    var Area = Backbone.Model.extend({
        $selected: false,
        // ajax 请求的参数设置
        syncOptions: {
            wait: true,
            processData: true
        },
        // 成员属性
        defaults: {
            name: '',
            parent_id: "",
            level: ""
        },
        /*
         * 数据处理，用于界面显示
         */
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('status');
            var createTime = this.get('createTime');
            var statusMap = {
                0: '禁用',
                1: '启用',
                2: '待审核'
            };

            createTime = moment(parseInt(createTime, 10));
            var createTimeText = createTime.isValid() ? createTime.format('YYYY-MM-DD HH:mm:ss') : '';
            data._isNew = this.isNew();
            data.statusText = statusMap[state] || '未知状态';
            data.createTimeText = createTimeText;

            return data;
        },
        /*
         * 删除 delete
         */
        destroy: function(options) {
            Area.__super__.destroy.call(this, _.extend({
                url: CONTEXT_PATH + '/web/city/deletecity.do',
                data: {
                    id: this.id
                }
            }, this.syncOptions, options));
        },
        /*
         * 保存 insert/update
         */
        save: function(attrs, options) {
            Area.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        },

    }, {
        STATE_ENABLE: 1,
        STATE_DISABLE: 0,
        STATE_PENDING: 2
    });
    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-areaItem').html());
    var AreaItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="delete"]': 'doDelete',
            'click [data-do="next"]': 'doNext'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        /*
         * 编辑 - UI 触发
         */
        doEdit: function() {
            Backbone.trigger('edit:province', this.model, this);
        },
        doNext: function() {
            this.$el.parent().find("tr").removeClass('active');
            Backbone.trigger('next:province', this.model, this);
            this.$el.addClass('active');
        },
        /*
         * 删除 - UI 触发
         */
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
        events: {
            'change [data-do="toggleAll"]': 'doToggleAll'
        },
        initialize: function() {
            this.cacheEls();

            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'request', this.request);
            this.listenTo(this.collection, 'sync', this.sync);
            this.listenTo(this.collection, 'error', this.error);
            this.listenTo(this.collection, 'destroy', this.refresh);
        },
        /*
         * 添加一行
         */
        addOne: function(model) {
            var itemView = new AreaItemView({
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

            if (collection.length === 0) {
                this.$items.html(this.noDataRender({
                    count: 7
                }));
            } else {
                collection.each(function(model, index) {
                    model.set({
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
        refresh: function() {
            this.collection.refresh();
        }
    });



    function run() {


        $('.primary-nav').metisMenu();

        // 页面初始化
        var proCollection = null;
        var cityCollection = null;
        var quCollection = null;

        var url = CONTEXT_PATH + '/api/web/city/areaview?level=1';
        proCollection = initial(url, "#table-pro");

        Backbone.on('next:province', function(e) {

            if (e.attributes.level == 1) {
                var url = CONTEXT_PATH + "/api/web/city/arealist?id=" + e.id;
                var quUrl = CONTEXT_PATH + "/api/web/city/arealist";
                cityCollection = initial(url, "#table-city");

                $("#table-qu").find("tr").remove();
            }

            if (e.attributes.level == 2) {
                var url = CONTEXT_PATH + "/api/web/city/arealist?id=" + e.id;
                quCollection = initial(url, "#table-qu");
            }

        });


        var modal;
        $('[data-do="create:province"]').on('click', function() {
            modal = new AreaCreateModal({
                model: new Area({
                    parent_id: 1,
                    level: 1
                }),
                collection: proCollection
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:city"]').on('click', function() {
            var id = $("#table-pro").find("tr").filter(".active").find("td").eq(0).html();
            if (id) {
                modal = new AreaCreateModal({
                    model: new Area({
                        parent_id: id,
                        level: 2
                    }),
                    collection: cityCollection
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            } else {
                alert('请先选择上级区域');
            }
        });

        $('[data-do="create:qu"]').on('click', function() {
            var id = $("#table-city").find("tr").filter(".active").find("td").eq(0).html();
            if (id) {
                modal = new AreaCreateModal({
                    model: new Area({
                        parent_id: id,
                        level: 3
                    }),
                    collection: quCollection
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            } else {
                alert('请先选择上级区域');
            }
        });

        Backbone.on('edit:province', function(model) {

            var editLevel = model.get('level');
            var editCollection = null;
            if (editLevel == 1) {
                editCollection = proCollection;
            }
            if (editLevel == 2) {
                editCollection = cityCollection;
            }
            if (editLevel == 3) {
                editCollection = quCollection;
            }

            modal = new AreaEditModal({
                model: model,
                collection: editCollection
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        function initial(url, areaId) {
            var list = new Backbone.Collection(null, {
                model: Area
            });
            _.extend(list, {
                url: url,
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
                        type: 'post',
                        parse: true,
                        reset: true
                    });
                },
                getSelection: function() {
                    return this.filter(function(model) {
                        return model.$selected;
                    });
                }
            });
            // 表格视图对象，监听数据集合的变化进行视图的刷新
            var table = new DataTable({
                el: areaId,
                collection: list
            });
            // 分页视图对象
            var pager = new Pager({
                className: 'pagination pull-right',
                collection: list
            });

            // 搜索表单
            var search = new SearchForm({
                el: '#search',
                collection: list
            });
            search.on('search', searchHandler);

            // 监听数据集合的异步请求，根据响应的结果刷新视图
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
                });

                searchHandler(data);
            });

            // 将分页视图渲染到界面上
            $('.toolbar-bottom').append(pager.render().$el);



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

            searchHandler();

            return list;
        }
    }

    exports.run = run;
});