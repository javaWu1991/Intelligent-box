function time2obj(attrs) {
    _.each(attrs, function(attr) {
        var obj = moment(this.get(attr), 'x');
        if (obj.isValid()) this.set(attr + 'Obj', obj);
    }, this);
}

function value2Text(value, map, defaults) {
    if (_.isObject(map)) {
        var text = map[value];
        if (!_.isUndefined(text)) return text;
    }

    if (_.isString(defaults)) {
        return defaults;
    }
}

var valueMap = {
    project: {
        type: {
            1: '综合支撑',
            2: '园区管理',
            3: '工程建设',
            4: '采购事项',
            5: '其它'
        },
        status: {
            1: '已归档'
        }
    },
    check: {
        status: {
            0: '未开始',
            1: '进行中 ',
            2: '已完成',
            3: '已超时'
        }
    },
    milestone: {
        status: {
            0: '进行中',
            1: '已完成',
            2: '已超时'
        }
    }
}

var MilestoneModel = Backbone.Model.extend({
    // id
    defaults: {
        createTime: null,
        endTime: null,
        message: '',
        pid: 0,
        remindStatus: null,
        remindTime: null,
        status: 0,
    },
    initialize: function() {
        this.initData();
    },
    initData: function() {
        time2obj.call(this, ['createTime', 'endTime']);

        this.set('statusText', value2Text(this.get('status'), MilestoneModel.status, '未知状态'));
    }
}, {
    status: {
        0: '进行中',
        1: '已完成',
        2: '已超时'
    },
    STATUS_IN_PROGRESS: 0, // 进行中
    STATUS_DONE: 1, // 完成，结果取决于 isPass
    STATUS_TIMEOUT: 2 // 超时
});

var PeopleModel = Backbone.Model.extend({
    // id
    defaults: {
        account: '',
        createTime: null,
        email: '',
        headUrl: null,
        isLeader: 0,
        job: '',
        jobId: null,
        jobLevel: null,
        mobile: '',
        name: '',
        orgId: null,
        orgName: null,
        sex: 0,
        shortNum: null,
        sort: 0,
        source: null,
        status: 1,
        uoid: null,
        updateTime: null
    },
    initialize: function() {
        time2obj.call(this, ['createTime', 'updateTime']);
    }
});

var PeopleCollection = Backbone.Collection.extend({
    model: PeopleModel
});

var MilestoneCollection = Backbone.Collection.extend({
    model: MilestoneModel
});

var ProjectModel = Backbone.Model.extend({
    // id
    defaults: {
        title: '',
        message: '',
        createTime: null,
        endTime: null,
        accessoryUrl: null,
        // 提醒
        appRemind: false,
        messageRemind: false,
        remindTime: null,
        remindStatus: 1, // 是否已处理提醒
        // 审批
        checkId: 0,
        checkPass: null, // 是否通过
        checkStatus: 0, // 0 未开始、1 进行中、2 已完成、3 已超时

        initiator: 0,
        initiatorName: '',
        mid: null,
        sponsors: [], // 主办
        supports: [], // 协办
        checkPeoples: [], // 审批人
        jobCreator: [], // 督办员（发任务）
        staffs: [], // 督办成员
        // 里程碑
        milestones: [],

        taskCount: 0,
        taskFinish: 0,
        taskIng: 0,
        taskTimeout: 0,
        progress: 0, // 百分比值

        type: null, // 1 综合支撑、2 园区管理、3 工程建设、4 采购事项、5 其他
        status: null // 1 归档
    },
    initialize: function() {
        this.initData();
    },
    initData: function() {
        time2obj.call(this, ['createTime', 'endTime', 'remindTime']);

        var status = this.get('status');
        var checkPass = this.get('checkPass');
        var checkStatus = this.get('checkStatus');
        var taskCount = this.get('taskCount');
        var taskFinish = this.get('taskFinish');
        var taskIng = this.get('taskIng');
        var taskTimeout = this.get('taskTimeout');

        taskIng = taskIng + taskTimeout;

        // 非归档
        var title = this.get('title');

        if (status != ProjectModel.STATUS_ARCVIVED) {
            if (checkStatus == CheckModel.STATUS_CLOSED) {
                // 起草
                status = ProjectModel.STATUS_DRAFT;
            } else if (checkStatus == CheckModel.STATUS_IN_PROGRESS || checkStatus == CheckModel.STATUS_TIMEOUT || (checkStatus == CheckModel.STATUS_DONE && checkPass === false)) {
                // 审批
                status = ProjectModel.STATUS_CHECKING;
            } else if (checkStatus == CheckModel.STATUS_DONE && checkPass === true && taskCount == 0) {
                // 发布
                status = ProjectModel.STATUS_DIST;
            } else if (taskCount > 0 && taskIng > 0) {
                // 执行
                status = ProjectModel.STATUS_IN_PROGRESS;
            } else if (taskCount > 0 && taskFinish == taskCount) {
                // 完成
                status = ProjectModel.STATUS_DONE;
            }
            this.set('status', status);
        }
        var statusText = value2Text(status, ProjectModel.status, '未知');

        var checkStatusText = value2Text(checkStatus, CheckModel.status, '未知');
        if (checkPass === false) {
            checkStatusText = '审批驳回';
        }

        var typeText = value2Text(this.get('type'), ProjectModel.type, '其它');

        var milestones = this.get('milestones');
        if (_.isArray(milestones) && milestones.length > 0) {
            milestones = new MilestoneCollection(milestones);
            milestones = milestones.toJSON();
        } else {
            milestones = [];
        }

        var progress = taskCount > 0 ? Math.round(taskFinish * 100 / taskCount) : 0;
        if (progress > 100 || progress < 0) {
            progress = 0;
        }

        this.set({
            statusText: statusText,
            checkStatusText: checkStatusText,
            typeText: typeText,
            milestones: milestones,
            progress: progress
        }, {
            silent: true
        });
    }
}, {
    STATUS_ARCVIVED: 1, // 归档
    STATUS_DRAFT: 0, // 起草
    STATUS_CHECKING: 2, // 审批
    STATUS_DIST: 3, // 发布
    STATUS_IN_PROGRESS: 4, // 执行
    STATUS_DONE: 5, // 完成
    status: {
        0: '起草',
        2: '审批',
        3: '发布',
        4: '执行',
        5: '完成',
        1: '归档'
    },
    type: {
        1: '综合支撑',
        2: '园区管理',
        3: '工程建设',
        4: '采购事项',
        5: '其它'
    }
});

var CheckModel = Backbone.Model.extend({
    defaults: {
        title: '',
        message: '',
        code: '',
        initiator: '',

        pmid: 0,
        procInstId: 0,
        isPass: null,
        confidentialityLevel: 0,
        createTime: 0,
        endTime: 0,

        assigneeId: '',
        assigneeName: '',

        nextAssigneeId: '',
        nextAssigneeName: '',

        departmentId: 0,
        departmentName: '',

        type: 0 // 继承自督办的 type
    },
    initialize: function() {
        this.initData();
    },
    initData: function() {
        time2obj.call(this, ['createTime', 'endTime']);

        var levelText = value2Text(this.get('confidentialityLevel'), CheckModel.level, '');
        var typeText = value2Text(this.get('type'), ProjectModel.type, '');

        this.set({
            confidentialityLevelText: levelText,
            assigneeNameShort: getShortName(this.get('assigneeName')),
            $assigneeColor: '#' + str2color(this.get('assigneeName')),
            typeText: typeText,
            nextAssigneeNameShort: getShortName(this.get('nextAssigneeName')),
            $nextAssigneeColor: '#' + str2color(this.get('nextAssigneeName'))
        }, {
            silent: true
        });
    }
}, {
    status: {
        0: '未开始',
        1: '进行中 ',
        2: '已完成',
        3: '已超时'
    },
    level: {
        0: '无密级',
        1: '内部消息',
        2: '普通商密',
        3: '核心商密'
    },
    STATUS_CLOSED: 0, // 未开始
    STATUS_IN_PROGRESS: 1, // 进行中
    STATUS_DONE: 2, // 完成，结果取决于 isPass
    STATUS_TIMEOUT: 3 // 超时
});

var TaskModel = Backbone.Model.extend({
    defaults: {
        title: '',
        message: '',
        initiator: '',
        initiatorName: '',
        assigned: '',
        assignedName: '',
        createTime: 0,
        endTime: 0,
        file: '',
        isUrgency: 0,
        isMessage: 0,
        status: '',
        pmId: 0,
        parentID: null,
        child: []
    },
    initialize: function() {
        time2obj.call(this, ['endTime', 'createTime']);

        this.set('statusText', value2Text(this.get('status'), TaskModel.status, '未知'));

        var name = this.get('assignedName');
        if (_.isString(name)) {
            name = getShortName(name);
            this.set('assignedNameShort', name);
        }

        var child = this.get('child');
        var assignedNameText = [];
        if (_.isArray(child) && child.length > 0) {
            _.each(child, function(item) {
                if (item.assignedName) {
                    assignedNameText.push(item.assignedName);
                }
            });
        }

        if (assignedNameText.length > 0) {
            this.set('assignedNameText', assignedNameText.join('，'));
        }
    }
}, {
    status: {
        '-1': '已超时',
        0: '进行中',
        1: '提交任务',
        10: '已完成',
        11: '进行中',
        2: '放弃任务',
        20: '已取消',
        21: '进行中'
    },
    STATUS_TIMEOUT: -1, // 已超时
    STATUS_IN_PROGRESS: 0, // 进行中，接收人：完成任务、分配任务、拒绝任务
    STATUS_IN_PROGRESS1: 11, // 进行中（验收失败），接收人：完成任务、分配任务、拒绝任务
    STATUS_IN_PROGRESS2: 21, // 进行中（不允许放弃），接收人：完成任务、分配任务、拒绝任务
    STATUS_CHECKING: 1, // 提交任务，发起人：验收任务、重新激活
    STATUS_ABORTING: 2, // 放弃任务，发起人：同意、拒绝
    STATUS_SUCCESS: 10, // *已完成
    STATUS_CANCELED: 20 // *已取消（允许放弃）
});

var MyStatus = Backbone.Model.extend({
    defaults: {
        noFinishJobIsMy: 0,
        noFinishJobNotMy: 0,
        noFinishCheckIsMy: 0,
        noFinishCheckIsNotMy: 0
    }
});

var LocalStorage = Backbone.Model.extend({
    length: 0,
    getItem: function(key) {
        return this.get(key);
    },
    setItem: function(key, value) {
        this.set(key, value);
        this._updateLength();
    },
    removeItem: function(key) {
        this.unset(key);
        this._updateLength();
    },
    toLocaleString: function() {
        return "[object Storage]";
    },
    _updateLength: function() {
        this.length = this.keys().length;
    }
});