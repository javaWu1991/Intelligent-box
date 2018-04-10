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
    var roleCreateModalRender = template($('#tmpl-roleCreateModal').html());
    var RoleCreateModal = FormModal.extend({
        template: roleCreateModalRender,
        initialize: function() {
            RoleCreateModal.__super__.initialize.call(this);
        },
        render: function() {
            RoleCreateModal.__super__.render.call(this);

            var $tree = this.$('.dept-tree').attr('id', this.cid + '-tree');
            var orgTree = new OrgTree({
                el: $tree,
                model: new Backbone.Model({
                    id: COMPANY_ID,
                    type: 'company',
                    orgName: COMPANY_NAME,
                    isParent: true
                })
            });

            this.orgTree = orgTree;

            return this;
        },
        initForm: function() {
            this.$form.validate({
                rules: {
                    description: {
                        required: true
                    },
                    role: {
                        required: true
                    }
                },
                messages: {
                    description: {
                        required: '必填项'
                    },
                    role: {
                        required: '必填项'
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                var orgs = this.orgTree.tree.getCheckedNodes(true);
                var items = [];
                _.each(orgs, function(item) {
                    var status = item.getCheckStatus();
                    if (!status.half) {
                        var org = item.org;
                        var orgId = org.id;
                        items.push(
                            orgId
                        );
                    }
                });
                var resourceId = items.join(",");
                if(resourceId==""){
                	alert("请选择权限");
                }
                else{
                    this.$form.ajaxSubmit({
                        url: CONTEXT_PATH + '/web/authority/addRole.do',
                        context: this,
                        data: {
                            resource_ids: resourceId
                        },
                        success: function(resp) {
                            resp = _.extend({
                                success: false,
                                model: {}
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
                        beforeSend: function() {
                            $target.prop('disabled', true);
                        },
                        complete: function() {
                            $target.prop('disabled', false);
                        }
                    });
                }
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            RoleCreateModal.__super__.remove.call(this);
        }
    });

    require('ztree');
    require('ztree-excheck');
    var Org = Model.extend({
        defaults: {
            id: '',
            cid: 0, // 公司 id
            orgName: '', // 部门（组织）名称
            higherId: 0, // 上级id,
            isParent: true
        }
    });
    var OrgTree = Backbone.View.extend({
        tagName: 'ul',
        className: 'ztree dept-tree',
        id: function() {
            return this.cid
        },
        initialize: function() {
            this.cacheEls();
            this.initData();
        },
        beforeNodeClick: function(treeId, treeNode, clickFlag) {
            return treeNode.level > 0;
        },
        onNodeClick: function(event, treeId, treeNode, clickFlag) {
            var model = new Org(treeNode.org);
            Backbone.trigger('list:orgUsers', model);
        },
        initTree: function(data) {
            var setting = {
                view: {
                    showLine: false,
                    showIcon: false,
                    txtSelectedEnable: true,
                    addDiyDom: addDiyDom
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                check: {
                    enable: true
                },
                async: false,
            };

            function addDiyDom(treeId, node) {
                var tId = node.tId;
                var $node = $('#' + tId);
                var type = node.type;
                $node.addClass('node-item node-' + type);
            }

            this.tree = $.fn.zTree.init(this.$tree, setting, data);
            this.treeId = this.tree.setting.treeId;
            this.trigger('treeLoaded', this);

        },
        initData: function() {
            var url = CONTEXT_PATH + '/web/authority/getAllResource.do';
            $.ajax({
                context: this,
                url: url,
                success: function(response) {
                    _.defaults(response, {
                        success: false,
                        model: []
                    });
                    var attrs = this.model.toJSON();
                    var root = {
                        id: attrs.id,
                        name: attrs.name,
                        org: attrs
                    }
                    var rootId = root.id;
                    var data = [];
                    var type = 'dept';
                    if (response.success) {
                        var items = response.model;
                        _.each(items, function(item) {
                            if (item.parent_id == "1") {
                                var children = [];
                                _.each(items, function(e) {
                                    if (e.parent_id == item.id) {
                                        children.push({
                                            id: type + e.id,
                                            name: e.name,
                                            pId: rootId,
                                            type: type,
                                            orgId: e.id,
                                            org: {
                                                id: e.id,
                                                cid: e.cid,
                                                orgName: e.name,
                                                higherId: e.parent_id
                                            }
                                        });
                                    }
                                });

                                data.push({
                                    id: type + item.id,
                                    name: item.name,
                                    pId: rootId,
                                    type: type,
                                    orgId: item.id,
                                    org: {
                                        id: item.id,
                                        cid: item.cid,
                                        orgName: item.name,
                                        higherId: item.parent_id
                                    },
                                    children: children
                                });
                            }
                        });
                    }

                    this.initTree(data);
                },
                error: function() {
                    alert('部门数据获取失败').delay(3);
                }
            });
        },
        cacheEls: function() {
            this.$tree = this.$el;
        },
        remove: function() {
            if (this.tree) $.fn.zTree.destroy(this.treeId);
            OrgTree.__super__.remove.apply(this, arguments);
        }
    });

    /*
     * 编辑 - 角色
     */
    var roleEditModalRender = template($('#tmpl-roleEditModal').html());
    var RoleEditModal = FormModal.extend({
        template: roleEditModalRender,
        initialize: function() {
            RoleEditModal.__super__.initialize.call(this);
        },
        render: function() {
            RoleEditModal.__super__.render.call(this);

            var $tree = this.$('.dept-tree').attr('id', this.cid + '-tree');
            var orgTree = new OrgTree({
                el: $tree,
                model: new Backbone.Model({
                    id: COMPANY_ID,
                    type: 'role',
                    orgName: COMPANY_NAME,
                    isParent: true
                })
            });

            this.orgTree = orgTree;
            this.listenTo(this.orgTree, 'treeLoaded', this.checkTree);
            return this;
        },
        checkTree: function() {
            var that = this;
            var id = this.model.get('resource_ids');
            var ids = id.toString().split(",");
            _.each(ids, function(item) {
                var orgs = that.orgTree.tree.getNodeByParam("orgId", item, null);
                if (orgs) {
                    that.orgTree.tree.checkNode(that.orgTree.tree.getNodeByParam("orgId", item, null), true, true);
                }
            });
        },
        initForm: function() {
            this.$form.validate({
                rules: {
                    description: {
                        required: true
                    },
                    role: {
                        required: true
                    }
                },
                messages: {
                    description: {
                        required: '必填项'
                    },
                    role: {
                        required: '必填项'
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                var orgs = this.orgTree.tree.getCheckedNodes(true);
                var items = [];
                _.each(orgs, function(item) {
                    var status = item.getCheckStatus();
                    if (!status.half) {
                        var org = item.org;
                        var orgId = org.id;
                        items.push(
                            orgId
                        );
                    }
                });
                var resourceId = items.join(",");
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/authority/updateRole.do',
                    context: this,
                    data: {
                        resource_ids: resourceId
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            model: {}
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
            RoleEditModal.__super__.remove.call(this);
        }
    });

    /*
     * 模型
     */
    var Role = Backbone.Model.extend({
        $selected: false,
        // ajax 请求的参数设置
        syncOptions: {
            wait: true,
            processData: true
        },
        // 成员属性
        defaults: {
            name: '',
            logo: '',
            createTime: '',
            status: 1,
            code: '',
            scale: '',
            area: 0,
            contacts: '',
            contactsMobile: '',
            account: '' // 管理员手机号
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
            Role.__super__.destroy.call(this, _.extend({
                url: CONTEXT_PATH + '/web/authority/deleteRole.do',
                data: {
                    id: this.id
                }
            }, this.syncOptions, options));
        },
        /*
         * 保存 insert/update
         */
        save: function(attrs, options) {
            Role.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
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
    var itemRender = template($('#tmpl-roleItem').html());
    var RoleItemView = Backbone.View.extend({
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
        /*
         * 编辑 - UI 触发
         */
        doEdit: function() {
            Backbone.trigger('edit:role', this.model, this);
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
            var itemView = new RoleItemView({
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

        // 数据集合
        var list = new Backbone.Collection(null, {
            model: Role
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/authority/getAllRole.do',
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
            el: '#table-rol',
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

        var modal;
        $('[data-do="create:role"]').on('click', function() {
            modal = new RoleCreateModal({
                model: new Role(),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:role', function(model) {
            modal = new RoleEditModal({
                model: model,
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
    }

    exports.run = run;
});