define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('template');
    var AreaModel = Backbone.Model.extend({
        defaults: {
            level: 1,
            selected: 0,
            text: '',
            parentId: 0,
            index: 0,
            name: '', // select name
            items: []
        },
        parse: function(resp) {
            resp = _.extend({
                success: false,
                model: []
            }, resp);

            var items = resp.model;
            items = _.isArray(items) ? items : [];

            var selected = this.get('selected');
            var text = '';
            if (selected != 0) {
                _.each(items, function(item) {
                    if (selected == item.id) text = item.name;
                });
            }

            return {
                items: items,
                text: text
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
    var AreaPicker = Backbone.View.extend({
        selected: [],
        className: 'area-picker',
        maxLevel: 3,
        name: 'area',
        initialize: function(options) {
            options || (options = {});

            _.extend(this, _.pick(options, 'maxLevel', 'selected', 'name'));

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
                        level: index + 1,
                        name: this.name
                    });
                }, this);
            } else {
                this.collection.add({
                    selected: 0,
                    parentId: '',
                    level: 1,
                    name: this.name
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
            var id = model.get('selected');
            var level = model.get('level');
            var next = level + 1;
            var name = this.name;

            var toRemove = [];
            this.collection.each(function(model) {
                var modelLevel = model.get('level');
                if (modelLevel > level) toRemove.push(model);
            });
            this.collection.remove(toRemove);
            if(id != '') {
                if (this.collection.length < this.maxLevel) {
                    this.collection.add({
                        selected: 0,
                        parentId: id,
                        level: next,
                        name: name
                    });
                }
            }
        },
        getSelection: function() {
            var data = [];
            this.collection.each(function(model) {
                var selected = model.get('selected');
                var text = model.get('text');

                data.push({
                    id: selected,
                    name: text
                });
            });

            return data;
        }
    });
    var areaSelectRender = template('<# var items = model.items; #><# if(items.length > 0) { #><select name="{{model.name}}" class="form-control" style="display:inline-block;"><option value="">请选择</option><# for(var i = 0, length = items.length, item; i < length; i++) { item = items[i]; #><option value="{{item.id}}"<# if(model.selected == item.id) { #> selected="selected"<# } #>>{{item.name}}</option><# } #></select><# } #>');
    var AreaSelect = Backbone.View.extend({
        template: areaSelectRender,
        tagName: 'span',
        className: 'area-select',
        events: {
            'change': 'doChange'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'request', this.onRequest);
            this.listenTo(this.model, 'sync', this.onSync);
            this.initData();
        },
        doChange: function(event) {
            var $select = this.$(':selected');

            var id = $select.val();
            var text = $select.text();

            this.model.set({
                selected: id,
                text: text
            });
        },
        onSync: function() {
            this.render();
        },
        onRequest: function() {
            this.$el.html('...');
        },
        render: function() {
            var markup = this.template({
                model: this.model.toJSON()
            });
            this.$el.html(markup);
            return this;
        },
        remove: function() {
            AreaSelect.__super__.remove.apply(this);
        },
        initData: function() {
            var parentId = this.model.get('parentId');
            if (parentId == '') {
                this.model.fetchByLevel();
            } else {
                this.model.fetchByParent();
            }
        }
    });

    return AreaPicker;
});