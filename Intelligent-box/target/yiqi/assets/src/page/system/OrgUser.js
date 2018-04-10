define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Model = require('component/Model');
    var OrgUser = Model.extend({
        idAttribute: 'index',
        defaults: {
            id: 0,
            name: '',
            orgName:'',
            mobile: '',
            shortNum: '',
            isLeader: 0,
            job: '',
            email: '',
            sex: 0,
            sort: 1,
            orgId: '', // 组织id
            orgName: '', // 部门名称
            companyId: '' // 公司id
        },
        serialize: function() {
            var data = this.toJSON();
            var sex = this.get('sex');
            var sexText = '未知';
            if (sex == 1) sexText = '男';
            else if (sex == 0) sexText = '女';

            data.sexText = sexText;
            data._isNew = this.isNew();
            return data;
        }
    });

    return OrgUser;
});