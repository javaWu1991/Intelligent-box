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
    var androidCreateModalRender = template($('#tmpl-androidCreateModal').html());
    var AndroidCreateModal = FormModal.extend({
        template: androidCreateModalRender,
        initForm: function() {
            jQuery.validator.addMethod("checkApk", function(value, element) {
                var filepath = $("#inputApkfile").val();
                //获得上传文件名
                var fileArr = filepath.split("\\");
                var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
                var filetype = fileTArr[fileTArr.length - 1];
                //切割出后缀文件名
                if (filetype != "apk") {
                    return false;
                } else {
                    return true;
                }
            }, "上传文件格式不适合");

            jQuery.validator.addMethod("checkVersion", function(value, element) {
                var checkVersion = $("#version").val();
                //切割出后缀文件名
                if (checkVersion <= ANDROID_VERSION) {
                    return false;
                } else {
                    return true;
                }
            }, "版本号小于历史版本号，请重新输入");


            this.$form.validate({
                rules: {
                    apk: {
                        required: true,
                        checkApk: true
                    },
                    version: {
                        required: true,
                        number: true,
                        checkVersion: true
                    },
                    showVersion: {
                        required: true,
                    },
                    description: {
                        required: true,
                    }


                },
                messages: {
                    apk: {
                        required: '请上传apk文件'
                    },
                    version: {
                        required: '必须填写',
                        number: '必须数字'
                    },
                    showVersion: {
                        required: '必须填写'
                    },
                    description: {
                        required: '必须填写'
                    }

                }
            });
        },
        initialize: function() {
            AndroidCreateModal.__super__.initialize.call(this);
        },
        events: {
            'change .android-isAllUpdate': 'doShow',
            'click [data-do="submit"]': 'submit'
        },
        doShow: function(event) {
            var key = this.$(".android-isAllUpdate option[value='1']").is(":selected");
            if (key) {
                $(".android-recevier").hide();
            } else {
                $(".android-recevier").show();
            }

        },
        render: function() {
            AndroidCreateModal.__super__.render.call(this);

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
        initEditor: function() {
            this.editor = UM.getEditor('editor', {
                initialFrameWidth: '100%',
                initialFrameHeight: '300',
                autoHeightEnabled: false,
                imagePath: CONTEXT_PATH,
                imageUrl: CONTEXT_PATH + '/web/edit/upload.do',
                imageFieldName: 'file',
                toolbar: [
                    'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor | superscript subscript',
                    'paragraph justifyleft justifycenter justifyright justifyjustify | insertorderedlist insertunorderedlist | removeformat | selectall cleardoc | image | link unlink | horizontal source'
                ]
            });
        },
        submit: function(event) {
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
            if (this.$form.valid()) {
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/system/uploadApk.do',
                    context: this,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    data: {
                        updateUser: resourceId
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
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });
            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            AndroidCreateModal.__super__.remove.call(this);
        }
    });

    //ios  create
    var iosCreateModalRender = template($('#tmpl-iosCreateModal').html());
    var IosCreateModal = FormModal.extend({
        template: iosCreateModalRender,
        initForm: function() {
            jQuery.validator.addMethod("checkVersion", function(value, element) {
                var checkVersion = $("#iosVersion").val();
                if (checkVersion <= IOS_VERSION) {
                    return false;
                } else {
                    return true;
                }
            }, "版本号小于历史版本号，请重新输入");

            this.$form.validate({
                rules: {
                    ipaUrl: {
                        required: true,
                    },
                    version: {
                        required: true,
                        number: true,
                        checkVersion: true
                    },
                    showVersion: {
                        required: true,
                    },
                    description: {
                        required: true,
                    }


                },
                messages: {
                    ipaUrl: {
                        required: '请填写url'
                    },
                    version: {
                        required: '必须填写',
                        number: '必须数字'
                    },
                    showVersion: {
                        required: '必须填写'
                    },
                    description: {
                        required: '必须填写'
                    }

                }
            });
        },
        initialize: function() {
            IosCreateModal.__super__.initialize.call(this);
        },
        events: {
            'change .ios-isAllUpdate': 'doShow',
            'click [data-do="submit"]': 'submit'
        },
        doShow: function(event) {
            var key = this.$(".ios-isAllUpdate option[value='1']").is(":selected");
            if (key) {
                $(".ios-recevier").hide();
            } else {
                $(".ios-recevier").show();
            }

        },
        render: function() {
            IosCreateModal.__super__.render.call(this);

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
        submit: function(event) {
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
            if (this.$form.valid()) {
                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/api/appcheck/updateIpaVersion.do',
                    context: this,
                    data: {
                        updateUser: resourceId
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
                    complete: function() {
                        $target.prop('disabled', false);
                    }
                });

            }
        },
        remove: function() {
            if (this.editor) this.editor.destroy();
            IosCreateModal.__super__.remove.call(this);
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


    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-item').html());
    var ItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {},
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
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

        $('.primary-nav').metisMenu();
        var query = new Backbone.Model({});
        _.extend(query, {
            getData: function() {
                var attrs = this.toJSON();
                return attrs;
            }
        });
        var list = new Backbone.Collection(null, {
            model: Notice
        });
        _.extend(list, {
            url: CONTEXT_PATH + "/web/system/applist.do",
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

        // list.listenTo(pager, 'page', function(pageNo) {
        //     this.fetch({
        //         parse: true,
        //         reset: true,
        //         data: {
        //             cid: COMPANY_ID,
        //             pageNo: pageNo
        //         }
        //     });
        // })

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
        $('[data-do="create:android"]').on('click', function() {
            var attrs = {
                cid: COMPANY_ID
            }
            modal = new AndroidCreateModal({
                model: new Notice(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initEditor();
            modal.initForm();
            modal.show();
        });

        $('[data-do="create:ios"]').on('click', function() {
            var attrs = {
                cid: COMPANY_ID
            }
            modal = new IosCreateModal({
                model: new Notice(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

    }

    exports.run = run;
});