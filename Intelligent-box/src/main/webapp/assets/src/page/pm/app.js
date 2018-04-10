var device = Framework7.prototype.device;
$.ajaxSetup({
    cache: false
});

/*
 * 初始化应用
 *
 * 通过全局变量 Yiqi 引用
 */
var Yiqi = new Framework7({
    swipeout: false,
    precompileTemplates: true,
    // modal 设置
    animatePages: !device.android,
    modalTitle: '',
    modalButtonOk: '确认',
    modalButtonCancel: '取消',
    modalPreloaderTitle: '加载中...'
});

_.extend(Yiqi, {
    renders: {},
    AppUser: new Backbone.Model,
    pageData: new Backbone.Model,
    modalCount: 0,
    start: function() {
        // 每次进入应用清空缓存
        if (localStorage) {
            localStorage.removeItem('contacts');
        } else {
            localStorage = new LocalStorage();
        }
        // page
        $(document).on('pageBeforeInit', appPage);
        $(document).on('pageReinit', appPage);
        // popup
        $(document).on('click', '.create-popup', appPopup);
        $(document).on('open', '.popup', function() {
            Yiqi.modalCount++;
        });
        $(document).on('close', '.popup', function() {
            Yiqi.modalCount--;
        });
        // alert
        $(document).on('click', '[data-alert]', appAlert);
        // action
        $(document).on('click', '[data-action]', appAction);
        // action sheet
        $(document).on('click', '.ac-project', acProject);
        $(document).on('click', '.ac-task', acTask);
        // 初始化首页
        initCartoon();
        indexPage();
    },
    toastError: function(message) {
        this.toast(message || '操作失败', '<i class="iconfont">&#xe60d;</i>').show();
    },
    toastWarning: function(message) {
        this.toast(message, '<i class="iconfont">&#xe60b;</i>').show();
    },
    toastSuccess: function(message) {
        this.toast(message || '操作成功', '<i class="iconfont">&#xe605;</i>').show();
    }
});

Yiqi.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true,
    url: '#index',
    preroute: function(view, options) {
        return true;
    }
});


/*
 * 初始化模板
 *
 * 编译当前应用用到模板，存放在 Yiqi.renders 下
 */
! function() {
    var options = {
        evaluate: /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape: /\{\{([^\}]+?)\}\}(?!\})/g
    };

    $('script[type="text/template"]').each(function() {
        var id = $(this).attr('id');
        if (!id) return;

        Yiqi.renders[id] = _.template($(this).html(), options);
    });
}();

/*
 * 初始化当前用户
 *
 * MOBILE 和 COMPANY_ID 由请求参数提供
 */
! function(mobile, companyId) {
    $.ajax({
        url: CONTEXT_PATH + '/api/users/userinfo/' + mobile + '/' + companyId,
        dataType: 'json',
        success: function(resp) {
            resp = _.extend({
                success: false
            }, resp);

            if (resp.success) {
                Yiqi.AppUser.set(resp.model);
                UID = Yiqi.AppUser.get('id');
                Yiqi.start();
            } else {
                var content = '<div class="content-block"><p class="">无法获取用户信息</p></div>';
                $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
            }
        }
    });
}(MOBILE, COMPANY_ID);

function appPage(event) {
    var page = event.detail.page;
    var name = page.name;
    switch (name) {
        case 'index':
            indexPage(page);
            break;
        case 'project-check':
        case 'check':
            checkPage(page);
            break;
        case 'mycheck':
            myCheckPage(page);
            break;
        case 'mytask':
            myTaskPage(page);
            break;
        case 'mytask-warning':
            myWarningTaskPage(page);
            break;
        case 'project':
            projectPage(page);
            break;
        case 'project-detail':
            projectDetailPage(page);
            break;
        case 'project-tasktree':
            projectTaskTreePage(page);
            break;
        case 'project-milestone':
            projectMilestonePage(page);
            break;
        case 'project-task':
            projectTaskPage(page);
            break;
        case 'task':
            taskPage(page);
            break;
        case 'task-detail':
            taskDetailPage(page);
            break;
        case 'task-handle':
            taskHandlePage(page);
            break;
        default:
            break;
    }
}

function appPopup() {
    var page = Yiqi.mainView.activePage;
    var query = page.query;
    var popup = $(this).data('popup');
    switch (popup) {
        case 'check-input':
            checkInputPopup(page);
            break;
        case 'check-next':
            checkNextPopup(page);
            break;
        case 'check-done':
            checkDonePopup(page);
            break;
        case 'check-reject':
            checkRejectPopup(page);
            break;
        case 'check-resubmit':
            checkReSubmitPopup(page);
            break;
        case 'task-input':
            taskInputPopup(page);
            break;
        case 'task-done':
            taskDonePopup(page);
            break;
        case 'task-check-done':
            taskCheckDonePopup(page);
            break;
        case 'task-reject-done':
            taskRejectDonePopup(page);
            break;
        case 'task-allow-abort':
            taskAllowAbortPopup(page);
            break;
        case 'task-reject-abort':
            taskRejectAbortPopup(page);
            break;
        case 'task-remind':
            taskRemindPopup(page);
            break;
        case 'project-input':
            projectInputPopup(page);
            break;
        default:
            break;
    }
}

function acProject() {
    var project = Yiqi.pageData.get('project');
    var groups = [];
    if (project instanceof ProjectModel) {
        var checkStatus = project.get('checkStatus');
        var status = project.get('status');
        var buttons1 = [];
        if (checkStatus == CheckModel.STATUS_CLOSED && status != ProjectModel.STATUS_ARCVIVED) {
            buttons1.push({
                text: '编辑督办',
                onClick: projectEditPopup
            }, {
                text: '删除督办',
                onClick: projectDelete
            });
        }

        if (status == null || status != ProjectModel.STATUS_ARCVIVED) {
            buttons1.push({
                text: '归档督办',
                onClick: projectArchive
            });
        }

        groups.push(buttons1);

        if (buttons1.length == 0) {
            groups.push({
                text: '暂无相关操作',
                label: true
            });
        }
    }

    var buttons2 = [{
        text: '取消'
    }];

    groups.push(buttons2);
    Yiqi.actions(groups);
}

function acTask() {
    var buttons1 = [{
        text: '分配任务',
        onClick: taskAssign
    }, {
        text: '放弃任务',
        onClick: taskAbort
    }];
    var buttons2 = [{
        text: '取消'
    }];
    var groups = [buttons1, buttons2];
    Yiqi.actions(groups);
}

// data-action
function appAction(event) {
    var page = Yiqi.mainView.activePage;
    var action = $(this).data('action');
    if (action == 'check-cancel') {
        checkCancel(page);
    } else if (action == 'mytask-o') {
        $('[data-popover=".popover-mytask"]').html('我发起的任务<i class="iconfont">&#xe611;</i>');
    } else if (action == 'mytask-p') {
        $('[data-popover=".popover-mytask"]').html('我参与的任务<i class="iconfont">&#xe611;</i>');
    } else if (action == 'load-mytask') {
        Yiqi.cartoon.toggleBubble();
        Yiqi.mainView.router.load({
            url: 'mytask.htm'
        });
    } else if (action == 'load-mycheck') {
        Yiqi.cartoon.toggleBubble();
        Yiqi.mainView.router.load({
            url: 'mycheck.htm'
        });
    } else if (action == 'load-myremind') {
        Yiqi.cartoon.toggleBubble();
        Yiqi.mainView.router.load({
            url: 'mytask-all.htm' // 应该为 myremind.htm
        });
        Yiqi.cartoon.clearTip();
    } else if (action == 'index-filter') {
        var $target = $(event.target);
        if ($target.hasClass('active')) return;

        $('#index-filter').find('.active').removeClass('active');
        $target.addClass('active');

        var value = $target.data('value');

        Backbone.trigger('index:filter', value);
    } else if (action == 'milestone-done') {
        milestoneDone(page);
    } else if (action == 'resubmit') {
        projectEditPopup(true);
    }
}

var alertMap = {
    'check-required': '请先进行督办审批<br/>审批通过后才可以创建',
    'cap-required': '只有督办创建者才可以新建任务',
    'task-limit': '督办已经发起，请勿重复发起'
}

function appAlert() {
    var data = $(this).data();
    var mtype = data.alert;
    var toast = data.toast;
    if (message = alertMap[mtype]) {
        toast ? Yiqi.toastWarning(message) : Yiqi.alert(message);
    }
}

var CartoonView = Backbone.View.extend({
    id: 'cartoon',
    className: 'cartoon',
    _timer: null,
    _bubble: null,
    bubbleTemplate: Yiqi.renders.cartoonTmpl,
    events: {
        'click': 'toggleBubble'
    },
    /*
     * 初始化，创建实例时会调用
     */
    initialize: function() {
        this.listenTo(this.model, 'change:remind', this.syncView);
        // setTimeout 回调函数里的 this 始终指向当前实例
        this.reset = _.bind(this.reset, this);
        this.hideBubble = _.bind(this.hideBubble, this);
    },
    /*
     * 响应变化
     */
    syncView: function(model, value, options) {
        if (value > 0) {
            this.alert();
        }
    },
    /*
     * 显示/隐藏动画的弹出框
     */
    toggleBubble: function() {
        if (this._bubble == null) {
            this.showBubble();
        } else {
            this.hideBubble();
        }
    },
    /*
     * 显示动画的弹出框
     */
    showBubble: function() {
        var markup = this.bubbleTemplate({
            model: this.model.toJSON()
        });
        var bubble = Yiqi.popover(markup, this.el);
        var _this = this;
        $(bubble).on('closed', function() {
            _this._bubble = null;
        });
        this._bubble = bubble;
    },
    /*
     * 显示动画的弹出框
     */
    hideBubble: function() {
        Yiqi.closeModal(this._bubble);
        this._bubble = null;
    },
    /*
     * 重置
     */
    reset: function() {
        this._timer && clearTimeout(this._timer);
        this.$el.attr('class', 'cartoon');
    },
    /*
     * 动画效果
     * @param type {string} 动画类型，alert 警告、iya 惩罚、yeah 奖励
     * @param duration {number} 动画时长
     * @parma cb {function} 动画播放结束后的回调函数
     */
    animate: function(type, duration, cb) {
        this._timer && clearTimeout(this._timer);
        var clsMap = {
            alert: 'cartoon tip',
            iya: 'cartoon iya',
            yeah: 'cartoon yeah'
        }
        var cls = clsMap[type];
        if (_.isString(cls)) {
            var visible = this._visible = this.$el.is(':visible');
            this.$el.attr('class', cls);

            if (!visible) {
                this.$el.css('z-index', 200000);
                this.show();
            }

            var _this = this;

            function reset() {
                _this.reset();
                _this.$el.css('z-index', 10000).toggle(visible);
                if (_.isFunction(cb)) {
                    cb.call(_this);
                }
            }
            this._timer = setTimeout(reset, duration);
        }
    },
    /*
     * 警告动画
     */
    alert: function(cb) {
        this.animate('alert', 3 * 1100, cb);
    },
    /*
     * 惩罚动画
     */
    iya: function(cb) {
        this.animate('iya', 3 * 600, cb);
    },
    /*
     * 奖励动画
     */
    yeah: function(cb) {
        this.animate('yeah', 4 * 1300, cb);
    },
    /*
     * 清除提示
     */
    clearTip: function() {
        var remindList = this.model.get('remindList');
        if (_.isArray(remindList)) {
            var ids = _.pluck(remindList, 'id');
            if (ids.length > 0) {
                $.ajax({
                    url: CONTEXT_PATH + '/web/pm/readRemind.do',
                    traditional: true,
                    context: this,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        id: ids
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            model: {}
                        }, resp);

                        if (resp.success) {
                            // 提醒都处理完毕,修改状态
                            this.model.set({
                                remind: 0,
                                remindList: [],
                                status: 1
                            });
                        }
                    }
                });
            }
        }
    },
    refresh: function() {
        this.model.fetch({
            parse: true,
            data: {
                uid: Yiqi.AppUser.get('id')
            }
        });
    },
    /*
     * 显示卡通形象
     */
    show: function() {
        this.$el.show();
    },
    /*
     * 隐藏卡通形象
     */
    hide: function() {
        this.$el.hide();
    },
    render: function() {
        return this;
    }
});

function initCartoon() {
    var model = new Backbone.Model({
        status: 1,
        job: 0,
        check: 0,
        remind: 0,
        remindList: []
    });
    _.extend(model, {
        url: CONTEXT_PATH + '/web/pm/statusData.do',
        parse: function(resp) {
            resp = _.extend({
                success: false,
                model: {}
            }, resp);

            var parsed = {
                check: 0,
                job: 0,
                remind: 0,
                remindList: [],
                status: 1
            }

            if (resp.success) parsed = resp.model;
            return parsed;
        }
    });
    Yiqi.cartoon = new CartoonView({
        model: model
    });
    Yiqi.cartoon.render().$el.appendTo(document.body);

    $(document).on('pageInit', function(event) {
        var page = event.detail.page;
        if (Yiqi.modalCount == 0) Yiqi.cartoon.hide();
    });

    $(document).on('pageReinit', function(event) {
        var page = event.detail.page;
        if (page.name == 'index') {
            Yiqi.cartoon.show();
        } else {
            Yiqi.cartoon.hide();
        }
    });
}

// page:首页
var ProjectItemView = Backbone.View.extend({
    tagName: 'li',
    template: Yiqi.renders.projectItemTmpl,
    initialize: function() {
        this.listenTo(this.model, 'change:$visible', this.toggle);
        this.listenTo(this.model, 'change', this.onChange);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'remove', this.remove);
    },
    toggle: function(model, value, options) {
        this.$el.toggle(this.model.get('$visible'));
    },
    onChange: function(model, options) {
        if (model.hasChanged('$visible') && _.size(model.changedAttributes()) == 1) return;
        this.render();
    },
    render: function() {
        var markup = this.template({
            model: this.model.toJSON()
        });
        this.$el.html(markup);
        return this;
    }
});

var IndexModel = Backbone.Model.extend({
    parse: function(resp) {
        resp = _.extend({
            success: false,
            message: '请求失败',
            model: {}
        }, resp);
        var parsed = {
            jobCount: 0,
            checkCount: 0,
            noFinishCheckIsMy: 0,
            noFinishCheckIsNotMy: 0,
            noFinishJobIsMy: 0,
            noFinishJobNotMy: 0,

            items: []
        }
        if (resp.success) {
            var model = resp.model;
            _.extend(parsed, _.pick(model, ['jobCount', 'checkCount', 'noFinishCheckIsMy', 'noFinishCheckIsNotMy', 'noFinishJobIsMy',
                'noFinishJobNotMy'
            ]));
            if (_.isArray(model.pmvos) && model.pmvos.length > 0) {
                var items = [];
                _.each(model.pmvos, function(model) {
                    model.createTimeText = parseTime(model.createTime, '', '-');

                    var checkPeoples = model.checkPeoples;
                    var checkPeopleText = '';
                    _.each(checkPeoples, function(item, index) {
                        checkPeoples[index] = item.name;
                    });
                    if (checkPeoples.length > 0) checkPeopleText = checkPeoples.join(',');
                    model.checkPeopleText = checkPeopleText;

                    var sponsors = model.sponsors;
                    if (_.isArray(sponsors) && sponsors.length > 0) {
                        model.sponsor = sponsors[0];
                    } else {
                        model.sponsor = (new PeopleModel()).toJSON();
                    }

                    model.progress = parseFloat(Math.round(model.taskFinish * 100 / model.taskCount), 10) || 0;

                    items.push(model);
                });

                parsed.items = items;
            }
        }
        return parsed;
    }
});

var IndexPage = Backbone.View.extend({
    rendered: false,
    template: Yiqi.renders.indexPageTmpl,
    statusTemplate: Yiqi.renders.indexStatusTmpl,
    searchResult: [],
    initialize: function() {
        this.listenTo(this.model, 'request', ajaxBeforeSend);
        this.listenTo(this.model, 'error', ajaxError);
        this.listenTo(this.model, 'sync', this.onSync);
        this.listenTo(this.model, 'change', this.onChange);

        this.listenTo(this.collection, 'reset', this.onReset);
        this.listenTo(this.collection, 'add', this.onAdd);
        // 类型筛选
        this.listenTo(Backbone, 'index:filter', this.onFilter);
    },
    render: function() {
        if (this.rendered) return;
        this.$el.html(this.template());
        this.cacheEls();

        this.initSearchbar();
        this.rendered = true;
        return this;
    },
    cacheEls: function() {
        this.$view1 = this.$('[role="view1"]');
        this.$view2 = this.$('[role="view2"]');

        this.$currentCount = this.$('.current-count');
        this.$archivedCount = this.$('.archived-count');

        this.$searchbar = this.$('[role="searchbar"]');
        this.$searchList = this.$('[role="search-list"]');
        this.$status = this.$('[role="status"]');
        this.$current = this.$('[role="current"]');
        this.$archived = this.$('[role="archived"]');
    },
    onChange: function(model) {
        var markup = this.statusTemplate({
            model: this.model.pick(['jobCount', 'checkCount', 'noFinishCheckIsMy', 'noFinishCheckIsNotMy', 'noFinishJobIsMy',
                'noFinishJobNotMy'
            ])
        });
        this.$status.html(markup);
    },
    onSync: function() {
        Yiqi.hidePreloader();
        var items = this.model.get('items');
        var nodata = items.length == 0;
        this.$view1.toggle(nodata);
        this.$view2.toggle(!nodata);
        this.$searchbar.toggle(!nodata);
        this.collection.reset(items);
        this.searchResult = this.collection.toArray();
    },
    onReset: function(collection, options) {
        this.$current.empty();
        this.$archived.empty();
        var currentCount = 0;
        var archivedCount = 0;
        if (collection.length > 0) {
            var current = [];
            var archived = [];
            collection.each(function(model, index) {
                model.set({
                    $visible: true,
                    $index: index
                });
                var itemView = new ProjectItemView({
                    model: model
                });

                var status = model.get('status');
                if (status == ProjectModel.STATUS_ARCVIVED) {
                    archived.push(itemView.render().el);
                } else {
                    current.push(itemView.render().el);
                }
            });

            currentCount = current.length;
            archivedCount = archived.length;

            this.$current.html(current);
            this.$archived.html(archived);
        }

        this.$currentCount.html('（' + currentCount + '）');
        this.$archivedCount.html('（' + archivedCount + '）');
    },
    load: function() {
        if (this.searchbar.active) this.searchbar.disable();
        this.model.fetch({
            parse: true,
            data: {
                assign: Yiqi.AppUser.get('id')
            }
        });
    },
    onSearchEnable: function() {
        this.inSearch = true;
    },
    onSearchDisable: function() {
        this.inSearch = false;
        this.collection.each(function(model) {
            model.set('$visible', true);
        });
    },
    onSearch: function(searchbar, options) {
        $('#index-filter').find('.active').removeClass('active');
        $('#index-filter').find('.item-link').eq(0).addClass('active');

        var query = options.query;
        var datas = [];
        this.searchResult = [];
        var currentCount = 0;
        var archivedCount = 0;
        this.collection.each(function(model) {
            var name = model.get('title');
            var status = model.get('status');
            var hit = name.indexOf(query) > -1;
            model.set('$visible', hit);
            if (hit) {
                if (status == ProjectModel.STATUS_ARCVIVED) archivedCount++;
                else currentCount++;
                this.searchResult.push(model);
            }
        }, this);

        this.$currentCount.html('（' + currentCount + '）');
        this.$archivedCount.html('（' + archivedCount + '）');
    },
    onFilter: function(value) {
        if (this.searchResult.length == 0) return;

        if (value == 0) {
            _.each(this.searchResult, function(model) {
                model.set('$visible', true);
            });
        } else {
            _.each(this.searchResult, function(model) {
                var type = model.get('type');
                model.set('$visible', type == value);
            });
        }
    },
    remove: function() {
        this.searchbar && this.searchbar.destroy();
        IndexPage.__super__.remove.call(this);
    },
    initSearchbar: function() {
        var page = this;
        this.searchbar = Yiqi.searchbar(this.$searchbar, {
            searchList: this.$searchList,
            customSearch: true,
            onEnable: _.bind(this.onSearchEnable, this),
            onDisable: _.bind(this.onSearchDisable, this),
            onSearch: _.bind(this.onSearch, this)
        });
    }
});

function getIndexPageView() {
    if (!IndexPage.instance) {
        var model = new IndexModel;
        model.url = CONTEXT_PATH + '/web/pm/indexData.do';
        IndexPage.instance = new IndexPage({
            el: Yiqi.mainView.activePage.container,
            model: model,
            collection: new Backbone.Collection(null, {
                model: ProjectModel
            })
        });
        IndexPage.instance.render();
    }
    return IndexPage.instance;
}

function indexPage() {
    // 刷新卡通的数据状态
    Yiqi.cartoon.model.fetch({
        parse: true,
        data: {
            uid: Yiqi.AppUser.get('id')
        }
    });

    var indexPageView = getIndexPageView();
    indexPageView.load();
}
// popup:督办-新建
function projectInputPopup() {
    var data = Yiqi.AppUser.pick('id', 'name', 'orgId', 'orgName');
    var model = new ProjectModel({
        initiator: data.id,
        initiatorName: data.name

        /*title: '督办' + moment().format('MM月DD日HH:mm:ss'),
        message: '督办内容' + moment().format('MM月DD日HH:mm:ss'),
        endTime: moment().add(10, 'days').format('x'),
        type: 1*/
    });
    var popup = new ProjectInputPopupView({
        title: '起草督办',
        removeOnClose: true,
        autoRender: true,
        template: Yiqi.renders.projectInputTmpl,
        model: model
    });
    Yiqi.popup(popup.el, popup.removeOnClose);
}
// page:督办-概况
function projectPage(page) {
    var query = page.query;
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/projectData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            var content = '';
            if (resp.success) {
                var task = resp.model.task;
                var project = new ProjectModel(resp.model.project);
                var initiator = project.get('initiator');
                var sponsors = project.get('sponsors');
                var capCreateCheck = initiator == UID || !_.isUndefined(_.findWhere(sponsors, {
                    id: UID
                }));
                content = Yiqi.renders.projectPageTmpl({
                    project: project.toJSON(),
                    task: task,
                    caps: {
                        createCheck: capCreateCheck
                    }
                });
                $(page.navbarInnerContainer).find('.center').html(project.get('title'));
                Yiqi.pageData.set('project', project);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的督办不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
        }
    });
}
/*
 * page:里程碑
 * @param id {int} 里程碑id
 */
function projectMilestonePage(page) {
    var project = Yiqi.pageData.get('project');
    var milestones = project.get('milestones');
    milestone = _.findWhere(milestones, {
        id: parseInt(page.query.id, 10)
    });
    var content = '';
    if (milestone) { // 权限：更新里程碑，角色：主办
        var capUpdateMilestone = !_.isUndefined(_.findWhere(project.get('sponsors'), {
            id: UID
        }));
        content = Yiqi.renders.projectMilestonePageTmpl({
            project: project.toJSON(),
            milestone: milestone,
            caps: {
                updateMilestone: capUpdateMilestone
            }
        });
        Yiqi.pageData.set('milestone', milestone);
    } else {
        content = '<div class="nodata">无里程碑数据</div>';
    }
    $(Yiqi.mainView.activePage.container).html(content);
}
/*
 * action:里程碑，标记为已完成，权限角色：主办
 * @param milestone {object} 里程碑对象
 */
function milestoneDone() {
    var model = Yiqi.pageData.get('milestone');
    if (model) {
        var message = '确定要将此里程碑标记为已完成，标记后不可修改？';
        Yiqi.confirm(message, '', function() {
            $.ajax({
                url: CONTEXT_PATH + '/web/pm/updatePmMilestone.do',
                type: 'post',
                dataType: 'json',
                data: {
                    id: model.id,
                    status: MilestoneModel.STATUS_DONE
                },
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
                        milestone.status = 1;
                        Yiqi.mainView.router.refreshPage();
                    } else {
                        Yiqi.toastWarning(resp.message);
                    }
                }
            });
        });
    }
}
// page:督办-任务树
function projectTaskTreePage(page) {
    var tasks = new Backbone.Collection;
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/projectTaskTreeData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: page.query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: []
            }, resp);
            var content = '<p class="nodata">暂无任务进度</p>';
            if (resp.success) {
                var taskList = resp.model;
                if (_.isArray(taskList) && taskList.length > 0) {
                    content = renderTask(taskList);
                    content = '<div class="task-tree clearfix">' + content + '</div>';

                }
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
            $('.task-tree').on('click', 'a', showTaskInfo);
        }
    });

    function showTaskInfo() {
        var id = $(this).data('id');
        var model = tasks.get(id);
        if (model) {
            var endTime = model.get('endTime');
            var endTimeText = parseTime(endTime, 'YYYY年MM月DD日');
            model.set('endTimeText', endTimeText);
            var markup = Yiqi.renders.taskTooltip({
                model: model.toJSON()
            });
            Yiqi.popover(markup, this, true);
        }
    }

    function renderTask(list) {
        var child = list.child;
        var markup = [];
        _.each(list, function(item) {
            var child = item.child;
            var result = '';
            if (child.length > 0) result = renderTask(child);
            var status = item.status;
            markup.push('<li><a href="#" data-id="' + item.id + '" class="status' + status + '"><i class="icon"></i><span class="name">' + item.assignedName + '</span></a>' + result + '</li>');

            tasks.add(_.pick(item, ['id', 'title', 'assignedName', 'endTime']));
        });
        return '<ul>' + markup.join('') + '</ul>';
    }
}
// page:督办-详情
function projectDetailPage(page) {
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/projectDetailData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: page.query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            var content = '';
            if (resp.success) {
                var project = resp.model;
                var models = project.sponsors;
                _.each(models, parsePeopleModel);
                models = project.supports;
                _.each(models, parsePeopleModel);
                models = project.checkPeoples;
                _.each(models, parsePeopleModel);
                models = project.jobCreator;
                _.each(models, parsePeopleModel);
                models = project.staffs;
                _.each(models, parsePeopleModel);
                project = new ProjectModel(project);
                var milestones = project.get('milestones');
                milestones = new MilestoneCollection(milestones);
                project.set('milestones', milestones.toJSON());

                content = Yiqi.renders.projectDetailPageTmpl({
                    project: project.toJSON()
                });

                var initiator = project.get('initiator');
                $(page.navbarInnerContainer).find('.ac-project').toggle(initiator == UID);

                // 用于编辑、存档时使用
                Yiqi.pageData.set('project', project);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的督办不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
        }
    });
}
// helper:解析用户数据
function parsePeopleModel(model) {
    var name = model.name;
    model.nameShort = getShortName(name);
    model.$color = '#' + str2color(name);
}
// popup:督办-编辑
function projectEditPopup(resubmit) {
    var model = Yiqi.pageData.get('project');
    if (model instanceof ProjectModel) {
        edit(model);
    } else {
        var query = Yiqi.mainView.activePage.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/projectDetailData.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                var content = '';
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                if (resp.success) {
                    edit(new ProjectModel(resp.model));
                } else {
                    Yiqi.toastWarning(resp.message);
                }
            }
        });
    }

    function edit(model) {
        var status = model.get('status');
        var checkStatus = model.get('checkStatus');
        if (status == ProjectModel.STATUS_ARCVIVED) {
            Yiqi.toastWarning('不能对已归档的督办进行编辑');
            return;
        }
        if (!resubmit && checkStatus != CheckModel.STATUS_CLOSED) {
            Yiqi.toastWarning('不能对审批中的督办进行编辑');
            return;
        }
        var attrs = {
                title: '编辑督办',
                removeOnClose: true,
                autoRender: true,
                template: Yiqi.renders.projectEditTmpl,
                model: model
            }
            // resubmit 有可能是其它数据
        var popup = resubmit === true ? new ProjectEditAndCheckPopupView(attrs) : new ProjectEditPopupView(attrs);
        Yiqi.popup(popup.el, popup.removeOnClose);
    }
}
// action:督办-存档
function projectArchive() {
    var model = Yiqi.pageData.get('project');
    if (model instanceof ProjectModel) {
        var status = model.get('status');
        if (status == ProjectModel.STATUS_ARCVIVED) {
            Yiqi.toastWarning('督办已归档');
        } else {
            Yiqi.confirm('督办归档后将无法对督办进行编辑操作。督办归档后在已归档督办里进行查看。确认归档？', '', function() {
                commonAction(CONTEXT_PATH + '/web/pm/archive.do', {
                    id: model.id
                });
            });
        }
    }
}
// action:督办-删除
function projectDelete() {
    var model = Yiqi.pageData.get('project');
    if (model instanceof ProjectModel) {
        Yiqi.confirm('确认删除当前督办？', function() {
            commonAction(CONTEXT_PATH + '/web/pm/deletePm.do', {
                id: model.id
            });
        });
    }
}
// helper:通用请求
function commonAction(url, data) {
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        beforeSend: ajaxCallback.beforeSend,
        error: ajaxCallback.error,
        success: ajaxCallback.success
    });
}
// popup:督办审批-新建
function checkInputPopup() {
    var model = Yiqi.pageData.get('project');
    if (model instanceof ProjectModel) {
        var data = Yiqi.AppUser.pick('id', 'name', 'orgName', 'orgId');
        data.pmid = model.id;
        data.type = model.get('type');
        data.endTime = model.get('endTime');
        data.title = model.get('title');
        data.message = model.get('message');
        data.milestones = model.get('milestones');
        data.checkPeoples = model.get('checkPeoples');
        data.jobCreator = model.get('jobCreator');
        model = new CheckModel({
            title: data.title,
            message: data.message,
            initiator: data.id,
            assigneeId: data.id,
            assigneeName: data.name,
            departmentName: data.orgName,
            departmentId: data.orgId,
            pmid: data.pmid,
            endTime: data.endTime,
            type: data.type,
            checkPeoples: data.checkPeoples,
            jobCreator: data.jobCreator,

            milestones: data.milestones
        });
        var popup = new CheckInputPopupView({
            title: '发起督办审批',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.checkInputTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }
}
// page:我的督办审批
function myCheckPage(page) {
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/queryMyCheck.do',
        type: 'get',
        dataType: 'json',
        data: {
            uid: UID
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: []
            }, resp);
            var content = '';
            if (resp.success) {
                var checkList = resp.model;
                var checkDone = [];
                var checkInpProgress = [];
                _.each(checkList, function(model) {
                    var status = model.state;
                    var statusText = CheckModel.status[status] || '未知状态';
                    model.statusText = statusText;

                    var endTimeObj = moment(model.endTime);
                    if (endTimeObj.isValid()) model.endTimeObj = endTimeObj;

                    if (status == CheckModel.STATUS_DONE || status == CheckModel.STATUS_TIMEOUT) {
                        checkDone.push(model);
                    } else {
                        checkInpProgress.push(model);
                    }
                });
                content = Yiqi.renders.myCheckPageTmpl({
                    checkList: checkList,
                    checkDone: checkDone,
                    checkInpProgress: checkInpProgress
                });
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
            var $tab = $(page.navbarInnerContainer).find('.subnavbar .active');
            if ($tab.length == 1) {
                Yiqi.showTab($tab.attr('href'));
            }
        }
    });
}
// page:我的督办审批-审批
function checkPage(page) {
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/checkData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: page.query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            var content = '';
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            if (resp.success) {
                var model = resp.model;
                var check = model.check;
                var project = model.project;
                model = new CheckModel(check);
                project = new ProjectModel(project);
                // 审批记录
                var checkVos = model.get('checkVos');
                _.each(checkVos, parseCheckLog);

                // 权限：取消审批，角色：主办人、发起人
                var capCancelCheck = project.get('initiator') == UID || !_.isUndefined(_.findWhere(project.get('sponsors'), {
                    id: UID
                }));

                // 权限：编辑重新提交，角色：主办人、发起人
                var capResubmit = capCancelCheck;

                // 权限：进行审批，角色：选择的审批人
                var capCheck = UID == model.get('nextAssigneeId');

                // 权限：发起督办，角色：督办员
                // 条件：
                // 1、通过审批
                // 2、任务数为 0，即未发起过督办
                var capCreateTask = !_.isUndefined(_.findWhere(project.get('jobCreator'), {
                    id: UID
                }));

                content = Yiqi.renders.checkPageTmpl({
                    project: project.toJSON(),
                    model: model.toJSON(),
                    caps: {
                        cancelCheck: capCancelCheck,
                        resubmit: capResubmit,
                        check: capCheck,
                        createTask: capCreateTask
                    }
                });
                Yiqi.pageData.set('project', project);
                Yiqi.pageData.set('check', model);
                Yiqi.pageData.set('model', project);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).html(content);
        }
    });
}
// helpder:解析审批记录
function parseCheckLog(model) {
    var checkTime = model.checkTime;
    checkTimeObj = moment(checkTime, 'x');
    if (checkTimeObj.isValid()) model.checkTimeObj = checkTimeObj;

    model.isPass = model.isPass + 0;

    var statusMap = {
        0: '驳回审批',
        1: '通过审批',
    };
    model.statusText = statusMap[model.isPass] || '-';

    model.nameShort = getShortName(model.assigneeName);
}
// popup:审批-重新提交
function checkReSubmitPopup() {
    function next(model) {
        var popup = new CheckReSubmitPopupView({
            title: '重新提交审批',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.checkReSubmitTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }
    var model = Yiqi.pageData.get('check');
    if (model instanceof CheckModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryCheckById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new CheckModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:审批-下一审批
function checkNextPopup(page) {
    function next(model) {
        var data = model.pick(['id', 'nextAssigneeId', 'nextAssigneeName', 'nextAssigneeNameShort', 'procInstId', 'pmid']);
        _.extend(data, Yiqi.AppUser.pick(['orgName', 'orgId']));

        var project = Yiqi.pageData.get('project');
        data.checkPeoples = project.get('checkPeoples');
        data.jobCreator = project.get('jobCreator');

        model = new CheckModel({
            id: data.id,
            pmid: data.pmid,
            procInstId: data.procInstId,
            assigneeId: data.nextAssigneeId,
            assigneeName: data.nextAssigneeName,
            assigneeNameShort: data.nextAssigneeNameShort,
            departmentName: data.orgName,
            departmentId: data.orgId,
            checkPeoples: data.checkPeoples,
            jobCreator: data.jobCreator,

            hasSuperior: 1,
            isPass: 1
        });

        var popup = new CheckNextPopupView({
            title: '下一审批',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.checkNextTmpl,
            model: model
        });

        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('check');
    if (model instanceof CheckModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryCheckById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new CheckModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:审批-完成
function checkDonePopup(page) {
    var model = Yiqi.pageData.get('check');
    if (model instanceof CheckModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryCheckById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new CheckModel(model);
                    next(model);
                }
            }
        });
    }

    function next(model) {
        var data = model.pick(['id', 'nextAssigneeId', 'nextAssigneeName', 'nextAssigneeNameShort', 'procInstId', 'pmid']);
        _.extend(data, Yiqi.AppUser.pick(['orgName', 'orgId']));

        model = new CheckModel({
            id: data.id,
            pmid: data.pmid,
            procInstId: data.procInstId,
            assigneeId: data.nextAssigneeId,
            assigneeName: data.nextAssigneeName,
            assigneeNameShort: data.nextAssigneeNameShort,
            departmentName: data.orgName,
            departmentId: data.orgId,
            // 无下一审批人
            nextAssigneeId: -1,
            nextAssigneeName: '',
            nextAssigneeNameShort: '',

            hasSuperior: 0,
            isPass: 1
        });
        var popup = new CheckDonePopupView({
            title: '审批意见',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.checkDoneTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }
}
// popup:审批-驳回
function checkRejectPopup(page) {
    function next(model) {
        var data = model.pick(['id', 'assigneeId', 'assigneeName', 'assigneeNameShort', 'departmentName', 'departmentId', 'nextAssigneeId', 'nextAssigneeName', 'nextAssigneeNameShort', 'procInstId', 'pmid']);

        model = new CheckModel({
            id: data.id,
            pmid: data.pmid,
            procInstId: data.procInstId,
            assigneeId: data.nextAssigneeId,
            assigneeName: data.nextAssigneeName,
            assigneeNameShort: data.nextAssigneeNameShort,
            departmentName: data.departmentName,
            departmentId: data.departmentId,
            // 无下一审批人
            nextAssigneeId: data.assigneeId,
            nextAssigneeName: data.assigneeName,
            nextAssigneeNameShort: data.assigneeNameShort,

            hasSuperior: 0,
            isPass: 0
        });
        var popup = new CheckRejectPopupView({
            title: '驳回意见',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.checkRejectTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('check');
    if (model instanceof CheckModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryCheckById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new CheckModel(model);
                    next(model);
                }
            }
        });
    }
}
// action:审批-取消
function checkCancel(page) {
    var model = Yiqi.pageData.get('check');
    if (model instanceof CheckModel) {
        var message = '确定取消当前审批？';
        Yiqi.confirm(message, '', function() {
            var data = model.pick(['id', 'assigneeId', 'assigneeName', 'procInstId', 'pmid']);

            data = {
                id: data.id,
                PMId: data.pmid,
                procInstId: data.procInstId,
                assigneeId: data.assigneeId,
                assigneeName: data.assigneeName,
                message: '',
                // 无下一审批人
                nextAssigneeId: -1,
                nextAssigneeName: '',
                isFinish: 1
            };

            $.ajax({
                url: CONTEXT_PATH + '/web/pm/editCheck.do',
                type: 'post',
                dataType: 'json',
                data: data,
                beforeSend: ajaxCallback.beforeSend,
                error: ajaxCallback.error,
                success: ajaxCallback.success
            });
        });
    }
}

// page:我的任务-列表
function myTaskPage(page, all) {
    var query = page.query;
    var data = {
        uid: Yiqi.AppUser.get('id')
    };
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/queryMyJob.do',
        type: 'get',
        dataType: 'json',
        data: data,
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            var content = '';
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            if (resp.success) {
                var taskList = resp.model;
                var taskDone = [];
                var taskInpProgress = [];

                taskList = new Backbone.Collection(taskList, {
                    model: TaskModel
                });

                taskList.each(function(model) {
                    var status = model.get('status');
                    if (status == TaskModel.STATUS_TIMEOUT || status == TaskModel.STATUS_SUCCESS || status == TaskModel.STATUS_CANCELED) {
                        taskDone.push(model.toJSON());
                    } else {
                        taskInpProgress.push(model.toJSON());
                    }
                });

                content = Yiqi.renders.myTaskPageTmpl({
                    taskList: taskList.toJSON(),
                    taskDone: taskDone,
                    taskInpProgress: taskInpProgress
                });

            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
            var $tab = $(page.navbarInnerContainer).find('.subnavbar .active');
            if ($tab.length == 1) {
                Yiqi.showTab($tab.attr('href'));
            }
        }
    });
}

function myWarningTaskPage(page) {
    var data = {
        isRemind: 1,
        assigned: Yiqi.AppUser.get('id')
    };
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/queryJob.do',
        type: 'get',
        dataType: 'json',
        data: data,
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            var content = '';
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            if (resp.success) {
                var taskList = resp.model;
                var taskDone = [];
                var taskInpProgress = [];
                var taskStatusMap = {
                    '-1': '已完成（超时）',
                    0: '进行中',
                    1: '验收中',
                    10: '已完成',
                    11: '进行中',
                    2: '进行中',
                    20: '已取消',
                    21: '进行中'
                };
                _.each(taskList, function(model) {
                    model.endTime = parseTime(model.endTime, '', '-');

                    var status = model.status;
                    var statusText = taskStatusMap[status] || '未知状态';
                    model.statusText = statusText;

                    var child = model.child;
                    var assignedName = [];
                    if (_.isArray(child) && child.length > 0) {
                        _.each(child, function(item) {
                            if (item.assignedName) {
                                assignedName.push(item.assignedName);
                            }
                        });
                    }
                    if (assignedName.length > 0) model.assignedName = assignedName.join('，');

                    if (status == -1 || status == 10 || status == 20) {
                        taskDone.push(model);
                    } else {
                        taskInpProgress.push(model);
                    }
                });
                content = Yiqi.renders.myTaskPageTmpl({
                    taskList: taskList,
                    taskDone: taskDone,
                    taskInpProgress: taskInpProgress
                });

            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).find('.page-content').html(content);
            var $tab = $(page.navbarInnerContainer).find('.subnavbar .active');
            if ($tab.length == 1) {
                Yiqi.showTab($tab.attr('href'));
            }
        }
    });
}

function projectTaskPage(page) {
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/taskData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: page.query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            var content = '';
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            if (resp.success) {
                var model = resp.model;
                var task = model.task;
                var project = model.project;
                task = new TaskModel(task);
                project = new ProjectModel(project);
                var status = task.get('status');

                if (status == TaskModel.STATUS_TIMEOUT) {
                    Yiqi.cartoon.iya();
                }

                var participating = false;
                var children = task.get('child');
                _.each(children, function(child, index) {
                    child = new TaskModel(child);
                    var assigned = child.get('assigned');
                    if (assigned == UID) participating = true;
                    children[index] = child.toJSON()
                });

                // 当前用户是否有参与该任务
                task.set('participating', participating);

                var assigned = task.get('assigned');
                var initiator = task.get('initiator');
                var child = task.get('child');
                if (assigned == UID && initiator != UID && child.length == 0 && (status == TaskModel.STATUS_IN_PROGRESS || status == TaskModel.STATUS_IN_PROGRESS1 || status == TaskModel.STATUS_IN_PROGRESS2)) {
                    $(page.navbarInnerContainer).find('.right').html('<a href="#" class="link ac-task"><i class="icon iconfont">&#xe614;</i></a>');
                }

                var parent = task.pick('id');
                var taskList = new Backbone.Collection(null, {
                    model: TaskModel
                });
                walkList(child, parent, function(model, parent, level) {
                    var data = _.pick(model, [
                        'id', 'initiator', 'initiatorName', 'assignedName', 'createTime', 'endTime', 'file', 'isUrgency', 'isMessage', 'status', 'pmId', 'parentID'
                    ]);

                    data.level = level;
                    taskList.add(data);
                }, 'child');

                content = Yiqi.renders.projectTaskPageTmpl({
                    project: project.toJSON(),
                    task: task.toJSON(),
                    collection: taskList.toJSON()
                });
                Yiqi.pageData.set('task', task);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).html(content);
        }
    });
}
// page:任务-详情
function taskPage(page) {
    var query = page.query;
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/taskData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            var content = '';
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            if (resp.success) {
                var model = resp.model;
                var project = model.project;
                var task = model.task;
                var logs = model.logs;
                task = new TaskModel(task);
                project = new ProjectModel(project);

                var status = task.get('status');
                if (status == TaskModel.STATUS_TIMEOUT) {
                    Yiqi.cartoon.iya();
                }


                // var participating = false;
                // var children = task.get('child');
                // _.each(children, function(child, index) {
                //     child = new TaskModel(child);
                //     var assigned = child.get('assigned');
                //     if (assigned == UID) participating = true;
                //     children[index] = child.toJSON()
                // });
                // task.set('participating', participating);

                var assigned = task.get('assigned');
                var initiator = task.get('initiator');
                var child = task.get('child');
                if (assigned == UID && initiator != UID && child.length == 0 && (status == TaskModel.STATUS_IN_PROGRESS || status == TaskModel.STATUS_IN_PROGRESS1 || status == TaskModel.STATUS_IN_PROGRESS2)) {
                    $(page.navbarInnerContainer).find('.right').html('<a href="#" class="link ac-task"><i class="icon iconfont">&#xe614;</i></a>');
                }

                var parent = task.pick('id');
                var taskList = new Backbone.Collection(null, {
                    model: TaskModel
                });
                // walkList(list, parent, func, key) {
                walkList(child, parent, function(model, parent, level) {
                    var data = _.pick(model, [
                        'id', 'initiator', 'initiatorName', 'assignedName', 'createTime', 'endTime', 'file', 'isUrgency', 'isMessage', 'status', 'pmId', 'parentID'
                    ]);

                    data.level = level;
                    taskList.add(data);
                }, 'child');

                _.each(logs, function(log) {
                    var createTimeObj = moment(log.createTime);
                    if (createTimeObj.isValid()) log.createTimeObj = createTimeObj;

                    var name = log.uName;
                    var color = '#' + str2color(name);
                    log.nameShort = getShortName(name);
                    log.$color = color;
                });

                content = Yiqi.renders.taskPageTmpl({
                    project: project.toJSON(),
                    task: task.toJSON(),
                    logs: logs,
                    taskList: taskList.toJSON()
                });
                Yiqi.pageData.set('task', task);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).html(content);
        }
    });
}
// page:任务-信息
function taskDetailPage(page) {
    var query = page.query;
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/queryJobById.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            var content = '';
            if (resp.success) {
                var model = resp.model;
                model = new TaskModel(model);

                content = Yiqi.renders.taskDetailPageTmpl({
                    model: model.toJSON()
                });

                Yiqi.pageData.set('task', model);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).html(content);
        }
    });
}
// page:任务-处理（验收、放弃）
function taskHandlePage(page) {
    var query = page.query;
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/taskData.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: query.id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            var content = '';
            if (resp.success) {
                var data = resp.model;
                var logs = data.logs;
                var taskData = data.task;
                var check = data.check;
                var model = new TaskModel(taskData);
                var capCheck = false;

                var status = model.get('status');
                var title = '';
                if (status == TaskModel.STATUS_CHECKING) {
                    $(page.navbarInnerContainer).find('.center').html('完成任务验收');
                } else if (status == TaskModel.STATUS_ABORTING) {
                    $(page.navbarInnerContainer).find('.center').html('放弃任务申请');
                }

                var initiator = model.get('initiator');
                capCheck = initiator == UID;

                if (!capCheck) {
                    if (_.isObject(check)) {
                        var checkVos = check.checkVos;
                        capCheck = _.indexOf(_.pluck(checkVos, 'assigneeId'), String(UID)) > -1;
                    }
                }

                _.each(logs, function(log) {
                    var createTimeObj = moment(log.createTime);
                    if (createTimeObj.isValid()) log.createTimeObj = createTimeObj;

                    var name = log.uName;
                    var color = '#' + str2color(name);
                    log.nameShort = getShortName(name);
                    log.$color = color;
                });

                content = Yiqi.renders.taskHandlePageTmpl({
                    model: model.toJSON(),
                    logs: logs,
                    capCheck: capCheck
                });

                Yiqi.pageData.set('task', model);
            } else {
                content = Yiqi.renders.noDataTmpl({
                    message: '你要查看的内容不存在'
                });
            }
            $(Yiqi.mainView.activePage.container).html(content);
        }
    });
}
// popup:任务-新建
function taskInputPopup() {
    var model = Yiqi.pageData.get('project');
    if (model instanceof Backbone.Model) {
        if (model instanceof ProjectModel) {
            var data = model.pick('id', 'endTime', 'title', 'message', 'sponsors', 'supports', 'milestones', 'type', 'typeText');
            var user = Yiqi.AppUser.pick('id', 'name', 'orgId', 'orgName');

            var models = data.sponsors;
            _.each(models, parsePeopleModel);
            data.sponsors = _.filter(models, function(model) {
                return model.id != UID;
            });

            models = data.supports;
            _.each(models, parsePeopleModel);
            data.supports = _.filter(models, function(model) {
                return model.id != UID;
            });

            model = new TaskModel({
                pmId: data.id,
                title: data.title,
                message: data.message,
                initiator: user.id,
                initiatorName: user.name,
                initiatorDepartmentId: user.orgId,
                initiatorDepartmentName: user.orgName,
                endTime: data.endTime,

                milestones: data.milestones,

                type: data.type,
                typeText: data.typeText,
                sponsors: data.sponsors,
                supports: data.supports
            });
            var popup = new TaskInputPopupView({
                title: '发起督办',
                removeOnClose: true,
                autoRender: true,
                template: Yiqi.renders.taskInputTmpl,
                model: model
            });
            Yiqi.popup(popup.el, popup.removeOnClose);
        } else if (model instanceof CheckModel) {
            pmId = model.get('pmid');
            endTime = model.get('endTime');
            title = model.get('title');
            message = model.get('message');
        }

    }
}
// popup:任务-完成
function taskDonePopup(page) {
    function next(model) {
        var popup = new TaskDonePopupView({
            title: '完成任务',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskDoneTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-验收完成
function taskCheckDonePopup(page) {
    function next(model) {
        var data = model.pick(['id', 'status']);
        var popup = new TaskCheckDonePopupView({
            title: '任务验收',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskCheckDoneTmpl,
            model: new Backbone.Model({
                id: data.id,
                status: 1
            })
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-重新激活
function taskRejectDonePopup(page) {
    function next(model) {
        var data = model.pick(['id', 'status']);
        var popup = new TaskRejectDonePopupView({
            title: '重新激活任务',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskRejectDoneTmpl,
            model: new Backbone.Model({
                id: data.id,
                status: TaskModel.STATUS_IN_PROGRESS1
            })
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-拒绝放弃申请
function taskRejectAbortPopup() {
    function next(model) {
        var data = model.pick(['id', 'status']);
        var popup = new TaskRejectAbortPopupView({
            title: '拒绝原因',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskRejectAbortTmpl,
            model: new Backbone.Model({
                id: data.id,
                status: TaskModel.STATUS_IN_PROGRESS2
            })
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-拒绝放弃申请
function taskAllowAbortPopup() {
    function next(model) {
        var data = model.pick(['id', 'status']);
        var popup = new TaskAllowAbortPopupView({
            title: '同意原因',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskAllowAbortTmpl,
            model: new Backbone.Model({
                id: data.id,
                status: TaskModel.STATUS_CANCELED
            })
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-分配
function taskAssign() {
    function next(model) {
        var data = model.pick(['id', 'status', 'title', 'message', 'endTime', 'pmId', 'isUrgency', 'isMessage']);
        var user = Yiqi.AppUser.pick('id', 'name');
        var model = new TaskModel({
            id: data.id,
            title: data.title,
            message: data.message,
            initiator: user.id,
            initiatorName: user.name,
            endTime: data.endTime,
            pmId: data.pmId,
            isUrgency: data.isUrgency,
            isMessage: data.isMessage
        });
        var popup = new TaskAssignPopupView({
            title: '分配任务',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskAssignTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-放弃
function taskAbort() {
    function next(model) {
        var data = model.pick(['id', 'status']);
        var popup = new TaskAbortPopupView({
            title: '放弃任务',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskAbortTmpl,
            model: new Backbone.Model({
                id: data.id,
                status: TaskModel.STATUS_ABORTING
            })
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}
// popup:任务-提醒
function taskRemindPopup() {
    function next(model) {
        var popup = new TaskRemindPopupView({
            title: '任务提醒',
            removeOnClose: true,
            autoRender: true,
            template: Yiqi.renders.taskRemindTmpl,
            model: model
        });
        Yiqi.popup(popup.el, popup.removeOnClose);
    }

    var model = Yiqi.pageData.get('task');
    if (model instanceof TaskModel) {
        next(model);
    } else {
        var query = page.query;
        $.ajax({
            url: CONTEXT_PATH + '/web/pm/queryJobById.do',
            type: 'get',
            dataType: 'json',
            data: {
                id: query.id
            },
            beforeSend: ajaxBeforeSend,
            error: ajaxError,
            success: function(resp) {
                Yiqi.hidePreloader();
                resp = _.extend({
                    success: false,
                    message: '请求失败',
                    model: {}
                }, resp);
                var content = '';
                if (resp.success) {
                    var model = resp.model;
                    model = new TaskModel(model);
                    next(model);
                }
            }
        });
    }
}

function getCheckById(id) {
    $.ajax({
        url: CONTEXT_PATH + '/web/pm/queryCheckById.do',
        type: 'get',
        dataType: 'json',
        data: {
            id: id
        },
        beforeSend: ajaxBeforeSend,
        error: ajaxError,
        success: function(resp) {
            Yiqi.hidePreloader();
            resp = _.extend({
                success: false,
                message: '请求失败',
                model: {}
            }, resp);
            var content = '';
            if (resp.success) {
                var model = resp.model;
                model = new CheckModel(model);
                next(model);
            }
        }
    });
}