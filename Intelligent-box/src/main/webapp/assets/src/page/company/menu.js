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

    var DataNode = Backbone.Model.extend({
        defaults: {
            level: 1,
            selected: 0,
            parentId: 0,
            index: 0,
            name: '',
            items: []
        },
        parse: function(resp) {
            resp = _.extend({
                success: false,
                model: []
            }, resp);

            var items = [];
            if (_.isArray(resp.model)) {
                items = resp.model;
            }

            return {
                items: items
            };
        },
        fetchByLevel: function() {
            this.url = CONTEXT_PATH + '/api/web/city/areaview';
            var level = this.get('level');
            this.fetch({
                data: {
                    level: level
                }
            });
        },
        fetchByParent: function() {
            this.url = CONTEXT_PATH + '/api/web/city/arealist';
            var parentId = this.get('parentId');
            this.fetch({
                data: {
                    id: parentId
                }
            });
        }
    });

    var TreeDataManager = Backbone.View.extend({
        selected: [],
        className: 'area-picker',
        maxLevel: 3,
        initialize: function(options) {
            options || (options = {});

            _.extend(this, _.pick(options, 'maxLevel', 'selected'));

            this.collection = new Backbone.Collection(null, {
                model: AreaModel
            });

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'change:selected', this.change);

            this.initSelect(options);
        },
        initSelect: function(options) {
            var selected = this.selected;
            if (_.isArray(selected) && selected.length > 0) {
                _.each(selected, function(areaId, index) {
                    var parentId = '';
                    if (index > 0) parentId = selected[index - 1];
                    this.collection.add({
                        selected: areaId,
                        parentId: parentId, // 优先使用 parentId 获取数据
                        level: index + 1
                    });
                }, this);
            } else {
                this.collection.add({
                    selected: 0,
                    parentId: '',
                    level: 1
                });
            }
        },
        addOne: function(model, collection, options) {
            var select = new AreaSelect({
                model: model
            });

            this.$el.append(select.$el);
        },
        change: function(model, value, options) {
            var level = model.get('level');
            var next = level + 1;
            var id = model.get('selected');

            var toRemove = [];
            this.collection.each(function(model) {
                var modelLevel = model.get('level');
                if (modelLevel > level) toRemove.push(model);
            });

            this.collection.remove(toRemove);
            if (this.collection.length < this.maxLevel) {
                this.collection.add({
                    selected: 0,
                    parentId: id,
                    level: next
                });
            }
        },
        getSelection: function() {
            var data = [];
            this.collection.each(function(model) {
                var selected = model.get('selected');
                var name = model.get('name');

                data.push({
                    id: selected,
                    name: name
                });
            });

            return data;
        }
    });



    function initForm() {
        this.$form.validate({
            rules: {
                name: {
                    required: true
                },
                link: {
                    required: true,
                    url: true
                    }
            },
            messages: {
                name: {
                    required: '必填项'
                },
                link: {
                    required: '必填项',
                    url: '格式不正确'
                }
            }
        });
    }

    var menuCreateModalRender = template($('#tmpl-menuCreateModal').html());
    var MenuCreateModal = FormModal.extend({
        template: menuCreateModalRender,
        initialize: function() {
            MenuCreateModal.__super__.initialize.call(this);
        },
        render: function() {
            MenuCreateModal.__super__.render.call(this);
            return this;
        },
        initForm: initForm,
        submit: function(event) {
            if (this.$form.valid()) {
                var sid=getUrlParam('sid');
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/api/fmenu/insert',
                    context: this,
                    data: {
                        id: this.model.get('id'),
                        fMenu: this.model.get('fMenu'),
                        level: this.model.get('level'),
                        sid:sid
                    },
                    success: function() {
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
            MenuCreateModal.__super__.remove.call(this);
        }
    });

    /*
     * 编辑 - 角色
     */
    var menuEditModalRender = template($('#tmpl-menuEditModal').html());
    var MenuEditModal = FormModal.extend({
        template: menuEditModalRender,
        initialize: function() {
            MenuEditModal.__super__.initialize.call(this);
        },
        render: function() {
            MenuEditModal.__super__.render.call(this);
            return this;
        },

        initForm: initForm,
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var sid=getUrlParam('sid');
                var params = this.$form.serializeObject();
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/api/fmenu/update',
                    context: this,
                    data: {
                        id: this.model.get('id'),
                        fMenu: this.model.get('fMenu'),
                        level: this.model.get('level'),
                        sid:sid
                    },
                    success: function() {
                        alert('操作成功').delay(1);
                        this.collection.refresh();
                        this.hide();
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
            MenuEditModal.__super__.remove.call(this);
        }
    });

    /*
     * 模型
     */
    var Menu = Backbone.Model.extend({
        $selected: false,
        // ajax 请求的参数设置
        syncOptions: {
            wait: true,
            processData: true
        },
        // 成员属性
        defaults: {
            name: '',
            id: '',
            link: '',
            fMenu: '',
            level: ''
        },
        /*
         * 数据处理，用于界面显示
         */
        serialize: function() {
            var data = this.toJSON();
            data._isNew = this.isNew();
            return data;
        },
        /*
         * 删除 delete
         */
        destroy: function(options) {
            var id = this.id;
            var sid=getUrlParam('sid');
            var url = CONTEXT_PATH + '/api/fmenu/delete/' + id;
            Menu.__super__.destroy.call(this, _.extend({
                url: url,
                type: 'get',
            }, this.syncOptions, options));
        },
        /*
         * 保存 insert/update
         */
        save: function(attrs, options) {
            Menu.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        }
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
    var itemRender = template($('#tmpl-menuItem').html());
    var MenuItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="delete"]': 'doDelete',
            'click': 'doSelect'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        /*
         * 编辑 - UI 触发
         */
        doEdit: function(event) {
            event.stopPropagation();
            Backbone.trigger('edit:province', this.model, this);
        },
        doSelect: function() {
            Backbone.trigger('get:fMenu', this.model, this);
            this.$el.parent().find("tr").removeClass('active');
            Backbone.trigger('next:province', this.model, this);
            this.$el.addClass('active');
        },
        /*
         * 删除 - UI 触发
         */
        doDelete: function() {
            event.stopPropagation();
            var model = this.model;
            confirm('确认删除？', function() {
                model.destroy();
            });
        },
        render: function() {
            var markup = this.template({
                model: this.model.serialize()
            });
            this.$el.html(markup).data('id', this.model.id);
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
            var itemView = new MenuItemView({
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
                    count: 4
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
                    count: 4
                });

                this.$items.empty().html(markup);
            }
        },
        refresh: function() {
            this.collection.refresh();
        }
    });
    function getUrlParam(name){  
        //构造一个含有目标参数的正则表达式对象  
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
        //匹配目标参数  
        var r = window.location.search.substr(1).match(reg);  
        //返回参数值  
        if (r!=null) return unescape(r[2]);  
        return null;  
    } 
    

    function run() {
        $('.primary-nav').metisMenu();

        // 页面初始化
        var proCollection = null;
        var cityCollection = null;
        var quCollection = null;
        var sid=getUrlParam('sid');

        var url = CONTEXT_PATH + '/api/fmenu/select/0/'+sid;
        proCollection = initial(url, "#table-pro");

        Backbone.on('next:province', function(e) {
            if (e.attributes.level == 1) {
                var url = CONTEXT_PATH + "/api/fmenu/select/" + e.id+"/"+sid;
                cityCollection = initial(url, "#table-city");
                $("#table-qu").find("tr").remove();
            }

            if (e.attributes.level == 2) {
                var url = CONTEXT_PATH + "/api/fmenu/select/" + e.id+"/"+sid;
                quCollection = initial(url, "#table-qu");
            }

        });


        var modal;
        $('[data-do="create:province"]').on('click', function() {
            modal = new MenuCreateModal({
                model: new Menu({
                    fMenu: 0,
                    level: 1
                }),
                collection: proCollection
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:city"]').on('click', function() {
            var id = $("#table-pro").find("tr").filter(".active").data('id');
            if (id) {
                modal = new MenuCreateModal({
                    model: new Menu({
                        fMenu: id,
                        level: 2
                    }),
                    collection: cityCollection
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            }
        });

        $('[data-do="create:qu"]').on('click', function() {
            var id = $("#table-city").find("tr").filter(".active").data('id');
            if (id) {
                modal = new MenuCreateModal({
                    model: new Menu({
                        fMenu: id,
                        level: 3
                    }),
                    collection: quCollection
                });
                modal.render().$el.appendTo(document.body);
                modal.initForm();
                modal.show();
            }
        });
        Backbone.on('get:fMenu', function(model) {
            var getfMenu = function() {
                console.log('aaa');
                var id = model.id;
                var ids = [];
                var lv = model.get('level');
                var lvs = [];
                if (lvs.length > 0) {
                    if ((lv - lvs[lvs.length - 1]) <= 1) {
                        lvs.push(lv);
                        ids.push(id);
                        return ids[ids.length - 1];
                    }
                };
            };
        })
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

            modal = new MenuEditModal({
                model: model,
                collection: editCollection
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        function initial(url, areaId) {
            var list = new Backbone.Collection(null, {
                model: Menu
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

            function searchHandler(data) {
                var clean = data;
                // 过滤空的搜素条件
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