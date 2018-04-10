_.extend(Yiqi, {
    cleanEmoji: function(str) {
        if (_.isString(str)) {
            return str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
        }
        return str;
    },
    dayPad: function(date, format) {
        var m = moment(date, format);
        return m.isValid() ? m.hours(0).minute(0).second(0).millisecond(0).add(86399000, 'ms').format('x') : '';
    }
});

function getRootNode() {
    return {
        id: 'c_' + COMPANY_ID,
        dataId: COMPANY_ID,
        name: '候选审批人',
        type: 'org',
        parentId: 0,
        parentDataId: 0,
        parentName: '',
        level: 0
    };
}

function showErrors() {
    var errorList = this.errorList;
    if (errorList.length) {
        var error = errorList[0];
        Yiqi.toast(error.message).show();
    }
}

// 通用 popup
var F7PopupView = Backbone.View.extend({
    className: 'popup',
    title: '',
    removeOnClose: false,
    autoRender: false,
    container: 'body',
    template: Yiqi.renders.popupTmpl,
    initialize: function(options) {
        options || (options = {});
        _.extend(this, _.pick(options, ['title', 'removeOnClose', 'autoRender', 'container', 'template']));
        var className = this.cid;
        // 关闭时移除
        if (this.removeOnClose) className += ' remove-on-close';
        this.$el.addClass(className);

        if (!this.model) this.model = new Backbone.Model();

        // 自动渲染
        if (this.autoRender) {
            this.render().$el.appendTo($(this.container));
        }
    },
    render: function() {
        var data = _.pick(this, 'cid', 'title');
        _.extend(data, {
            model: this.model.toJSON()
        });

        var markup = this.template(data);
        this.$el.html(markup);

        return this;
    },
    close: function() {
        if (this.$el.hasClass('remove-on-close')) {
            this.stopListening();
        }
    }
});
// 带表单的 popup
var FormPopupView = F7PopupView.extend({
    validator: null,
    events: {
        'closed': 'close',
        'click [data-do="done"]': 'submit'
    },
    initialize: function(options) {
        FormPopupView.__super__.initialize.apply(this, arguments);
        this.cacheEls();
    },
    cacheEls: function() {
        this.$form = this.$('[role="form-main"]');
    },
    valid: function() {},
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
    },
    save: function(url, data) {
        this.xhr = $.ajax({
            context: this,
            url: url,
            type: 'post',
            dataType: 'json',
            data: data,
            traditional: true,
            beforeSend: ajaxCallback.beforeSend,
            error: ajaxCallback.error,
            success: ajaxCallback.success
        });

        return this.xhr;
    },
    getFormData: function() {
        var data = this.$form.serializeObject();
        return data;
    }
}, {
    validOptions: {
        onsubmit: false,
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        focusInvalid: false,
        focusCleanup: false
    }
});

function userDataToContactUser(models) {
    return _.map(models, function(model) {
        var id = model.orgId == null ? 'u_' + model.id : 'u_' + model.orgId + '_' + model.id;
        return {
            id: id,
            dataId: model.id,
            name: model.name,
            parentDataId: model.orgId,
            parentName: model.orgName
        };
    });
}

function encodeUserData(data) {
    var userTypeMap = {
        sponsors: 1,
        supports: 2,
        staffs: 3,
        checkPeoples: 4,
        jobCreator: 5
    }

    var pmUsersString = [];

    _.each(userTypeMap, function(type, key) {
        if (data[key]) {
            var users = data[key];
            var orgIds = data[key + 'OrgId'];
            var orgNames = data[key + 'OrgName'];

            if (!_.isArray(users)) {
                users = [users];
                orgIds = [orgIds];
                orgNames = [orgNames];
            }

            _.each(users, function(user, index) {
                pmUsersString.push({
                    uid: user,
                    type: type,
                    orgId: orgIds[index],
                    orgName: orgNames[index]
                });
            });

            delete data[key];
            delete data[key + 'OrgId'];
            delete data[key + 'OrgName'];
        }
    });

    if (pmUsersString.length > 0) {
        pmUsersString = JSON.stringify(pmUsersString);
        pmUsersString = pmUsersString;
    } else {
        pmUsersString = '';
    }
    return pmUsersString;
}

var CheckInputPopupView = FormPopupView.extend({
    initialize: function(options) {
        CheckInputPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            if (!data.nextAssigneeId || data.nextAssigneeId == '') {
                Yiqi.toast('请选择审批人').show();
                return;
            }
            var levelMap = {
                '无密级': 0,
                '内部消息': 1,
                '普通商密': 2,
                '核心商密': 3
            }

            if (_.isUndefined(levelMap[data.confidentialityLevel])) {
                Yiqi.toast('密级设置不正确').show();
                return;
            }

            var _this = this;
            Yiqi.confirm('审批发起后，本督办的内容将无法修改，是否确认提交？', function() {
                data.confidentialityLevel = levelMap[data.confidentialityLevel];
                data.endTime = Yiqi.dayPad(data.endTime, 'x');
                data.code = Yiqi.cleanEmoji(data.code);
                data.title = Yiqi.cleanEmoji(data.title);
                data.message = Yiqi.cleanEmoji(data.message);
                _this.save(CONTEXT_PATH + '/web/pm/createCheck.do', data);
            });
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    code: {
                        maxlength: 50
                    },
                    endTime: {
                        required: true
                    },
                    title: {
                        required: true,
                        maxlength: 50
                    },
                    message: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    code: {
                        maxlength: '审批编号不得超过50个字符'
                    },
                    endTime: {
                        required: '请选择截止日期'
                    },
                    title: {
                        required: '请填写审批标题',
                        maxlength: '审批标题不得超过50个字符'
                    },
                    message: {
                        required: '请填写审批事项',
                        maxlength: '审批事项不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        // 密级选择
        this.levelPicker = Yiqi.picker({
            input: this.$('input[name="confidentialityLevel"]'),
            toolbarCloseText: '完成',
            cols: [{
                textAlign: 'center',
                values: ['无密级', '内部消息', '普通商密', '核心商密']
            }]
        });
        // 可选审批人
        var checkPeoples = this.model.get('checkPeoples');
        var jobCreator = this.model.get('jobCreator');

        var rootNode = getRootNode();
        var parseData = function(item) {
            return {
                id: 'u_' + item.orgId + '_' + item.id,
                parentId: rootNode.id,
                dataId: item.id,
                name: item.name,
                type: 'user',
                parentDataId: item.orgId,
                parentName: item.orgName,
                level: 1
            }
        }
        var range = _.map(checkPeoples, parseData);
        range = range.concat(_.map(jobCreator, parseData));
        range.unshift(rootNode);
        // 人员选择
        var $el = this.$('[data-picker="user"]');
        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $el.data('name');
        var mode = $el.data('mode') || 'm';
        var select = new UserSelector({
            itemView: AssigneeItemView,
            name: name,
            mode: mode,
            el: $el[0],
            collection: collection,
            range: range
        });
        select.render();
        // 默认人员
        var models = userDataToContactUser(jobCreator);
        _.each(models, function(model) {
            model.parentId = 0;
        });
        collection.reset(models);
    },
    colse: function() {
        this.levelPicker.destroy();
        CheckInputPopupView.__super__.close.call(this);
    }
});
var CheckReSubmitPopupView = FormPopupView.extend({
    initialize: function(options) {
        CheckReSubmitPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            if (!data.nextAssigneeId || data.nextAssigneeId == '') {
                Yiqi.toast('请选择审批人').show();
                return;
            }
            data.endTime = Yiqi.dayPad(data.endTime, 'YYYY年MM月DD日');
            data.title = Yiqi.cleanEmoji(data.title);
            data.message = Yiqi.cleanEmoji(data.message);
            this.save(CONTEXT_PATH + '/web/pm/editCheck.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    code: {
                        maxlength: 50
                    },
                    endTime: {
                        required: true
                    },
                    title: {
                        required: true,
                        maxlength: 50
                    },
                    message: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    code: {
                        maxlength: '审批编号不得超过50个字符'
                    },
                    endTime: {
                        required: '请选择截止日期'
                    },
                    title: {
                        required: '请填写审批标题',
                        maxlength: '审批标题不得超过50个字符'
                    },
                    message: {
                        required: '请填写审批事项',
                        maxlength: '审批事项不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        var endTime = this.model.get('endTime');
        Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            value: endTime == '' ? null : [endTime],
            input: this.$('.datetimepicker')[0],
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });
        // 用户选择：审批人
        var checkPeoples = this.model.get('checkPeoples');
        var jobCreator = this.model.get('jobCreator');

        var rootNode = getRootNode();
        var parseData = function(item) {
            return {
                id: 'u_' + item.orgId + '_' + item.id,
                parentId: rootNode.id,
                dataId: item.id,
                name: item.name,
                type: 'user',
                parentDataId: item.orgId,
                parentName: item.orgName,
                level: 1
            }
        }
        var range = _.map(checkPeoples, parseData);
        range = range.concat(_.map(jobCreator, parseData));
        range.unshift(rootNode);

        var $el = this.$('[data-picker="user"]');
        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $el.data('name');
        var mode = $el.data('mode') || 'm';
        var select = new UserSelector({
            itemView: AssigneeItemView,
            name: name,
            mode: mode,
            el: $el[0],
            collection: collection,
            range: range
        });
        select.render();
    }
});
var CheckRejectPopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.message = Yiqi.cleanEmoji(data.message);
            this.save(CONTEXT_PATH + '/web/pm/toCheck.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    message: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    message: {
                        required: '请填写驳回意见',
                        maxlength: '驳回意见不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});
var CheckDonePopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.message = Yiqi.cleanEmoji(data.message);
            this.save(CONTEXT_PATH + '/web/pm/toCheck.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    message: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    message: {
                        required: '请填写审批意见',
                        maxlength: '审批意见不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});
var CheckNextPopupView = FormPopupView.extend({
    initialize: function(options) {
        CheckInputPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            if (!data.nextAssigneeId || data.nextAssigneeId == '') {
                Yiqi.toast('请选择审批人').show();
                return;
            }
            if (data.assigneeId == data.nextAssigneeId) {
                Yiqi.toast('请选择其他人作为审批人').show();
                return;
            }
            data.message = Yiqi.cleanEmoji(data.message);
            this.save(CONTEXT_PATH + '/web/pm/toCheck.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    message: {
                        // required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    message: {
                        // required: '请填写审批意见',
                        maxlength: '审批意见不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        var checkPeoples = this.model.get('checkPeoples');
        var jobCreator = this.model.get('jobCreator');

        var rootNode = getRootNode();
        var parseData = function(item) {
            return {
                id: 'u_' + item.orgId + '_' + item.id,
                parentId: rootNode.id,
                dataId: item.id,
                name: item.name,
                type: 'user',
                parentDataId: item.orgId,
                parentName: item.orgName,
                level: 1
            }
        }
        var range = _.map(checkPeoples, parseData);
        range = range.concat(_.map(jobCreator, parseData));
        range.unshift(rootNode);

        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $(this).data('name');
        var mode = $(this).data('mode') || 's';
        var select = new UserSelector({
            itemView: AssigneeItemView,
            name: name,
            mode: mode,
            el: this.$('[data-picker="user"]')[0],
            collection: collection,
            range: range
        });
        select.render();
    }
});

var ProjectMilestoneView = Backbone.View.extend({
    tagName: 'li',
    className: 'item-milestone',
    template: Yiqi.renders.projectMilestoneTmpl,
    initialize: function() {
        if (!this.model) this.model = new MilestoneModel;
    },
    events: {
        'click .remove': 'remove'
    },
    render: function() {
        var markup = this.template({
            model: this.model.toJSON()
        });
        this.$el.html(markup);

        this.datetimepicker = Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            input: this.$('input[name="milestoneTime"]'),
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });

        return this;
    },
    remove: function() {
        this.datetimepicker.destroy();
        ProjectMilestoneView.__super__.remove.call(this);
    }
});

var ProjectInputPopupView = FormPopupView.extend({
    events: {
        'click .add-ms': 'addMilestone',
        'closed': 'close',
        'click [data-do="done"]': 'submit'
    },
    initialize: function(options) {
        ProjectInputPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();

            data.title = Yiqi.cleanEmoji(data.title);
            data.message = Yiqi.cleanEmoji(data.message);
            data.endTime = Yiqi.dayPad(data.endTime, 'YYYY年MM月DD日');

            var typeMap = {
                '综合支撑': 1,
                '园区管理': 2,
                '工程建设': 3,
                '采购事项': 4,
                '其它': 5
            }

            data.type = typeMap[data.type] || 0;
            if (data.type == 0) {
                Yiqi.toast('督办类型不正确').show();
                return;
            }

            var endTime = data.endTime;
            if (!_.isUndefined(data.milestoneTime) || !_.isUndefined(data.milestoneTime)) {
                var milestoneError = 0;
                var milestoneErrorMessage = '';
                var milestoneTime = data.milestoneTime;
                var milestoneMessage = data.milestoneMessage;

                if (!_.isArray(milestoneTime)) {
                    milestoneTime = [milestoneTime];
                    milestoneMessage = [milestoneMessage];
                }

                for (var i = 0, length = milestoneTime.length; i < length; i++) {
                    var message = milestoneMessage[i];
                    if (message == '') {
                        milestoneError = i + 1;
                        milestoneErrorMessage = '请填写督办里程碑描述';
                        break;
                    }

                    var time = milestoneTime[i];
                    if (time == '') {
                        milestoneError = i + 1;
                        milestoneErrorMessage = '请选择督办里程碑截止日期';
                        break;
                    }

                    time = moment(time, 'YYYY年MM月DD日');
                    if (!time.isValid()) {
                        milestoneError = i + 1;
                        milestoneErrorMessage = '督办里程碑截止日期格式不正确';
                        break;
                    }

                    time = time.format('x');
                    if (time > endTime) {
                        milestoneError = i + 1;
                        milestoneErrorMessage = '督办里程碑日期不能晚于截止日期';
                        break;
                    }

                    milestoneTime[i] = time;
                    milestoneMessage[i] = Yiqi.cleanEmoji(message);
                }

                if (milestoneError > 0) {
                    milestoneErrorMessage = '#' + milestoneError + milestoneErrorMessage;
                    Yiqi.toast(milestoneErrorMessage).show();
                    return;
                }

                data.milestoneTime = milestoneTime;
                data.milestoneMessage = milestoneMessage;
            }

            if (_.isUndefined(data.sponsors) || data.sponsors == '') {
                Yiqi.toast('请选择主办负责人').show();
                return;
            }


            if (_.isUndefined(data.checkPeoples) || (_.isString(data.checkPeoples) && data.checkPeoples == '') || (_.isArray(data.checkPeoples) && data.checkPeoples.length == 0)) {
                Yiqi.toast('请选择督办审批人').show();
                return;
            }

            var duplicate = _.chain(data.checkPeoples).countBy(function(id) {
                return id;
            }).filter(function(count) {
                return count > 1;
            }).value();
            if (duplicate.length > 0) {
                Yiqi.toast('审批人不可选择同一人').show();
                return;
            }

            if (_.isUndefined(data.jobCreator) || data.jobCreator == '') {
                Yiqi.toast('请选择督办员').show();
                return;
            }

            var supports = data.supports;
            if (!_.isUndefined(supports) && !_.isArray(supports)) {
                supports = [supports];
            }

            if (data.jobCreator == data.sponsors || _.indexOf(supports, data.jobCreator) != -1) {
                Yiqi.toast('督办员不能为主办或协办负责人').show();
                return;
            }

            if (_.isUndefined(data.staffs) || (_.isString(data.staffs) && data.staffs == '') || (_.isArray(data.staffs) && data.staffs.length == 0)) {
                Yiqi.toast('请选择督办成员').show();
                return;
            }

            data.pmUsersString = encodeUserData(data);
            this.save(CONTEXT_PATH + '/web/pm/createPM.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    title: {
                        required: true,
                        maxlength: 20
                    },
                    message: {
                        required: true,
                        maxlength: 1000
                    },
                    endTime: {
                        required: true
                    },
                    type: {
                        required: true
                    }
                },
                messages: {
                    title: {
                        required: '请填写督办名称',
                        maxlength: '督办名称不得超过20个字符'
                    },
                    message: {
                        required: '请填写督办事项',
                        maxlength: '督办事项不得超过1000个字符'
                    },
                    endTime: {
                        required: '请选择截止时间'
                    },
                    type: {
                        required: '请选择督办类型'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        // 截止日期
        Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            input: this.$('input[name="endTime"]'),
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });
        // 督办类型
        this.typePicker = Yiqi.picker({
            input: this.$('input[name="type"]'),
            toolbarCloseText: '完成',
            cols: [{
                textAlign: 'center',
                values: _.values(ProjectModel.type)
            }]
        });
        // 用户选择
        var $els = this.$('[data-picker="user"]');

        var defaultUserData = getDefaultUserData();

        $els.each(function() {
            var collection = new Backbone.Collection(null, {
                model: UserModel
            });
            var name = $(this).data('name');
            var mode = $(this).data('mode') || 'm';
            var select = new UserSelector({
                name: name,
                mode: mode,
                el: this,
                collection: collection
            });
            select.render();
            if (defaultUserData[name]) {
                collection.reset(userDataToContactUser(defaultUserData[name]));
            }
        });
    },
    addMilestone: function(event) {
        var milestones = this.$('.milestone-message');
        if (milestones.length >= 3) {
            Yiqi.toast('最多只能添加3个里程碑').show();
        } else {
            var $parent = $(event.target).parent();
            var milestone = new ProjectMilestoneView();
            $parent.before(milestone.render().$el.before());
        }
    },
    colse: function() {
        this.typePicker.destroy();
        ProjectInputPopupView.__super__.close.call(this);
    }
});

var ProjectEditPopupView = ProjectInputPopupView.extend({
    save: function(url, data) {
        ProjectEditPopupView.__super__.save.call(this, CONTEXT_PATH + '/web/pm/updatePM.do', data);
    },
    initViews: function() {
        var endTimeObj = this.model.get('endTimeObj');
        var endTime = '';
        if (endTimeObj) {
            endTime = endTimeObj.format('YYYY-MM-DD');
        }
        Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            value: endTime == '' ? null : [endTime],
            input: this.$('.datetimepicker')[0],
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });

        var milestones = this.model.get('milestones');
        if (milestones.length > 0) {
            var $place = this.$('.add-ms').parent();
            milestones = new Backbone.Collection(milestones, {
                model: MilestoneModel
            });
            milestones.each(function(model) {
                var view = new ProjectMilestoneView({
                    model: model
                });

                $place.before(view.render().$el);
            });
        }

        // 督办类型
        var type = Yiqi.picker({
            input: this.$('input[name="type"]'),
            toolbarCloseText: '完成',
            cols: [{
                textAlign: 'center',
                values: _.values(ProjectModel.type)
            }]
        });

        var $els = this.$('[data-picker="user"]');
        var view = this;
        $els.each(function() {
            var collection = new Backbone.Collection(null, {
                model: UserModel
            });
            var name = $(this).data('name');
            var mode = $(this).data('mode') || 'm';
            var data = [];

            var models = view.model.get(name);
            models = _.isArray(models) ? userDataToContactUser(models) : [];
            var select = new UserSelector({
                name: name,
                mode: mode,
                el: this,
                collection: collection
            });
            select.render();
            collection.reset(models);
        });
    }
});
var ProjectEditAndCheckPopupView = ProjectEditPopupView.extend({
    save: function(url, data) {
        this.xhr = $.ajax({
            context: this,
            url: CONTEXT_PATH + '/web/pm/updatePMForRestart.do',
            type: 'post',
            dataType: 'json',
            data: data,
            traditional: true,
            beforeSend: ajaxCallback.beforeSend,
            error: ajaxCallback.error,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '操作失败'
                }, resp);
                if (resp.success) {
                    Yiqi.toastSuccess();
                    Yiqi.closeModal(this.el);
                    Yiqi.mainView.router.back();
                } else {
                    Yiqi.toastWarning(resp.message);
                }
            }
        });

        return this.xhr;
    }
});
var TaskInputPopupView = FormPopupView.extend({
    initialize: function(options) {
        TaskInputPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();

            if (!data.receives || data.receives == '') {
                Yiqi.toast('请选择任务接收人').show();
                return false;
            }

            var receives = _.isArray(data.receives) ? data.receives : [data.receives];
            if (_.indexOf(receives, UID.toString()) != -1) {
                Yiqi.toast('任务接收人不能为自己').show();
                return false;
            }

            data.endTime = Yiqi.dayPad(data.endTime, 'YYYY年MM月DD日');
            data.isMessage = data.isMessage == 1 ? 1 : 0;
            data.isUrgency = data.isUrgency == 1 ? 1 : 0;
            data.title = Yiqi.cleanEmoji(data.title);
            data.message = Yiqi.cleanEmoji(data.message);
            this.save(CONTEXT_PATH + '/web/pm/createJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    title: {
                        required: true,
                        maxlength: 20
                    },
                    message: {
                        required: true,
                        maxlength: 1000
                    },
                    endTime: {
                        required: true
                    }
                },
                messages: {
                    title: {
                        required: '请填写督办名称',
                        maxlength: '督办名称不得超过20个字符'
                    },
                    message: {
                        required: '请填写任务内容',
                        maxlength: '任务内容不得超过1000个字符'
                    },
                    endTime: {
                        required: '请选择截止日期'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        var endTime = this.model.get('endTime');
        Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            value: endTime == '' ? null : [endTime],
            input: this.$('.datetimepicker')[0],
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });

        var $el = this.$('[data-picker="user"]');
        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $el.data('name');
        var mode = $el.data('mode') || 'm';
        var select = new UserSelector({
            itemView: TaskUserItemView,
            name: name,
            mode: mode,
            el: $el[0],
            collection: collection
        });
        select.render();

        var supports = this.model.get('supports');
        var sponsors = this.model.get('sponsors');
        var models = supports.concat(sponsors);
        models = userDataToContactUser(models);

        models = _.filter(models, function(model) {
            return model.dataId != UID;
        });

        collection.reset(models);
    }
});
var TaskAssignPopupView = FormPopupView.extend({
    initialize: function(options) {
        TaskAssignPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();

            var time = moment(data.endTime, 'YYYY年MM月DD日');
            if (!time.isValid()) {
                Yiqi.toast('任务截止日期格式不正确').show();
                return;
            }
            time = time.format('x');
            var endTime = this.model.get('endTime');
            if (time > endTime) {
                Yiqi.toast('任务截止日期不能晚于当前分配的截止日期').show();
                return;
            }

            if (!data.receives || data.receives == '') {
                Yiqi.toast('请选择任务接收人').show();
                return;
            }

            data.title = Yiqi.cleanEmoji(data.title);
            data.message = Yiqi.cleanEmoji(data.message);
            data.endTime = Yiqi.dayPad(data.endTime, 'YYYY年MM月DD日');
            this.save(CONTEXT_PATH + '/web/pm/createJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    title: {
                        required: true,
                        maxlength: 20
                    },
                    message: {
                        required: true,
                        maxlength: 1000
                    },
                    endTime: {
                        required: true
                    }
                },
                messages: {
                    title: {
                        required: '请填写任务名称',
                        maxlength: '任务名称不得超过20个字符'
                    },
                    message: {
                        required: '请填写任务内容',
                        maxlength: '任务内容不得超过1000个字符'
                    },
                    endTime: {
                        required: '请选择截止日期'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        var endTimeObj = this.model.get('endTimeObj');
        var endTime = '';
        if (endTimeObj) {
            endTime = endTimeObj.format('YYYY-MM-DD');
        }
        Yiqi.calendar({
            disabled: {
                to: new Date()
            },
            dateFormat: 'yyyy年mm月dd日',
            closeOnSelect: true,
            value: endTime == '' ? null : [endTime],
            input: this.$('.datetimepicker')[0],
            monthNames: monthNames,
            monthNamesShort: monthNamesShort
        });

        var $el = this.$('[data-picker="user"]');
        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $el.data('name');
        var mode = $el.data('mode') || 'm';
        var select = new UserSelector({
            itemView: TaskUserItemView,
            name: name,
            mode: mode,
            el: $el[0],
            collection: collection
        });
        select.render();
    }
});
var TaskDonePopupView = FormPopupView.extend({
    submit: function() {
        var status = this.model.get('status');
        if (status == 0 || status == 11 || status == 21) {
            if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
            if (this.valid()) {
                var data = this.getFormData();
                data.assignedFinishReason = Yiqi.cleanEmoji(data.assignedFinishReason);
                this.save(CONTEXT_PATH + '/web/pm/updateJob.do', data);
            }
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    assignedFinishReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    assignedFinishReason: {
                        required: '请填写工作成果',
                        maxlength: '工作成果不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    save: function(url, data) {
        this.xhr = $.ajax({
            context: this,
            url: url,
            type: 'post',
            dataType: 'json',
            data: data,
            traditional: true,
            beforeSend: ajaxCallback.beforeSend,
            error: ajaxCallback.error,
            success: function(resp) {
                resp = _.extend({
                    success: false,
                    message: '操作失败'
                }, resp);
                if (resp.success) {
                    var _this = this;
                    this.model.set('status', TaskModel.STATUS_CHECKING);
                    Yiqi.cartoon.yeah(function() {
                        Yiqi.hidePreloader();
                        Yiqi.toastSuccess();
                        Yiqi.closeModal(_this.el);
                        Yiqi.mainView.router.refreshPage();
                    });
                } else {
                    Yiqi.toastWarning(resp.message);
                }
            }
        });
    }
});
var TaskCheckDonePopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.finishReason = Yiqi.cleanEmoji(data.finishReason);
            this.save(CONTEXT_PATH + '/web/pm/updateJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    finishReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    finishReason: {
                        required: '请填写点评',
                        maxlength: '点评不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});
var TaskRejectDonePopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.finishReason = Yiqi.cleanEmoji(data.finishReason);
            this.save(CONTEXT_PATH + '/web/pm/updateJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    finishReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    finishReason: {
                        required: '请填写原因',
                        maxlength: '原因不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});
var TaskAbortPopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.assignedForgoReason = Yiqi.cleanEmoji(data.assignedForgoReason);
            this.save(CONTEXT_PATH + '/web/pm/updateJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    assignedForgoReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    assignedForgoReason: {
                        required: '请填写原因',
                        maxlength: '原因不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
});
var TaskAllowAbortPopupView = FormPopupView.extend({
    initialize: function(options) {
        TaskAllowAbortPopupView.__super__.initialize.call(this, options);
        this.initViews();
    },
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            if (!data.receives || data.receives == '') {
                Yiqi.toast('请选择任务接收人').show();
                return;
            }
            data.forgoReason = Yiqi.cleanEmoji(data.forgoReason);
            this.save(CONTEXT_PATH + '/web/pm/allowGiveupJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    forgoReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    forgoReason: {
                        required: '请填写同意理由',
                        maxlength: '理由不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    },
    initViews: function() {
        var $el = this.$('[data-picker="user"]');
        var collection = new Backbone.Collection(null, {
            model: UserModel
        });
        var name = $el.data('name');
        var mode = $el.data('mode') || 'm';
        var select = new UserSelector({
            itemView: TaskUserItemView,
            name: name,
            mode: mode,
            el: $el[0],
            collection: collection
        });
        select.render();
    }
});
var TaskRejectAbortPopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        if (this.valid()) {
            var data = this.getFormData();
            data.forgoReason = Yiqi.cleanEmoji(data.forgoReason);
            this.save(CONTEXT_PATH + '/web/pm/updateJob.do', data);
        }
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    forgoReason: {
                        required: true,
                        maxlength: 1000
                    }
                },
                messages: {
                    forgoReason: {
                        required: '请填写原因',
                        maxlength: '原因不得超过1000个字符'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});

var TaskRemindPopupView = FormPopupView.extend({
    submit: function() {
        if (_.isObject(this.xhr) && this.xhr.state() == 'pending') return false;
        var data = this.getFormData();
        if (!data.remindType) {
            Yiqi.toast('请选择提醒方式').show();
            return;
        }
        this.save(CONTEXT_PATH + '/web/pm/createPmRemind.do', data);
    },
    valid: function() {
        if (!this.validator) {
            var validOptions = _.extend(FormPopupView.validOptions, {
                showErrors: showErrors,
                rules: {
                    type: {
                        required: true
                    }
                },
                messages: {
                    type: {
                        required: '请选择提醒方式'
                    }
                }
            });

            this.validator = this.$form.validate(validOptions);
        }

        var isValid = this.$form.valid();
        return isValid;
    }
});
// 用户模型 - 选择人员时使用
var UserModel = Backbone.Model.extend({
    defaults: {
        dataId: 0,
        name: '',
        nameShort: '',

        $color: '#fff'
    },
    initialize: function() {
        var name = this.get('name');
        this.set({
            $color: '#' + str2color(name),
            nameShort: getShortName(name)
        });
    }
});
// 通讯录条目模型 - 通讯录
var ContactItemModel = UserModel.extend({
    defaults: {
        type: '', // user org
        dataId: 0, // id
        parentId: 0, // orgId
        level: 1,
        name: '',
        nameShort: '',

        $selected: false,
        $color: '#fff'
    }
});
// 通讯录条目视图
var ContactItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'contact-item',
    template: Yiqi.renders.contactItemTmpl,
    id: function() {
        return this.model.id;
    },
    events: {
        'click': 'doClick'
    },
    initialize: function() {
        this.listenTo(this.model, 'remove', this.remove);
        this.listenTo(this.model, 'change:$selected', this.onSelect);
    },
    doClick: function() {
        var type = this.model.get('type');
        var selected = true;

        if (type == 'user') {
            selected = !this.model.get('$selected');
        }

        this.model.set('$selected', selected);
    },
    onSelect: function(model, selected) {
        if (model.get('type') == 'user') {
            this.render();
        }
    },
    render: function() {
        var data = this.model.toJSON();
        var markup = this.template({
            model: data
        });

        this.$el.html(markup);
        return this;
    }
});
var SearchResultItemView = ContactItemView.extend({
    template: Yiqi.renders.searchResultItemTmpl
});
// 通讯录（用户选择）
var ContactCollection = Backbone.Collection.extend({
    model: ContactItemModel,
    parse: function(resp) {
        resp = _.extend({
            success: false,
            model: [],
            message: ''
        }, resp);
        var models = [];
        if (resp.success && _.isArray(resp.model) && resp.model.length > 0) {
            var model = resp.model;
            var company = model[0];
            var root = {
                id: 'c_' + company.id,
                dataId: company.id,
                name: company.name,
                type: 'org',
                level: 0,
                parentId: 0,
                parentDataId: 0,
                parentName: ''
            }
            models.push(root);
            walkList(company.orgList, root, function(element, parent, level) {
                var users = element.users;
                var parentDataId = parent.id;
                var parentId = parent.parentId == 0 ? parent.id : 'o_' + parent.id;
                var orgDataId = element.id;
                var org = {
                    id: 'o_' + element.id,
                    dataId: element.id,
                    name: element.orgName,
                    parentId: parentId,
                    parentDataId: parentId,
                    parentName: parent.name,
                    level: level,
                    type: 'org'
                }
                models.push(org);
                _.each(users, function(user) {
                    models.push({
                        id: 'u_' + orgDataId + '_' + user.id,
                        dataId: user.id,
                        name: user.name,
                        parentId: org.id,
                        parentDataId: orgDataId,
                        parentName: org.name,
                        level: level,
                        type: 'user'
                    });
                });
            }, 'orgs');
        }
        return models;
    }
});
var UserPickerPopupView = F7PopupView.extend({
    pathTemplate: Yiqi.renders.contactPathTmpl,
    mode: 'm', // m 多选，s 单选
    inSearch: false,
    source: null,
    events: {
        'click [data-do="add"]': 'doAdd',
        'click [data-do="nav"]': 'doNav',
        'closed': 'onClosed'
    },
    initialize: function(options) {
        options || (options = {});
        _.extend(this, _.pick(options, ['mode', 'source']));
        UserPickerPopupView.__super__.initialize.call(this, options);

        this.collection = new ContactCollection;
        _.extend(this.collection, {
            url: CONTEXT_PATH + '/api/users/' + COMPANY_ID
        });

        this.selection = new Backbone.Collection(null, {
            model: ContactItemModel
        });

        this.dataList = new Backbone.Collection(null, {
            model: ContactItemModel,
            comparator: 'type'
        });

        this.paths = new Backbone.Collection(null, {
            model: ContactItemModel
        });

        this.listenTo(this.collection, 'request', this.onRequest);
        this.listenTo(this.collection, 'error', this.onError);
        this.listenTo(this.collection, 'sync', this.onSync);
        this.listenTo(this.collection, 'reset', this.onReset);
        this.listenTo(this.collection, 'change:$selected', this.onSelect);
        this.listenTo(this.paths, 'update', this.syncPath);
        this.listenTo(this.dataList, 'reset', this.onDataReset);

        this.cacheEls();
        this.initData();
        this.initSearchbar();
    },
    onRequest: function() {
        Yiqi.showPreloader();
    },
    onError: function() {
        Yiqi.hidePreloader();
        Yiqi.toast('无法获取数据', '<i class="iconfont">&#xe60b;</i>').show();
    },
    onSync: function() {
        Yiqi.hidePreloader();

        var data = this.collection.toJSON();
        localStorage.setItem('contacts', JSON.stringify(data));
    },
    onSelect: function(model, selected, options) {
        var type = model.get('type');
        if (type == 'org' && selected) {
            this.paths.add(model.toJSON());
            this.dataList.reset(this.collection.where({
                parentId: model.id
            }));
        } else if (type == 'user') {
            var method = selected ? 'add' : 'remove';
            if (method == 'add') {
                // 单选方式下要取消之前选择的元素
                if (this.mode == 's') {
                    var preModel = this.selection.at(0);
                    if (preModel) {
                        preModel = this.collection.get(preModel);
                        preModel.set('$selected', false);
                    }
                }
            }
            this.selection[method](model.toJSON());
        }
    },
    onReset: function(collection, options) {
        var previousModels = options.previousModels;
        _.each(previousModels, function(model) {
            model.trigger('remove');
        });

        // var data = this.collection.toJSON();
        // localStorage.setItem('contacts', JSON.stringify(data));

        if (this.collection.length == 0) {
            this.nodata();
        } else {
            // 数据获取后，设置选中的人员
            this.initSelection();
            this.initPath();
        }
    },
    onDataReset: function(collection, options) {
        var previousModels = options.previousModels;
        _.each(previousModels, function(model) {
            model.trigger('remove');
        });

        var views = [];
        if (this.dataList.length == 0) {
            this.$items.html('<li><div class="item-content">没有相关人员</div></li>');
        } else {
            var ItemView = ContactItemView;
            if (this.inSearch) ItemView = SearchResultItemView;
            this.dataList.each(function(model) {
                var view = new SearchResultItemView({
                    model: model
                });
                views.push(view.render().el);
            });
            this.$items.html(views);
        }
    },
    onClosed: function(event) {
        this.trigger('closed', event, this);
    },
    initData: function() {
        if (_.isArray(this.source) && this.source.length > 0) {
            this.collection.reset(this.source);
        } else {
            var data = localStorage.getItem('contacts');
            try {
                data = JSON.parse(data);
            } catch (e) {}
            if (_.isArray(data)) {
                this.collection.reset(data);
            } else {
                this.collection.fetch({
                    reset: true,
                    parse: true
                });
            }
        }
    },
    initSelection: function() {
        var selected = this.model.get('selected');
        var models = [];
        _.each(selected, function(model) {
            var model = this.collection.get(model);
            if (model) {
                model.set('$selected', true);
                models.push(model.toJSON());
            }
        }, this);
        this.selection.reset(models);
    },
    initSearchbar: function() {
        this.searchbar = Yiqi.searchbar(this.$searchbar[0], {
            searchList: this.$items,
            customSearch: true,
            onEnable: _.bind(this.doSearchEnable, this),
            onDisable: _.bind(this.doSearchDisable, this),
            // onClear: _.bind(this.doSearchClear, this),
            onSearch: _.bind(this.doSearch, this)
        });
    },
    initPath: function() {
        var path = this.model.get('path');
        var model = this.collection.get(path[0]);
        if (model) {
            model.set('$selected', false, {
                silent: true
            }).set('$selected', true);
            this.paths.add(model.toJSON());
        }
    },
    cacheEls: function() {
        this.$items = this.$('[role="items"]');
        this.$searchbar = this.$('[role="searchbar"]');
        var $path = this.$path = this.$('[role="path"]');
    },
    doSearchEnable: function() {
        this.inSearch = true;
    },
    doSearchDisable: function() {
        this.inSearch = false;
        var model = this.paths.last();
        var models = this.collection.where({
            parentId: model.id
        });
        this.dataList.reset(models);
    },
    doSearch: function(searchbar, options) {
        if (this.inSearch) {
            var query = options.query;
            var datas = [];
            if (query.length > 0) {
                this.collection.each(function(model) {
                    var name = model.get('name');
                    if (name.indexOf(query) > -1) {
                        datas.push(model);
                    }
                });
            }
            this.dataList.reset(datas);
        }
    },
    doAdd: function() {
        this.trigger('select', this.selection.toJSON());
        Yiqi.closeModal(this.el);
    },
    doNav: function(event) {
        var $target = $(event.target);
        var index = $target.data('index');
        var models = this.paths.slice(index + 1);

        _.each(models, function(model) {
            this.collection.get(model.id).set('$selected', false);
        }, this);
        this.paths.remove(models);

        var model = this.paths.last();
        this.dataList.reset(this.collection.where({
            parentId: model.id
        }));
    },
    syncPath: function() {
        var models = this.paths.toJSON();
        var markup = this.pathTemplate({
            models: models
        });
        this.$path.html(markup);
    }
});
// 已选用户视图
var UserItemView = Backbone.View.extend({
    template: Yiqi.renders.userItemTmpl,
    mode: 'view',
    name: 'user',
    className: 'item-user',
    events: {
        'click [data-do="remove"]': 'doRemove'
    },
    id: function() {
        return this.cid;
    },
    initialize: function(options) {
        options || (options = {});
        _.extend(this, _.pick(options, ['mode', 'name']));

        this.listenTo(this.model, 'remove', this.remove);
    },
    render: function() {
        var model = this.model.toJSON();
        var markup = this.template({
            mode: this.mode,
            name: this.name,
            model: model
        });
        this.$el.html(markup);
        return this;
    },
    doRemove: function() {
        this.model.collection.remove(this.model);
    }
});
var AssigneeItemView = UserItemView.extend({
    template: Yiqi.renders.assigneeItemTmpl
});
var TaskUserItemView = UserItemView.extend({
    template: Yiqi.renders.taskUserItemTmpl
});
// 用户选择器
var UserSelector = Backbone.View.extend({
    _active: false,
    itemView: UserItemView,
    mode: 'm',
    template: Yiqi.renders.userSelectorTmpl,
    range: null,
    events: {
        'click [data-do="pick"]': 'doPick'
    },
    initialize: function(options) {
        options || (options = {});
        _.extend(this, _.pick(options, ['mode', 'name', 'itemView', 'range']));

        this.listenTo(this.collection, 'reset', this.onReset);
    },
    doPick: function() {
        if (this._active) return;
        this._active = true;

        var selected = this.collection.pluck('dataId');
        var model = new Backbone.Model({
            path: ['c_' + COMPANY_ID], // 默认，不修改
            selected: this.collection.toJSON() // 已选用户的id
        });

        var popup = new UserPickerPopupView({
            title: '选择人员',
            source: this.range,
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.contactsTmpl,
            model: model,
            mode: this.mode
        });
        Yiqi.popup(popup.el, popup.removeOnClose);

        var _this = this;
        popup.on('select', function(selection) {
            _this.collection.reset(selection);
        });

        popup.on('closed', function(event, popup) {
            _this._active = false;
        });
    },
    onReset: function(collection, options) {
        var previousModels = options.previousModels;
        _.each(previousModels, function(model) {
            model.trigger('remove');
        });

        var views = [];
        this.collection.each(function(model) {
            var view = new this.itemView({
                name: this.name,
                model: model,
                mode: 'edit'
            });
            views.push(view.render().el);
        }, this);
        this.$el.append(views);
    },
    render: function() {
        var models = this.collection.toJSON();
        var markup = this.template({
            models: models
        });
        this.$el.html(markup);

        return this;
    }
});