define(function(require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var App = require('./App');
    
    var AppCollection = Backbone.Collection.extend({
        model: App,
        parse: function(resp) {
            var parsed = _.extend({
                success: false,
                model: []
            }, resp);
            var items = _.isArray(parsed.model) ? parsed.model : [];
            _.each(items, function(item) {
                item.companyId = item.cid;
                delete item.cid;
            });
            return items;
        },
        refresh: function(options) {
            options = _.extend({
                type: 'post',
                parse: true,
                reset: true
            }, options);
            this.fetch(options);
        }
    });

    return AppCollection;
})