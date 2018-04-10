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
    require('jquery-validate-additional');
    //require('bootstrap-moment');
    require('bootstrap-daterangepicker');
    require('bootstrap');


    Backbone.emulateHTTP = true;
    /*
     * 模型
     */

    var Notice = Model.extend({
        defaults: {
            id: 0,
            title: '',
            cid: 0,
            detail: '',
            content: '',
            createTime: '',
            cname: '',
            dname: ''
        },
        serialize: function() {
            var data = this.toJSON();
            var today = moment();
            var status = 0; // 1 未上线，2 已上线，3 已下线 
            var statusMap = {
                0: '未知状态',
                1: '未上线',
                2: '已上线',
                3: '已下线'
            };

            var createTime = parseInt(this.get('createTime'), 10);
            var modifyTime = parseInt(this.get('modifyTime'), 10);
            var createTimeText = '';
            var modifyTimeText = '';

            createTime = moment(createTime);
            modifyTime = moment(modifyTime);

            if (createTime.isValid()) {
                createTimeText = createTime.format('YYYY-MM-DD HH:mm');
                if (today.isBefore(createTime)) status = 1;
            }

            if (modifyTime.isValid()) {
                modifyTimeText = modifyTime.format('YYYY-MM-DD HH:mm');
                if (today.isAfter(modifyTime)) status = 3;
            }

            if (createTime.isValid() && modifyTime.isValid()) {
                if (today.isBetween(createTime, modifyTime)) status = 2;
                else if (today.isAfter(modifyTime)) status = 3;
            }

            var statusText = statusMap[status] || '未知状态';

            var cname = this.get('cname');
            var dname = this.get('dname');
            var sender = dname != '' ? dname : cname;
            data.createTimeText = createTimeText;
            data.modifyTimeText = modifyTimeText;
            data.statusText = statusText;
            data.sender = sender;
            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        },
        destroy: function(options) {
            var data = this.pick('id');
            Notice.__super__.destroy.call(this, _.extend({
                dataType: 'text',
                url: CONTEXT_PATH + '/web/deleteMessage.do',
                data: data,
            }, this.syncOptions, options));
        },
        save: function(attrs, options) {
            Notice.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        }
    });
    require('json2');
    var noticeCreateModalRender = template($('#tmpl-noticeCreateModal').html());
    var NoticeCreateModal = FormModal.extend({
        template: noticeCreateModalRender,
        initForm: function() {
            this.$form.validate({
                rules: {
                    title: {
                        required: true,
                        rangelength: [5, 300]
                    }
                },
                messages: {
                    title: {
                        required: '必须填写',
                        rangelength: $.validator.format("请输入长度 5 到 300 个字符"),
                    }
                }
            });
        },
        initialize: function() {
            NoticeCreateModal.__super__.initialize.call(this);
        },
        setDatetimeRange: function(event, picker) {
            var startDate = picker.startDate;
            var endDate = picker.endDate;
            this.model.set('createTime', startDate.format('x'));
            this.model.set('modifyTime', endDate.format('x'));
        },
        render: function() {
            NoticeCreateModal.__super__.render.call(this);

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

            this.$('[data-ui="datatimerange"]').daterangepicker({
                locale: {
                    format: 'YYYY-MM-DD HH:mm',
                    customRangeLabel: '自选',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                        '七月', '八月', '九月', '十月', '十一月', '十二月'
                    ],
                    applyLabel: '确定',
                    cancelLabel: '取消'
                },
                timePicker: true,
                timePicker24Hour: true,
                linkedCalendars: true,
                autoUpdateInput: true
            }).on('apply.daterangepicker', _.bind(this.setDatetimeRange, this));
            return this;
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
                        if (IS_SUPER) {
                            item = {
                                cid: org.id,
                                cname: org.orgName,
                                org_id: 0,
                                dname: ''
                            }
                        } else {
                            item = {
                                cid: COMPANY_ID,
                                cname: COMPANY_NAME,
                                org_id: org.id,
                                dname: org.orgName
                            }
                        }
                        items.push(item);
                    }
                });
                var receivers = JSON.stringify(items);
                var createTime = this.model.get('createTime');
                var modifyTime = this.model.get('modifyTime');

                _.extend(params, {
                    receivers: receivers,
                    beginTime: createTime,
                    endTime: modifyTime
                });

                $.ajax({
                    url: CONTEXT_PATH + '/web/scollmessage/add.do',
                    context: this,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    data: params,
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
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            NoticeCreateModal.__super__.remove.call(this);
        }
    });

    var noticeEditModalRender = template($('#tmpl-noticeEditModal').html());
    var NoticeEditModal = FormModal.extend({
        template: noticeEditModalRender,
        initForm: function() {
            this.$form.validate({
                rules: {
                    title: {
                        required: true,
                        rangelength: [5, 300]
                    }
                },
                messages: {
                    title: {
                        required: '必须填写',
                        rangelength: $.validator.format("请输入长度 5 到 300 个字符"),
                    }
                }
            });
        },
        initialize: function() {
            NoticeCreateModal.__super__.initialize.call(this);
        },
        setDatetimeRange: function(event, picker) {
            var startDate = picker.startDate;
            var endDate = picker.endDate;

            this.model.set('createTime', startDate.format('x'));
            this.model.set('modifyTime', endDate.format('x'));
        },
        render: function() {
            NoticeCreateModal.__super__.render.call(this);
            var $tree = this.$('.dept-tree').attr('id', this.cid + '-tree');
            var editOrgTree = new EditOrgTree({
                el: $tree,
                model: new Backbone.Model({
                    id: COMPANY_ID,
                    type: 'company',
                    orgName: COMPANY_NAME,
                    isParent: true
                })
            });
            this.editOrgTree = editOrgTree;
            this.listenTo(this.editOrgTree, 'treeLoaded', this.checkTree);

            var startDate = parseInt(this.model.get('createTime')) || 0;
            var endDate = parseInt(this.model.get('modifyTime')) || 0;

            this.$('[data-ui="datatimerange"]').daterangepicker({
                startDate: moment(startDate),
                endDate: moment(endDate),
                locale: {
                    format: 'YYYY-MM-DD HH:mm',
                    customRangeLabel: '自选',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                        '七月', '八月', '九月', '十月', '十一月', '十二月'
                    ],
                    applyLabel: '确定',
                    cancelLabel: '取消'
                },
                timePicker: true,
                timePicker24Hour: true,
                linkedCalendars: true,
                autoUpdateInput: true
            }).on('apply.daterangepicker', _.bind(this.setDatetimeRange, this));

            return this;
        },
        checkTree: function() {
            var id = this.model.get('id');
            var that = this;
            $.ajax({
                type: "GET",
                url: CONTEXT_PATH + '/web/getMessage.do',
                dataType: "json",
                data: "id=" + id,
                success: function(data) {
                    var checknode = JSON.parse(data.model.receiver);
                    _.each(checknode, function(item) {
                        var orgs = that.editOrgTree.tree.getNodeByParam("orgId", item.org_id, null);
                        if (orgs) {
                            that.editOrgTree.tree.checkNode(that.editOrgTree.tree.getNodeByParam("orgId", item.org_id, null), true, true);
                        }
                    });
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);

                var params = this.$form.serializeObject();

                var createTime = this.model.get('createTime');
                var modifyTime = this.model.get('modifyTime');
                var id = this.model.get('id');

                var orgs = this.editOrgTree.tree.getCheckedNodes(true);
                var items = [];
                _.each(orgs, function(item) {
                    var status = item.getCheckStatus();
                    if (!status.half) {
                        var org = item.org;
                        if (IS_SUPER) {
                            item = {
                                cid: org.id,
                                cname: org.orgName,
                                org_id: 0,
                                dname: ''
                            }
                        } else {
                            item = {
                                cid: COMPANY_ID,
                                cname: COMPANY_NAME,
                                org_id: org.id,
                                dname: org.orgName
                            }
                        }
                        items.push(item);
                    }
                });
                var receivers = JSON.stringify(items);


                _.extend(params, {
                    id: id,
                    receivers: receivers,
                    beginTime: createTime,
                    endTime: modifyTime
                });

                $.ajax({
                    url: CONTEXT_PATH + '/web/scollmessage/update.do',
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
                            attrs = _.pick(params, 'title', 'createTime', 'modifyTime');
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
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            NoticeCreateModal.__super__.remove.call(this);
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
            var beforeClick = _.bind(this.beforeNodeClick, this);
            var onClick = _.bind(this.onNodeClick, this);
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
                async: {
                    enable: false,
                    dataType: 'json',
                    url: CONTEXT_PATH + '/web/system/orgs.do',
                    autoParam: ['orgId'],
                    otherParam: {},
                    dataFilter: function(treeId, parentNode, response) {
                        _.defaults(response, {
                            success: false,
                            model: []
                        });
                        var data = [];
                        if (response.success) {
                            var items = response.model;
                            if (items.length === 9) {
                                alert('接收人数据异常,不可保存！').delay(2);
                                $("#save_news_btn").prop("disabled",true)
                            }
                            _.each(items, function(item) {
                                data.push({
                                    type: 'dept',
                                    id: 'dept' + item.id,
                                    name: item.orgName,
                                    isParent: true,
                                    orgId: item.id,
                                    expand: true,
                                    org: {
                                        orgName: item.orgName,
                                        id: item.id,
                                        cid: item.cid,
                                        higherId: item.higherId
                                    }
                                });
                            });
                        }
                        return data;
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onClick: onClick
                }
            };

            function addDiyDom(treeId, node) {
                var tId = node.tId;
                var $node = $('#' + tId);
                var type = node.type;
                $node.addClass('node-item node-' + type);
            }

            this.tree = $.fn.zTree.init(this.$tree, setting, data);
            this.treeId = this.tree.setting.treeId;
        },
        initData: function() {
            // var url = CONTEXT_PATH + '/web/system/orgs.do';
            var url = CONTEXT_PATH + '/web/system/getAllOrgsByCompany.do';
            if (IS_SUPER) {
                url = CONTEXT_PATH + '/web/company/selectCompany.do';
            }
            $.ajax({
                context: this,
                url: url,
                success: function(response) {
                    _.defaults(response, {
                        success: false,
                        model: {}
                    });
                    var attrs = this.model.toJSON();
                    var root = {
                        id: attrs.id,
                        name: attrs.orgName,
                        org: attrs
                    }
                    var rootId = root.id;
                    var data = [];

                    var type = 'dept';

                    if (response.success) {
                        var items = [];
                        if (IS_SUPER) {
                            if (_.isObject(response.model) && _.isArray(response.model.list)) {
                                items = response.model.list;
                            }
                            _.each(items, function(item) {
                                data.push({
                                    // id: type + item.id,
                                    id: item.id,
                                    name: item.name,
                                    pId: rootId,
                                    isParent: false,
                                    type: type,
                                    orgId: item.id,
                                    org: {
                                        id: item.id,
                                        orgName: item.name,
                                        higherId: rootId
                                    }
                                });
                            });
                        } else {
                            items = response.model;
                            walkList(items, null, function(item, parent, level) {
                                var pId = parent ? parent.id : 0;
                                var isParent = pId == 0;
                                data.push({
                                    // id: type + item.id,
                                    id: item.id,
                                    name: item.orgName,
                                    pId: pId,
                                    // isParent: isParent,
                                    type: type,
                                    orgId: item.id,
                                    org: {
                                        id: item.id,
                                        cid: item.cid,
                                        orgName: item.orgName,
                                        higherId: item.higherId
                                    }
                                });
                            }, 'orgs');
                        }
                    }
                    
                    if (items.length === 0) {
                        alert('接收人数据获取异常,不可保存！').delay(2);
                        $("#save_news_btn").prop("disabled",true)
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

    var walkList = require('walkList');
    var EditOrgTree = Backbone.View.extend({
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
                        enable: true,
                        rootId: 0
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
            var url = CONTEXT_PATH + '/web/system/getAllOrgsByCompany.do';
            if (IS_SUPER) {
                url = CONTEXT_PATH + '/web/company/selectCompany.do';
            }
            $.ajax({
                context: this,
                url: url,
                success: function(response) {
                    _.defaults(response, {
                        success: false,
                        model: {}
                    });
                    var attrs = this.model.toJSON();
                    var rootId = attrs.id;
                    var data = [];
                    var type = 'dept';
                    if (response.success) {
                        var items = [];
                        if (IS_SUPER) {
                            if (_.isObject(response.model) && _.isArray(response.model.list)) {
                                items = response.model.list;
                            }
                            type = 'company';
                            _.each(items, function(item) {
                                data.push({
                                    // id: type + item.id,
                                    id: item.id,
                                    name: item.name,
                                    pId: rootId,
                                    isParent: false,
                                    type: type,
                                    orgId: item.id,
                                    org: {
                                        id: item.id,
                                        orgName: item.name,
                                        higherId: rootId
                                    }
                                });
                            });
                        } else {
                            items = response.model;
                            walkList(items, null, function(item, parent, level) {
                                var pId = parent ? parent.id : 0;
                                var isParent = pId == 0;
                                data.push({
                                    // id: type + item.id,
                                    id: item.id,
                                    name: item.orgName,
                                    pId: pId,
                                    // isParent: isParent,
                                    type: type,
                                    orgId: item.id,
                                    org: {
                                        id: item.id,
                                        cid: item.cid,
                                        orgName: item.orgName,
                                        higherId: item.higherId
                                    }
                                });
                            }, 'orgs');
                        }
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
            EditOrgTree.__super__.remove.apply(this, arguments);
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
            'click [data-do="stick"]': 'doStick',
            'click [data-do="disable"]': 'doDisable',
            'click [data-do="enable"]': 'doEnable'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
        },
        doEdit: function() {
            Backbone.trigger('edit:notice', this.model, this);

        },
        doDelete: function() {
            var model = this.model;
            confirm('确认删除？', function() {
                model.destroy();
            });
        },
        doStick: function() {
            var id = this.model.get('id');
            var sort = this.model.get('sort');

            if (sort == 0) {
                sort = 1;
            } else {
                sort = 0;
            }

            this.model.save(null, {
                url: CONTEXT_PATH + '/web/setMessageTop.do',
                type: 'post',
                context: this,
                data: {
                    id: id,
                    sort: sort
                },
                success: function(model, resp, options) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);

                    if (resp.success == true) {
                        alert('操作成功').delay(1);
                        this.model.set({
                            sort: sort
                        });
                    } else {
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
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

            this.listenTo(this.collection, 'change:sort', this.refresh);
        },
        addOne: function(model, collection, options) {
            model.set('cid', COMPANY_ID);
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
            var data = this.model.getData();
            this.collection.refresh({});
        }
    });

    function run() {
        $('.table-bordered > tbody').on('mouseover',function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
        $('.primary-nav').metisMenu();
        var query = new Backbone.Model({
            cid: COMPANY_ID,
            type: 2
        });
        _.extend(query, {
            autoParam: function() {
                return {
                    cid: COMPANY_ID
                }
            },
            getData: function() {
                var attrs = this.toJSON();
                return _.extend(attrs, this.autoParam());
            }
        });
        var list = new Backbone.Collection(null, {
            model: Notice
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/notice/findAll.do',
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);
                var items = _.isArray(parsed.model) ? parsed.model : [];
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
            el: '#datatable',
            model: query,
            collection: list
        });

        // 搜索表单
        var search = new SearchForm({
            el: '#search',
            collection: list
        });
        search.on('search', function(data) {
            query.clear();
            _.extend(data, {
                type: 2
            });
            query.set(data);
            searchHandler(query.getData());
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
        $('[data-do="create:notice"]').on('click', function() {
            var attrs = {
                cid: COMPANY_ID
            };
            modal = new NoticeCreateModal({
                model: new Notice(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            // modal.initEditor();
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:notice', function(model) {
            modal = new NoticeEditModal({
                model: model
            });
            modal.render().$el.appendTo(document.body);
            // modal.initEditor();
            modal.initForm();
            modal.show();
        });
    }

    exports.run = run;
});