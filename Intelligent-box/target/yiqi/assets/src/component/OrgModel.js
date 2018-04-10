define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Model = require('./Model');

    var Org = Model.extend({
        idAttribute: '_id',
        destroy: function(options) {
            var data = this.pick('id');
            Org.__super__.destroy.call(this, _.extend({
                url: CONTEXT_PATH + '/web/system/deleteOrg.do',
                data: data
            }, this.syncOptions, options));
        },
        getNodeData: function() {
            var data = this.pick('id', 'type', 'name', 'isParent');
            data.dataId = data.type + data.id;
            return data;
        }
    }, {
        TYPE_DEPT: 'dept',
        TYPE_CO: 'company'
    });

    var Company = Org.extend({
        defaults: function() {
            return {
                _id: _.uniqueId(Org.TYPE_CO),
                id: '',
                name: '',
                type: Org.TYPE_CO,
                // node attrs
                isParent: true,
                isRoot: false,
                $tId: ''
            }
        }
    });

    var Dept = Org.extend({
        defaults: function() {
            return {
                _id: _.uniqueId(Org.TYPE_DEPT),
                id: '',
                companyId: 0,
                name: '',
                higherId: '',
                type: Org.TYPE_DEPT,
                // node attrs
                isParent: true,
                isRoot: false,
                $tId: ''
            }
        }
    });

    return {
        Org: Org,
        Company: Company,
        Dept: Dept
    };
});