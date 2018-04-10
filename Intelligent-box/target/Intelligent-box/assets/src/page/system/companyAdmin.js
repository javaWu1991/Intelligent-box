define(function(require, exports, module) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('metisMenu');
    require('bootstrap');
    require('jquery-form');
    require('jquery-validate');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var Model = require('component/Model');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var Pager = require('component/Pager');
    var template = require('template');
    Backbone.emulateHTTP = true;
    var STATUS_ENABLE = 1;
    var STATUS_DISABLE = 0;
    /*
     * 模型
     */
    var CompanyAdmin = Backbone.Model.extend({
        idAttribute: 'index',
        defaults: {
            id: 0,
            account: '',
            type: '企业管理员',
            name: '',
            cid: 0,
            companyNo: '', // 公司编码
            companyName: '', // 公司名称
            mobile: '',
            status: STATUS_ENABLE
        },
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('status');
            var statusMap = {
                0: '禁用',
                1: '启用'
            };

            data._isNew = this.isNew();
            data.statusText = statusMap[state] || '未知状态';

            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        },
        destroy: function(options) {
            var data = this.pick('account', 'cid', 'id');
            data.rid = 2;
            $.ajax({
                url: CONTEXT_PATH + '/web/system/delete.do',
                type: 'post',
                dataType: 'json',
                context: this,
                data: data,
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);

                    if (resp.success) {
                        alert('删除成功').delay(1);
                        this.trigger('destroy', this, this.collection);
                    } else {
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
            });
        },
        save: function(attrs, options) {
            CompanyAdmin.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        },
        toggleStatus: function() {
            var data = this.pick('account', 'cid');
            var status = this.get('status');
            if (status == 0) {
                status = 1;
            } else if (status == 1) {
                status = 0;
            }
            data.status = status;
            var confirmText = status == 0 ? '确认停用？' : '确认启用？';
            var that = this;
            confirm(confirmText, function() {
                that.save(null, {
                    url: CONTEXT_PATH + '/web/system/updateStatus.do',
                    context: that,
                    data: data,
                    success: function(model, resp, options) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);

                        if (resp.success) {
                            alert('操作成功').delay(1);
                            that.set('status', status);
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
        STATE_ENABLE: 1,
        STATE_DISABLE: 0
    });

    $.validator.addMethod('mobile', function(value, element) {
        return this.optional(element) || value.length == 11 && (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i).test(value);
    });
    $.validator.addMethod('name', function(value, element) {
        return this.optional(element) || (/^[\u4E00-\u9FA5\w\d\s]+$/i).test(value);
    });

    var companyAdminCreateModalRender = template($('#tmpl-companyAdminCreateModal').html());
    var companyAdminEditModalRender = template($('#tmpl-companyAdminEditModal').html());
    var CompanyAdminCreateModal = FormModal.extend({
        template: companyAdminCreateModalRender,
        events: {
            'change #inputMobile' : 'doCheck',
            'click [data-do="submit"]': 'submit'
        },
        doCheck: function(event) {
            var $target = $(event.target);
            var account = $('#inputMobile').val();
            $.ajax({
                url: CONTEXT_PATH + '/web/system/getNameByAccount.do?account=' + account,
                context: this,
                beforeSend: function() {
                    $target.prop('disabled', true);
                },
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        model: {}
                    }, resp);
                    if (resp.success) {
                        $('#inputName').val(resp.model)
                                        .prop('disabled', true)
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
            })
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var data = this.$form.serializeObject();
                data.cid = this.model.get('cid');

                this.model.save(null, {
                    url: CONTEXT_PATH + '/web/system/add.do',
                    context: this,
                    data: data,
                    success: function(model, resp, options) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);

                        if (resp.success) {
                            this.collection.refresh({
                                cid: CID
                            });
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
        initForm: function() {
            this.$form.validate({
                rules: {
                    account: {
                        required: true
                    },
                    name: {
                        required: true,
                        name: true,
                        rangelength: [1, 10]
                    },
                    password: {
                        required: true,
                        rangelength: [6, 16]
                    },
                    mobile: {
                        required: true,
                        mobile: true
                    }
                },
                messages: {
                    name: {
                        required: '必填项',
                        name: '必须是中英文字符和数字的组合',
                        rangelength: '不超过10个字符'
                    },
                    account: {
                        required: '必填项'
                    },
                    password: {
                        required: '必填项',
                        rangelength: '密码字符数6-16位'
                    },
                    mobile: {
                        required: '必填项',
                        mobile: '格式不正确'
                    }
                }
            });
        }
    });
    var CompanyAdminEditModal = FormModal.extend({
        template: companyAdminEditModalRender,
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var data = this.$form.serializeObject();
                this.model.save(null, {
                    url: CONTEXT_PATH + '/web/system/updateAdmin.do',
                    context: this,
                    data: data,
                    success: function(model, resp, options) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);

                        if (resp.success) {
                            var attrs = _.pick(data, ['name', 'mobile']);
                            this.model.set(attrs);
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
        initForm: function() {
            this.$form.validate({
                rules: {
                    name: {
                        required: true,
                        name: true,
                        rangelength: [1, 10]
                    },
                    password: {
                        rangelength: [6, 16]
                    },
                    mobile: {
                        mobile: true
                    }
                },
                messages: {
                    name: {
                        required: '必填项',
                        name: '必须是中英文字符和数字的组合',
                        rangelength: '不超过10个字符'
                    },
                    password: {
                        rangelength: '密码字符数6-16位'
                    },
                    mobile: {
                        mobile: '格式不正确'
                    }
                }
            });
        }
    });

    var adminRoleModalRender = template($('#tmpl-roleAssignModal').html());
    var AdminRoleModal = FormModal.extend({
        template: adminRoleModalRender,
        initialize: function() {
            AdminRoleModal.__super__.initialize.call(this);

        },
        render: function() {
            AdminRoleModal.__super__.render.call(this);

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
        initEditor: function() {
            this.editor = UM.getEditor('editor', {
                initialFrameWidth: '100%',
                initialFrameHeight: '160',
                toolbar: [
                    'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor | superscript subscript',
                    'paragraph justifyleft justifycenter justifyright justifyjustify | insertorderedlist insertunorderedlist | removeformat | selectall cleardoc | link unlink | horizontal source'
                ]
            });
        },
        checkTree: function() {
            var id = this.model.get('id');
            var cid = this.model.get('cid');
            var data = {
                uid: id
            }
            if (cid != '' || cid != null) {
                data.cid = cid;
            }

            $.ajax({
                type: "GET",
                url: CONTEXT_PATH + '/web/authority/getUserRoleByUidCid.do',
                dataType: "json",
                context: this,
                data: data,
                success: function(data) {
                    var checknode = data.model;
                    _.each(checknode, function(item) {
                        var orgs = this.orgTree.tree.getNodeByParam("orgId", item.rid, null);
                        if (orgs) {
                            this.orgTree.tree.checkNode(this.orgTree.tree.getNodeByParam("orgId", item.rid, null), true, true);
                        }
                    }, this);
                }
            });
        },
        submit: function() {
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
                url: CONTEXT_PATH + '/web/authority/updateUserRole.do',
                context: this,
                data: {
                    roleId: resourceId
                },
                success: function() {
                    alert('操作成功').delay(1);
                    this.collection.refresh();
                    this.hide();
                },
                error: function() {
                    alert('操作失败');
                }
            });
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            AdminRoleModal.__super__.remove.call(this);
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
            var url = CONTEXT_PATH + '/web/authority/getAllRole.do';
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
                            data.push({
                                id: type + item.id,
                                name: item.description,
                                pId: rootId,
                                type: type,
                                orgId: item.id,
                                org: {
                                    id: item.id,
                                    cid: item.cid,
                                    orgName: item.description,
                                    higherId: item.parent_id
                                },
                            });

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
            'click [data-do="delete"]': 'doDelete',
            'click [data-do="disable"]': 'doDisable',
            'click [data-do="enable"]': 'doEnable',
            'click [data-do="toggleOne"]': 'doToggleOne',
            'click [data-do="role"]': 'doroleAssign',
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'toggle:select', this.syncToggle);
        },
        doEdit: function() {
            Backbone.trigger('edit:companyAdmin', this.model, this);
        },
        doroleAssign: function() {
            Backbone.trigger('role:admin', this.model, this);
        },
        doDelete: function(event) {
            var model = this.model;
            var account = this.model.get('account');
            var txt = '确认删除帐号：[' + account + ']？';
            confirm(txt, function() {
                model.destroy();
            });
        },
        doDisable: function() {
            this.model.toggleStatus();
        },
        doEnable: function() {
            this.model.toggleStatus();
        },
        doToggleOne: function(event) {
            var checked = $(event.target).prop('checked');
            this.model.$selected = checked;
            this.model.trigger('select:one', checked, this.model);
        },
        syncToggle: function(selected, model) {
            this.$toggleOne.prop('checked', selected);
        },
        render: function() {
            var markup = this.template({
                model: this.model.serialize()
            });
            this.$el.html(markup);
            this.$toggleOne = this.$('[data-do="toggleOne"]');
            return this;
        }
    });
    /* 批量操作 */
    var bulkActionRender = template($('#tmpl-bulkAction').html());
    var BulkAction = Backbone.View.extend({
        template: bulkActionRender,
        events: {
            'click [data-do="bulk:delete"]': 'doBulkDelete',
            'click [data-do="bulk:disable"]': 'doBulkDisable',
            'click [data-do="bulk:enable"]': 'doBulkEnable'
        },
        doBulkEnable: function() {
            this.trigger('bulk:enable');
        },
        doBulkDisable: function() {
            this.trigger('bulk:disable');
        },
        doBulkDelete: function() {
            this.trigger('bulk:delete');
        },
        render: function() {
            this.$el.html(this.template());
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
            this.listenTo(this.collection, 'select:one', this.syncToggle);
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
                    count: this.colCount
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
            this.colCount = this.$headers.children().length;

            this.$items = this.$('[role="items"]');
            this.$toggleAll = this.$('[data-do="toggleAll"]');
        },
        syncToggle: function(selected) {
            if (selected === false) {
                this.$toggleAll.prop('checked', false);
            } else {
                var length = this.collection.length;
                this.collection.each(function(model) {
                    if (model.$selected === true) length--;
                });

                this.$toggleAll.prop('checked', length === 0);
            }
        },
        doToggleAll: function(event) {
            var checked = $(event.target).prop('checked');
            this.collection.each(function(model) {
                model.$selected = checked;
                model.trigger('toggle:select', checked, model);
            });
        },
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colCount
                });

                this.$items.empty().html(markup);
            }
        },
        refresh: function() {
            this.collection.refresh({
                data: {
                    cid: CID
                }
            });
        },
        bulkDelete: function() {
            var collection = this.collection;
            var selection = collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要删除的条目').delay(2);
            } else {
                confirm('确认删除所选条目？', function() {
                    var companyId = [];
                    _.each(selection, function(model) {
                        companyId.push(model.id);
                    });
                    $.ajax({
                        url: CONTEXT_PATH + '/web/system/delete.do',
                        type: 'post',
                        dataType: 'json',
                        data: {},
                        success: function(resp) {
                            resp = _.extend({
                                success: false,
                                message: '操作失败'
                            }, resp);
                            if (resp.success) {
                                collection.trigger('destroy');
                                alert('操作成功');
                            } else {
                                alert(resp.message);
                            }
                        }
                    });
                });
            }
        },
        bulkEnable: function() {
            var selection = this.collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要操作的条目').delay(2);
            } else {
                this.bulkStatus(selection, CompanyAdmin.STATE_ENABLE);
            }
        },
        bulkDisable: function() {
            var selection = this.collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要操作的条目').delay(2);
            } else {
                this.bulkStatus(selection, CompanyAdmin.STATE_DISABLE);
            }
        },
        bulkStatus: function(selection, state) {
            var companyId = [];
            _.each(selection, function(model) {
                companyId.push(model.id);
            });
            $.ajax({
                url: CONTEXT_PATH + '/web/system/updateStatus.do',
                type: 'post',
                dataType: 'json',
                data: {
                    companyId: companyId.join(','),
                    state: state
                },
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);
                    if (resp.success) {
                        _.each(selection, function(model) {
                            model.set('status', state);
                        });
                        alert('操作成功');
                    } else {
                        alert(resp.message);
                    }
                }
            });
        }
    });

    function run() {
        $('.table-bordered > tbody').on('mouseover', function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
        $('.primary-nav').metisMenu();

        var query = new Backbone.Model();
        if (CID != '') query.set('cid', CID);

        var list = new Backbone.Collection(null, {
            model: CompanyAdmin
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/system/list.do',
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);
                var items = _.isArray(parsed.model) ? parsed.model : [];
                return items;
            },
            refresh: function(data) {
                var query = search.serialize();
                searchHandler(_.extend(query, data));
            },
            getSelection: function() {
                return this.filter(function(model) {
                    return model.$selected;
                });
            }
        });

        var table = new DataTable({
            el: '#sole-table',
            collection: list
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

        var pager = new Pager({
            className: 'pagination pull-right'
        });
        pager.listenTo(list, 'sync', function(collection, resp, options) {
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

        function searchHandler(data) {
            var clean = query.toJSON();
            _.extend(clean, data);
            // 过滤空的搜索条件
            if (_.isObject(data) && !_.isArray(data)) {
                clean = {};
                _.each(data, function(value, key) {
                    if (_.isObject(value)) {
                        if (!_.isEmpty(value)) clean[key] = value;
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

        // 将分页视图渲染到界面上
        $('.toolbar-bottom').append(pager.render().$el);

        var modal;
        $('[data-do="create:companyAdmin"]').on('click', function() {
            modal instanceof FormModal && modal.remove();

            var attrs = {
                cid: CID,
                companyName: COMPANY_NAME,
                companyNo: COMPANY_CODE
            }
            modal = new CompanyAdminCreateModal({
                model: new CompanyAdmin(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:companyAdmin', function(model) {
            modal instanceof FormModal && modal.remove();
            modal = new CompanyAdminEditModal({
                model: model
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });
        Backbone.on('role:admin', function(model) {
            modal instanceof FormModal && modal.remove();
            modal = new AdminRoleModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.show();
        });

        searchHandler();
    }

    exports.run = run;
});