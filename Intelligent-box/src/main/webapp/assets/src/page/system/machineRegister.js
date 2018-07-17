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
            var createTime = this.get('registerTime');
            var updateTime = this.get('updateTime');
            var status = this.get('status');
            var statusText = '' ;
            if(status==0){
            	statusText = '未绑定';
            }else if(status==1){
            	statusText = '已绑定';
            }
            createTime = moment(parseInt(createTime, 10));
            var createTimeText = createTime.isValid() ? createTime.format('YYYY-MM-DD HH:mm:ss') : '';
            data._isNew = this.isNew();
            data.createTimeText = createTimeText;
            updateTime = moment(parseInt(updateTime, 10));
            var updateTimeText = updateTime.isValid() ? updateTime.format('YYYY-MM-DD HH:mm:ss') : '';
            data.updateTimeText = updateTimeText;
            data.statusText = statusText ;
            return data;
        },
        syncOptions: {
            wait: true,
            processData: true
        },
        destroy: function(options) {
            var data = this.pick('productId');
            data.rid = 2;
            $.ajax({
                url: CONTEXT_PATH + '/web/system/delete.do',
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
                        this.trigger('destroy', this, this.collection);
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
            'click [data-do="toggleOne"]': 'doToggleOne',
        },
        initialize: function() {
            this.listenTo(this.model, 'remove', this.remove);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'toggle:select', this.syncToggle);
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
       var copyCreateModalRender = template($('#tmpl-companyCreateModal').html());
   	var CopyCreateModal = FormModal
   			.extend({
   				template : copyCreateModalRender,
   				events: {
   		            'click [data-do="submit"]': 'submit',
   		        },
   		     submit : function(){
   		    	var $target = $(event.target);
				var data = this.$form.serializeObject();
				if(data.roomCode==""||data.roomCode==undefined){
					alert("房间号必填");
					return false ;
				}
				var machineId = $('#machineId').val();
				data.machineId = machineId ;
				if (this.$form.valid()) {
					this.$form.ajaxSubmit({
						url : CONTEXT_PATH + '/web/boxWeb/bindingCompany.do',
						context : this,
						beforeSend : function() {
							$target.prop('disabled', true);
						},
						success : function(resp) {
							resp = _.extend({
								success : false,
								model : {}
							}, resp);
							if (resp.success) {
								location.reload();
								alert('操作成功').delay(1);
								this.hide();
							} else {
								alert(resp.message);
							}
						},
						error : function() {
							alert('操作失败');
						},
						complete : function() {
							$target.prop('disabled', false);
						}
					});
				}
   			}
   			});
    /*
     * 批量操作
     */
        /* 批量操作 */
    var bulkActionRender = template($('#tmpl-bulkAction').html());
    var BulkAction = Backbone.View.extend({
        template: bulkActionRender,
        events: {
            'click [data-do="bulk:binding"]': 'dobinding',
        },
        
        dobinding: function() {
            this.trigger('bulk:binding');
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
    
    	var noticeCreateModalRender = template($('#tmpl-noticeCreateModal').html());
	var NoticeCreateModal = FormModal
			.extend({
				template : noticeCreateModalRender,
				events: {
					'click [data-do="submit"]': 'submit'
				},
				initialize : function() {
					NoticeCreateModal.__super__.initialize.call(this);
				},

				submit : function(event) {
					var $target = $(event.target);
					var data = this.$form.serializeObject();
					if (this.$form.valid()) {
						this.$form.ajaxSubmit({
							url : CONTEXT_PATH + '/web/boxWeb/addMachine.do',
							context : this,
							beforeSend : function() {
								$target.prop('disabled', true);
							},
							success : function(resp) {
								resp = _.extend({
									success : false,
									model : {}
								}, resp);
								if (resp.success) {
									location.reload();
									alert('操作成功').delay(1);
									this.hide();
								} else {
									alert(resp.message);
								}
							},
							error : function() {
								alert('操作失败');
							},
							complete : function() {
								$target.prop('disabled', false);
							}
						});
					}
				},
				remove : function() {
					if (this.editor)
						this.editor.destroy();
					NoticeCreateModal.__super__.remove.call(this);
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
        request: function(collection) {
            if (collection instanceof Backbone.Collection) {
                var markup = this.loadingRender({
                    count: this.colCount
                });

                this.$items.empty().html(markup);
            }
        },
    
  bulkBinding: function() {
            var collection = this.collection;
            var selection = collection.getSelection();
            if (selection.length === 0) {
                alert('请选择要绑定的设备').delay(2);
            } else {
            	var machineId = [] ;
            	var buind = [];
                    _.each(selection, function(model) {
                    	if(model._previousAttributes.status!=1){
                    		   machineId.push(model._previousAttributes.machineId);
                    		   buind.push(model._previousAttributes.buind);
                    	}                       
                    });
                    var modal;      
 					modal = new CopyCreateModal({
 					model : new CompanyAdmin(),
 				});
                    modal.render().$el.appendTo(document.body);
 					modal.show();
 					$.ajax({
 		                url: CONTEXT_PATH + '/web/boxWeb/getCompanyList.do',
 		                type: 'get',
 		                success: function(resp) {
 		                    if (resp.success) {
 		                    	var markup = [];
 		                    	var mark = [];
 		                    	var arr = resp.model ;
 		                    	mark.push('<input id="machineId" value='+machineId+' class="form-input1"  placeholder="请输入1-100数字" type="hidden"  name="machineId"/>');  
 		                    	for(var i = 0; i < arr.length; i++){
 		                    	markup.push('<option value="' + arr[i].id + '">' + arr[i].name + '</option>');                    
 		                    	}
 		                        $('#companySelect').html(markup.join(''));
 		                       $('#machine').html(mark.join(''));
 		                    } else {
 		                        alert(resp.message);
 		                    }
 		                }
 		            });
            }
        },
    });


    function run() {
        $('.table-bordered > tbody').on('mouseover', function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
        $('.primary-nav').metisMenu();

        var query = new Backbone.Model();
        if (CID != '') query.set('cid', CID);
        query.set('pageNo',1);
        query.set('pageSize',20)
        var list = new Backbone.Collection(null, {
            model: CompanyAdmin
        });
        _.extend(list, {
            url: CONTEXT_PATH + '/web/boxWeb/getMachineRegister.do',
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

        var bulkAction = new BulkAction({
            className: 'bulk-action pull-left'
        });
        

        function searchHandler(data) {
            var clean = query.toJSON();
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

         table.listenTo(bulkAction, 'bulk:binding', table.bulkBinding);
        // 将分页视图渲染到界面上
        $('.toolbar-bottom').append(bulkAction.render().$el, pager.render().$el);

        var modal;
        $('[data-do="create:companyAdmin"]').on('click', function() {
            modal instanceof FormModal && modal.remove();

            var attrs = {
                cid: CID,
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