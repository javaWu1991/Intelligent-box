'use strict';
define(function(require, exports) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('jquery-form');
    require('metisMenu');
    require('bootstrap');
    require('dep/echarts/echarts');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var template = require('template');
    var moment = require('moment');
    var Pager = require('component/Pager');
    var AreaPicker = require('component/AreaPicker');
    require('jquery-validate');
    Backbone.emulateHTTP = true;
    var STATUS_DISABLE = 0;
    var STATUS_ENABLE = 1;

    $.validator.addMethod('mobile', function(value, element) {
        return this.optional(element) || value.length == 11 && (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i).test(value);
    });

    var Admin = Backbone.Model.extend({
        idAttribute: 'index',
        defaults: {
            id: 0,
            account: '',
            type: '管理员',
            name: '',
            cid: '',
            companyNo: '', // 公司编码
            companyName: '', // 公司名称
            mobile: '',
            status: STATUS_ENABLE
        },
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('status');
            var statusMap = {
                0: '禁用',
                1: '启用'
            };

            data._isNew = this.isNew();
            data.statusText = statusMap[state] || '未知状态';

            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        }
    }, {
        STATE_ENABLE: 1,
        STATE_DISABLE: 0
    });

    /*
     * 模型
     */
    var Company = Backbone.Model.extend({
        $selected: false,
        // ajax 请求的参数设置
        syncOptions: {
            wait: true,
            processData: true
        },
        // 成员属性
        defaults: {
            name: '',
            logo: '',
            createTime: '',
            status: 1,
            code: '',
            scale: '',
            area: 0,
            contacts: '',
            contactsMobile: '',
            account: '' // 管理员手机号
        },
        /*
         * 数据处理，用于界面显示
         */
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('status');
            var createTime = this.get('create_time');
            var statusMap = {
                0: '禁用',
                1: '启用',
                2: '待审核'
            };

            createTime = moment(parseInt(createTime, 10));
            var createTimeText = createTime.isValid() ? createTime.format('YYYY-MM-DD HH:mm:ss') : '';
            data._isNew = this.isNew();
            data.statusText = statusMap[state] || '未知状态';
            data.createTimeText = createTimeText;

            return data;
        },
        /*
         * 删除 delete
         */
        destroy: function(options) {
            Company.__super__.destroy.call(this, _.extend({
                url: CONTEXT_PATH + '/web/company/deleteCompany.do',
                data: {
                    companyId: this.id
                }
            }, this.syncOptions, options));
        },
        /*
         * 保存 insert/update
         */
        save: function(attrs, options) {
            Company.__super__.save.call(this, attrs, _.extend({}, this.syncOptions, options));
        },
        /*
         * 状态设置 update
         */
        toggleStatus: function() {
            var status = this.get('status');
            if (status == 0) {
                status = 1;
            } else if (status == 1) {
                status = 0;
            }

            this.save(null, {
                url: CONTEXT_PATH + '/web/company/updateCompanyState.do',
                type: 'post',
                context: this,
                data: {
                    companyId: this.id,
                    state: status
                },
                success: function(model, resp, options) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);

                    if (resp.success) {
                        this.set('status', status);
                        alert('操作成功').delay(1);
                    } else {
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
            });
        },
        toggleSelect: function(selected) {
            this.$selected = _.isBoolean(selected) ? selected : !this.$selected;
            this.trigger('toggle:select', this.$selected, this);
        }
    }, {
        STATE_ENABLE: 1,
        STATE_DISABLE: 0,
        STATE_PENDING: 2
    });

    /*
     * 新建 - 企业
     */
    var companyCreateModalRender = template($('#tmpl-companyCreateModal').html());
    var CompanyCreateModal = FormModal.extend({
        template: companyCreateModalRender,
        initMap: initMap,
        initForm: initForm,
        submit: function(event) {
            var $target = $(event.target)
            if (this.$form.valid()) {
                var areaData = this.areaPicker.getSelection();

                var p = areaData[0];
                var c = areaData[1];
                var a = areaData[2];

                var params = {
                    areaId: a.id,
                    areaName: a.name,
                    cityId: c.id,
                    cityName: c.name,
                    provinceId: p.id,
                    provinceName: p.name
                };

                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/company/addCompany.do',
                    context: this,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    data: params,
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
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
            this.map.clearOverlays();
            delete this.map;
            CompanyCreateModal.__super__.remove.call(this);
        },
        initAreaPicker: function() {
            this.areaPicker = new AreaPicker({
                el: this.$('.area-picker')
            });
        }
    });
    /*
     * 编辑 - 企业
     */
    var companyEditModalRender = template($('#tmpl-companyEditModal').html());
    var CompanyEditModal = FormModal.extend({
        template: companyEditModalRender,
        initMap: initMap,
        initForm: initForm,
        submit: function(event) {
            var $target = $(event.target);
            if (this.$form.valid()) {
                var data = this.$form.serializeObject();
                var areaData = this.areaPicker.getSelection();

                var p = areaData[0];
                var c = areaData[1];
                var a = areaData[2];

                var params = {
                    areaId: a.id,
                    areaName: a.name,
                    cityId: c.id,
                    cityName: c.name,
                    provinceId: p.id,
                    provinceName: p.name
                };

                this.$form.ajaxSubmit({
                    url: CONTEXT_PATH + '/web/company/updateCompany.do',
                    context: this,
                    data: params,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);

                        if (resp.success) {
                            // this.model.set(data);
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
            this.map.clearOverlays();
            delete this.map;
            CompanyEditModal.__super__.remove.call(this);
        },
        initAreaPicker: function() {
            var p = this.model.get('provinceId');
            var c = this.model.get('cityId');
            var a = this.model.get('areaId');
            this.areaPicker = new AreaPicker({
                el: this.$('.area-picker'),
                selected: [p, c, a]
            });
        }
    });

    var setManagerRender = template($('#tmpl-setManagerModal').html());
    var SetManagerModal = FormModal.extend({
        template: setManagerRender,
        events: {
            'click [data-do="cancelSet"]': 'cancelSet',
            'click [data-do="submit"]': 'submit',
        },
        cancelSet: function(event) {
            var managerId = $.trim(this.model.get('managerId'));
            if (managerId == '') return false;

            var $target = $(event.target);
            var data = {
                cid: this.model.id
            }
            $.ajax({
                url: CONTEXT_PATH + '/web/system/deleteCustomerManager.do',
                data: data,
                context: this,
                beforeSend: function() {
                    $target.prop('disabled', true);
                },
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
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
        },
        submit: function(event) {
            var params = this.$form.serializeObject();
            if (_.isString(params.account)) {
                var $target = $(event.target);
                $.ajax({
                    url: CONTEXT_PATH + '/web/system/setCustomerManager.do',
                    type: 'post',
                    dataType: 'json',
                    data: params,
                    context: this,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
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
        initDatatable: function() {
            var list = new Backbone.Collection(null, {
                model: Admin
            });
            _.extend(list, {
                url: CONTEXT_PATH + '/web/customer/listCustomer.do',
                parse: function(resp) {
                    var parsed = _.extend({
                        success: false,
                        model: []
                    }, resp);
                    var items = _.isArray(parsed.model) ? parsed.model : [];
                    return items;
                },
                refresh: function(options) {
                    options = _.extend({
                        parse: true,
                        reset: true
                    }, options);

                    this.fetch(options);
                },
                getSelection: function() {
                    return this.filter(function(model) {
                        return model.$selected;
                    });
                }
            });

            var table = new CustomManagerDataTable({
                el: this.$('.datatable'),
                collection: list,
                model: this.model
            });

            var pager = new Pager({
                className: 'pagination pull-right'
            });

            pager.listenTo(list, 'sync', function(collection, resp, options) {
                if (collection instanceof Backbone.Collection) {
                    var pageVo = resp.pageVo;
                    if (_.isObject(pageVo)) {
                        var attrs = _.pick(pageVo, 'pageNo', 'pageSize', 'totalCount');
                        attrs.totalPages = pageVo.pageTotal;
                        this.update(attrs);
                    } else {
                        this.$el.empty();
                    }
                }
            });

            list.listenTo(pager, 'page', function(pageNo) {
                this.fetch({
                    parse: true,
                    reset: true,
                    data: {
                        pageNo: pageNo
                    }
                });
            });

            this.$('.toolbar-bottom').append(pager.render().$el);

            list.fetch({
                reset: true,
                parse: true
            });

            this.table = table;
            this.page = pager;
        }
    });

    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-customerManagerItem').html());
    var ItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click :radio': 'toggleChecked'
        },
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
    var CustomManagerDataTable = Backbone.View.extend({
        noDataRender: template('<tr><td colspan="{{count}}">暂无数据</td></tr>'),
        loadingRender: template('<tr><td colspan="{{count}}">数据加载中...</td></tr>'),
        initialize: function() {
            this.cacheEls();

            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'request', this.request);
            this.listenTo(this.collection, 'sync', this.sync);
            this.listenTo(this.collection, 'error', this.error);
            this.listenTo(this.collection, 'destroy', this.refresh);
        },
        addOne: function(model, collection, options) {
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
                    count: this.colCount
                }));
            } else {
                var selected = this.model.get('managerId');
                collection.each(function(model, index) {
                    var account = model.get('account');
                    model.set({
                        index: index + 1,
                        $index: index,
                        $checked: account == selected
                    });
                    this.addOne(model, collection);
                }, this);
            }
        },
        cacheEls: function() {
            this.$headers = this.$('[role="col-headers"]');
            this.colCount = this.$headers.children().length;

            this.$items = this.$('[role="items"]');
        },
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colCount
                });

                this.$items.empty().html(markup);
            }
        },
        refresh: function() {
            this.collection.refresh();
        }
    });

    function initMap() {
        var $lng = this.$('#inputLng');
        var $lat = this.$('#inputLat');
        var isNew = this.model.isNew();
        var autoLocation = isNew;
        var center = '杭州';
        var zoom = 15;
        var el = this.$('#loc').css({
            height: 300
        })[0];

        var map = new BMap.Map(el, {
            enableMapClick: false
        });
        map.enableScrollWheelZoom();

        var navCtrl = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_SMALL
        });

        if (!isNew) {
            var lng = $.trim(this.model.get('longitude'));
            var lat = $.trim(this.model.get('latitude'));
            if (lng == '' && lat == '') {
                autoLocation = true;
            } else {
                center = new BMap.Point(lng, lat);
            }
        }

        map.addEventListener('load', function() {
            if (isNew) {
                center = map.getCenter();
            }
            var marker = new BMap.Marker(center, {
                enableDragging: true
            });

            setLnglat({
                point: center
            });

            map.addOverlay(marker);
            map.addControl(navCtrl);

            marker.addEventListener('dragend', setLnglat);
            marker.addEventListener('dragging', setLnglat);

            if (autoLocation) {
                var city = new BMap.LocalCity();
                city.get(function(result) {
                    var point = result.center;
                    map.setCenter(result.name);
                    marker.setPosition(point);
                    setLnglat({
                        point: point
                    });
                });
            }

            map.addEventListener('click', function(event) {
                var point = event.point;
                marker.setPosition(point);
                setLnglat(event);
            });
        });

        map.centerAndZoom(center, zoom);

        this.map = map;

        function setLnglat(event) {
            var point = event.point;
            $lng.val(point.lng);
            $lat.val(point.lat);
        }
    }

    function initForm() {
        var options = {
            errorPlacement: function(error, element) {
                if (element.attr('name') == 'area') {
                    element.closest('.area-picker').after(error);
                } else {
                    element.after(error);
                }
            },
            rules: {
                name: {
                    required: true
                },
                area: {
                    required: true
                },
                logoFile: {
                    required: {
                        depends: function(element) {
                            var value = $.trim($(element).data('value'));
                            return value === '';
                        }
                    }
                },
                areaPicker: {
                    required: true
                },
                contactsMobile: {
                    mobile: true
                },
                account: {
                    mobile: true
                },
                scale: {
                    digits: true
                }
            },
            messages: {
                name: {
                    required: '必填项'
                },
                area: {
                    required: '必填项'
                },
                logoFile: {
                    required: '请上传LOGO'
                },
                contactsMobile: {
                    mobile: '格式不正确'
                },
                account: {
                    mobile: '格式不正确'
                },
                scale: {
                    digits: '请输入数字'
                }
            }
        }
        this.$form.validate(options);
    }

    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-companyItem').html());
    var CompanyItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click [data-do="edit"]': 'doEdit',
            'click [data-do="delete"]': 'doDelete',
            'click [data-do="disable"]': 'doDisable',
            'click [data-do="enable"]': 'doEnable',
            'click [data-do="setAdmin"]': 'doSetAdmin',
            'click [data-do="toggleOne"]': 'doToggleOne',
            'click [data-do="setManager"]': 'doSetManager'
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'toggle:select', this.syncToggle);
        },
        /*
         * 编辑 - UI 触发
         */
        doEdit: function() {
            Backbone.trigger('edit:company', this.model, this);
        },
        /*
         * 删除 - UI 触发
         */
        doDelete: function() {
            var model = this.model;
            confirm('确认删除？', function() {
                model.destroy();
            });
        },
        /*
         * 禁用 - UI 触发
         */
        doDisable: function() {
            this.model.toggleStatus();
        },
        /*
         * 启用 - UI 触发
         */
        doEnable: function() {
            this.model.toggleStatus();
        },
        doSetManager: function() {
            Backbone.trigger('set:manager', this.model, this);
        },
        doToggleOne: function(event) {
            var checked = $(event.target).prop('checked');
            this.model.$selected = checked;
            this.model.trigger('select:one', checked, this.model);
        },
        syncToggle: function(selected, model) {
            this.$toggleOne.prop('checked', selected);
        },
        render: function() {
            var markup = this.template({
                model: this.model.serialize()
            });
            this.$el.html(markup);
            this.$toggleOne = this.$('[data-do="toggleOne"]');
            return this;
        }
    });
    /* 批量操作 */
    var bulkActionRender = template($('#tmpl-bulkAction').html());
    var BulkAction = Backbone.View.extend({
        template: bulkActionRender,
        events: {
            'click [data-do="bulk:delete"]': 'doBulkDelete',
            'click [data-do="bulk:disable"]': 'doBulkDisable',
            'click [data-do="bulk:enable"]': 'doBulkEnable'
        },
        doBulkEnable: function() {
            this.trigger('bulk:enable');
        },
        doBulkDisable: function() {
            this.trigger('bulk:disable');
        },
        doBulkDelete: function() {
            this.trigger('bulk:delete');
        },
        render: function() {
            this.$el.html(this.template());
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
        events: {
            'change [data-do="toggleAll"]': 'doToggleAll'
        },
        initialize: function() {
            this.cacheEls();

            this.listenTo(this.collection, 'reset', this.reset);
            this.listenTo(this.collection, 'request', this.request);
            this.listenTo(this.collection, 'sync', this.sync);
            this.listenTo(this.collection, 'error', this.error);
            this.listenTo(this.collection, 'destroy', this.refresh);
            this.listenTo(this.collection, 'select:one', this.syncToggle);
        },
        /*
         * 添加一行
         */
        addOne: function(model) {
            var itemView = new CompanyItemView({
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
            this.$toggleAll = this.$('[data-do="toggleAll"]');
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
        },
        syncToggle: function(selected) {
            if (selected === false) {
                this.$toggleAll.prop('checked', false);
            } else {
                var length = this.collection.length;
                this.collection.each(function(model) {
                    if (model.$selected === true) length--;
                });

                this.$toggleAll.prop('checked', length === 0);
            }
        },
        doToggleAll: function(event) {
            var checked = $(event.target).prop('checked');
            this.collection.each(function(model) {
                model.$selected = checked;
                model.trigger('toggle:select', checked, model);
            });
        },
        bulkDelete: function() {
            var collection = this.collection;
            var selection = collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要删除的条目').delay(2);
            } else {
                confirm('确认删除所选条目？', function() {
                    var companyId = [];
                    _.each(selection, function(model) {
                        companyId.push(model.id);
                    });
                    $.ajax({
                        url: CONTEXT_PATH + '/web/company/deleteCompany.do',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            companyId: companyId.join(',')
                        },
                        success: function(resp) {
                            resp = _.extend({
                                success: false,
                                message: '操作失败'
                            }, resp);
                            if (resp.success) {
                                collection.trigger('destroy');
                                alert('操作成功');
                            } else {
                                alert(resp.message);
                            }
                        }
                    });
                });
            }
        },
        bulkEnable: function() {
            var selection = this.collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要操作的条目').delay(2);
            } else {
                this.bulkStatus(selection, Company.STATE_ENABLE);
            }
        },
        bulkDisable: function() {
            var selection = this.collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要操作的条目').delay(2);
            } else {
                this.bulkStatus(selection, Company.STATE_DISABLE);
            }
        },
        bulkStatus: function(selection, state) {
            var companyId = [];
            _.each(selection, function(model) {
                companyId.push(model.id);
            });
            $.ajax({
                url: CONTEXT_PATH + '/web/company/updateCompanyState.do',
                type: 'post',
                dataType: 'json',
                data: {
                    companyId: companyId.join(','),
                    state: state
                },
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);
                    if (resp.success) {
                        _.each(selection, function(model) {
                            model.set('status', state);
                        });
                        alert('操作成功');
                    } else {
                        alert(resp.message);
                    }
                }
            });
        }
    });

    function run() {
    	$('.table-bordered > tbody').on('mouseover',function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
        $('.primary-nav').metisMenu();

        // 数据集合
        var list = new Backbone.Collection(null, {
            model: Company
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/company/selectCompany.do',
            // 处理响应的数据，解析后返回
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);

                var model = parsed.model;

                model = _.extend({
                    list: []
                }, model);

                var items = _.isArray(model.list) ? model.list : [];
                return items;
            },
            refresh: function() {
                this.fetch({
                    parse: true,
                    reset: true
                });
            },
            getSelection: function() {
                return this.filter(function(model) {
                    return model.$selected;
                });
            }
        });
        // 表格视图对象，监听数据集合的变化进行视图的刷新
        var table = new DataTable({
            el: '#sole-table',
            collection: list
        });
        // 分页视图对象
        var pager = new Pager({
            className: 'pagination pull-right',
            collection: list
        });

        // 搜索表单
        var search = new SearchForm({
            el: '#search',
            collection: list
        });
        search.on('search', searchHandler);

        // 监听数据集合的异步请求，根据响应的结果刷新视图
        pager.listenTo(list, 'sync', function(collection, resp) {
            if (collection instanceof Backbone.Collection) {
                var pageVo = resp.model;
                if (_.isObject(pageVo)) {
                    var attrs = _.pick(pageVo, 'pageNum', 'pageSize', 'totalCount');
                    attrs.totalPages = pageVo.pages;
                    this.update(attrs);
                } else {
                    this.$el.empty();
                }
            }
        });
        pager.on('page', function(pageNo) {
            var data = search.serialize();
            _.extend(data, {
                pageNo: pageNo
            });

            searchHandler(data);
        });

        var bulkAction = new BulkAction({
            className: 'bulk-action pull-left'
        });

        table.listenTo(bulkAction, 'bulk:delete', table.bulkDelete);
        table.listenTo(bulkAction, 'bulk:enable', table.bulkEnable);
        table.listenTo(bulkAction, 'bulk:disable', table.bulkDisable);

        // 将分页视图渲染到界面上
        $('.toolbar-bottom').append(bulkAction.render().$el, pager.render().$el);

        var modal;
        $('[data-do="create:company"]').on('click', function() {
            modal = new CompanyCreateModal({
                model: new Company(),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            setTimeout(function() {
                modal.initMap();
            }, 500);
            modal.initForm();
            modal.initAreaPicker();
            modal.show();
        });

        Backbone.on('edit:company', function(model) {
            modal = new CompanyEditModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            setTimeout(function() {
                modal.initMap();
            }, 500);
            modal.initForm();
            modal.initAreaPicker();
            modal.show();
        });

        Backbone.on('set:manager', function(model) {
            modal = new SetManagerModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initDatatable();
            modal.show();
        });

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
                parse: true,
                reset: true,
                data: clean
            });
        }

        searchHandler();
    }


    exports.run = run;
});