define(function(require, exports, module) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('metisMenu');
    require('bootstrap');
    require('jquery-form');
    require('jquery-validate');
    var moment = require('moment');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var Model = require('component/Model');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var Pager = require('component/Pager');
    var template = require('template');
    Backbone.emulateHTTP = true;
    var STATUS_ENABLE = 1;
    var STATUS_DISABLE = 0;
    /*
     * 模型
     */
    var CompanyAdmin = Backbone.Model.extend({
        idAttribute: 'index',
        defaults: {
            id: 0,
            account: '',
            type: '企业管理员',
            name: '',
            cid: 0,
            companyNo: '', // 公司编码
            companyName: '', // 公司名称
            mobile: '',
            status: STATUS_ENABLE
        },
        serialize: function() {
            var data = this.toJSON();
            var state = this.get('status');
            var createTime = this.get('createTime');
            var statusMap = {
                0: '支付成功',
                1: '支付失败',
                2: '已退款',
                3: '预下单'
            };
            createTime = moment(parseInt(createTime, 10));
            var createTimeText = createTime.isValid() ? createTime.format('YYYY-MM-DD HH:mm:ss') : '';
            data._isNew = this.isNew();
            data.statusText = statusMap[state] || '未知状态';
            data.createTimeText = createTimeText;
            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        },
        destroy: function(options) {
            var data = this.pick('productId','price','orderCode');
            var money = this.pick('price');
            var orderCode = this.pick('orderCode') ;
            $.ajax({
                url: CONTEXT_PATH + '/web/boxWeb/refundAction.do',
                type: 'post',
                dataType: 'json',
                context: this,
                data: data,
                success: function(resp) {
                    resp = _.extend({
                        success: false,
                        message: '操作失败'
                    }, resp);

                    if (resp.success) {
                        alert('退款成功').delay(1);
                        location.reload();
                    } else {
                        alert(resp.message);
                    }
                },
                error: function() {
                    alert('操作失败');
                }
            });
        },    
    }, {
        STATE_ENABLE: 1,
        STATE_DISABLE: 0
    });
    /*
     * 数据行
     * 
     * 监听对象的 remove 和 change 事件更新视图
     */
    var itemRender = template($('#tmpl-item').html());
    var ItemView = Backbone.View.extend({
        tagName: 'tr',
        template: itemRender,
        events: {
            'click [data-do="delete"]': 'doDelete',
        },
        doDelete: function(event) {
            var model = this.model;
            var orderCode = this.model.get('orderCode');
            var txt = '确认退款订单号：' + orderCode +'？';
            confirm(txt, function() {
                model.destroy();
            });
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
                collection.each(function(model, index) {
                    model.set({
                        index: index + 1,
                        $index: index
                    });
                    this.addOne(model, collection);
                }, this);
            }
        },
        cacheEls: function() {
            this.$headers = this.$('[role="col-headers"]');
            this.colCount = this.$headers.children().length;

            this.$items = this.$('[role="items"]');
            this.$toggleAll = this.$('[data-do="toggleAll"]');
        },
  
 
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colCount
                });

                this.$items.empty().html(markup);
            }
        },
    
    

    
    });

    function run() {
        $('.table-bordered > tbody').on('mouseover', function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
        $('.primary-nav').metisMenu();

        var query = new Backbone.Model();
        if (CID != '') query.set('corpId', CID);
        query.set('pageNo',1);
        query.set('pageSize',20)
        var list = new Backbone.Collection(null, {
            model: CompanyAdmin
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/boxWeb/orderDetail.do',
            parse: function(resp) {
                var parsed = _.extend({
                    success: false,
                    model: []
                }, resp);
                var items = _.isArray(parsed.model) ? parsed.model : [];
                return items;
            },
            refresh: function(data) {
                var query = search.serialize();
                searchHandler(_.extend(query, data));
            },
            getSelection: function() {
                return this.filter(function(model) {
                    return model.$selected;
                });
            }
        });

        var table = new DataTable({
            el: '#sole-table',
            collection: list
        });

        // 搜索表单
        var search = new SearchForm({
            el: '#search',
            collection: list
        });
        search.on('search', function(data) {
            _.extend(data, query.toJSON());
            searchHandler(data);
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
        pager.on('page', function(pageNo) {
            var data = search.serialize();
            _.extend(data, {
                pageNo: pageNo
            });

            searchHandler(data);
        });

        function searchHandler(data) {
            var clean = query.toJSON();
            if(data != undefined){
            var startTime = data.startTime ;
            var endTime = data.endTime ;
            if(startTime!=""){
            startTime =  (new Date(startTime.replace(/-/g,'/'))).getTime(); 
            data.startTime = startTime;
            }
            if(endTime!=""){
                endTime =  (new Date(endTime.replace(/-/g,'/'))).valueOf(); 
                data.endTime = endTime;
            }
            }
            _.extend(clean, data);
            // 过滤空的搜索条件
            if (_.isObject(data) && !_.isArray(data)) {
                clean = {};
                _.each(data, function(value, key) {
                    if (_.isObject(value)) {
                        if (!_.isEmpty(value)) clean[key] = value;
                    } else {
                        if (value.toString() != '') clean[key] = value;
                    }
                });
            }
            list.fetch({
                type: 'post',
                parse: true,
                reset: true,
                data: clean
            });
        }

        // 将分页视图渲染到界面上
        $('.toolbar-bottom').append(pager.render().$el);
        $('[data-do="export:order"]').on('click', function() {
      	 var startTime = $('#startTime').val();
      	 var  endTime = $('#endTime').val();
      	 var  status = $('#status').val();
      	 var  productName = $('#productName').val();
      	 if(productName==""){
      		 productName = null ;
      	 }
      	 if(startTime!=""){
      		startTime = Date.parse(startTime) ;
      	 }else{
      		startTime = null ;
      	 }   	 
      	 if(endTime!=""){
      		endTime =  Date.parse(endTime) ;
      	 }else{
      		 endTime = null ;
      	 }
		var form=$("<form id='excel'>");//定义一个form表单
		form.attr("style","display:none");
		form.attr("target","");
		form.attr("method","post");  //请求类型
		var input1 = $('<input>');
	    input1.attr('type', 'hidden');
	    input1.attr('name', 'productName');
	    input1.attr('value', productName);
	    form.append(input1);
		var input2 = $('<input>');
	    input2.attr('type', 'hidden');
	    input2.attr('name', 'status');
	    input2.attr('value', status);
	    form.append(input2);
		var input3 = $('<input>');
	    input3.attr('type', 'hidden');
	    input3.attr('name', 'startTime');
	    input3.attr('value', startTime);
	    form.append(input3);
		var input4 = $('<input>');
	    input4.attr('type', 'hidden');
	    input4.attr('name', 'endTime');
	    input4.attr('value', endTime);
	    form.append(input4);
		form.attr("action",CONTEXT_PATH + '/web/boxWeb/excleOrder.do?');   //请求地址
		$("body").append(form);//将表单放置在web中	
		form.submit(); 
		$("#target").load(function(){
			alert($(this).result_status);
		})
        });

        var modal;
        $('[data-do="create:companyAdmin"]').on('click', function() {
            modal instanceof FormModal && modal.remove();

            var attrs = {
                corpId: CID,
                companyName: COMPANY_NAME,
                companyNo: COMPANY_CODE
            }
            modal = new CompanyAdminCreateModal({
                model: new CompanyAdmin(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:companyAdmin', function(model) {
            modal instanceof FormModal && modal.remove();
            modal = new CompanyAdminEditModal({
                model: model
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });
        Backbone.on('role:admin', function(model) {
            modal instanceof FormModal && modal.remove();
            modal = new AdminRoleModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.show();
        });

        searchHandler();
    }

    exports.run = run;
});