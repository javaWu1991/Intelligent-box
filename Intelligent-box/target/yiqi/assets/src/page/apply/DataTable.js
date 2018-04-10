define(function(require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('template');
    /*
     * 表格
     * 
     * 监听集合的 reset 事件更新视图
     */
    var DataTable = Backbone.View.extend({
        itemView: Backbone.View,
        noDataRender: template('<tr><td colspan="{{count}}">暂无数据</td></tr>'),
        loadingRender: template('<tr><td colspan="{{count}}">数据加载中...</td></tr>'),
        initialize: function(options) {
            options || (options = {});

            if (options.itemView) this.itemView = options.itemView;

            this.cacheEls();

            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'request', this.request);
            this.listenTo(this.collection, 'sync', this.sync);
            this.listenTo(this.collection, 'error', this.error);
            this.listenTo(this.collection, 'destroy', this.refresh);
        },
        addOne: function(model) {
            var itemView = new this.itemView({
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
                    count: this.colHeaderCount
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
            this.colHeaderCount = this.$headers.children().size();
            this.$items = this.$('[role="items"]');
        },
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colHeaderCount
                });

                this.$items.empty().html(markup);
            }
        },
        refresh: function() {
            this.collection.refresh();
        }
    });

    return DataTable;
})