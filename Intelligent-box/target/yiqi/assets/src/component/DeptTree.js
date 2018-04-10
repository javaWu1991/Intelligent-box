define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var OrgModel = require('./OrgModel');
    require('ztree');

    var DeptTree = Backbone.View.extend({
        tagName: 'ul',
        className: 'ztree dept-tree',
        id: function() {
            return this.cid
        },
        initialize: function(options) {
            this.cacheEls();
            this.initData();

            this.listenTo(this.collection, 'add', this.addNode);
            this.listenTo(this.collection, 'change:name', this.updateNode);
            this.listenTo(this.collection, 'remove', this.removeNode);
        },
        beforeNodeClick: function(treeId, treeNode, clickFlag) {
            // return treeNode.level > 0;
        },
        onNodeClick: function(event, treeId, treeNode, clickFlag) {
            var attrs = _.pick(treeNode, 'id', 'type');
            var model = this.collection.findWhere(attrs);
            model.set({
                '$tId': treeNode.tId,
                '$pId': treeNode.pId
            }, {
                silent: true
            });
            Backbone.trigger('select:dept', model);
            this.trigger('select:dept', model);
        },
        doEdit: function(model) {
            var tId = model.get('$tId');
            var node = this.tree.getNodeByTId(tId);
        },
        addNode: function(model) {
            var pId = model.get('$pId');
            var parent = this.tree.getNodeByTId(pId);
            if (parent && parent.zAsync) { // 异步获取过子级数据，才添加节点
                var nodeData = model.getNodeData();
                this.tree.addNodes(parent, nodeData);
            }
        },
        updateNode: function(model, value) {
            var tId = model.get('$tId');
            var node = this.tree.getNodeByTId(tId);
            if (node) {
                node.name = value;
                this.tree.updateNode(node);
            }
        },
        removeNode: function(model) {
            var tId = model.get('$tId');
            var node = this.tree.getNodeByTId(tId);
            if (node) {
                this.tree.removeNode(node);
            }
        },
        initTree: function(data) {
            var beforeClick = _.bind(this.beforeNodeClick, this);
            var onClick = _.bind(this.onNodeClick, this);
            var _this = this;
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
                        idKey: 'dataId'
                    }
                },
                async: {
                    enable: true,
                    dataType: 'json',
                    url: CONTEXT_PATH + '/web/system/orgs.do',
                    autoParam: ['id=orgId'],
                    otherParam: {},
                    context: this,
                    dataFilter: function(treeId, parentNode, response) {
                        response = _.extend({
                            success: false,
                            model: []
                        }, response);
                        var data = [];
                        if (response.success) {
                            var items = response.model;
                            _.each(items, function(item) {
                                var model = new OrgModel.Dept({
                                    id: item.id,
                                    companyId: item.cid,
                                    name: item.orgName,
                                    higherId: item.higherId,
                                    sort: item.sort
                                });
                                _this.collection.add(model, {
                                    silent: true
                                });

                                // id, name, type, dataId = type + id
                                var nodeData = model.getNodeData();
                                data.push(nodeData);
                            }, _this);
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
            $.ajax({
                context: this,
                url: CONTEXT_PATH + '/web/system/orgs.do',
                success: function(response) {
                    response = _.extend({
                        success: false,
                        model: []
                    }, response);
                    // id, name, type, dataId = type + id
                    var rootNode = this.model.getNodeData();
                    rootNode.open = true; // 默认展开

                    var data = [rootNode];
                    var rootId = rootNode.dataId;
                    if (response.success) {
                        var items = response.model;
                        _.each(items, function(item) {
                            var model = new OrgModel.Dept({
                                id: item.id,
                                companyId: item.cid,
                                name: item.orgName,
                                higherId: item.higherId,
                                sort: item.sort
                            });
                            this.collection.add(model, {
                                silent: true
                            });

                            // id, name, type, dataId = type + id
                            var nodeData = model.getNodeData();
                            _.extend(nodeData, {
                                pId: rootId
                            })

                            data.push(nodeData);
                        }, this);
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
            DeptTree.__super__.remove.apply(this, arguments);
        }
    });

    return DeptTree;
});