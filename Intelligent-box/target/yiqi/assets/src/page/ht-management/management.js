define(function(require, exports, module) {
	var $ = require('jquery');
	require('jqueryui');
	require('jquery-util');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var confirm = require('component/Confirm');
	var alert = require('component/Alert');
	var FormModal = require('component/FormModal');
	var SearchForm = require('component/SearchForm');
	var Pager = require('component/Pager');
	var Model = require('component/Model');
	var template = require('template');
	var moment = require('moment');
	require('umeditor-config');
	require('umeditor');
	require('umeditor-lang');
	require('jquery-form');
	require('metisMenu');
	require('jquery-validate');
	require('jquery-validate-additional');
	require('ztree');
	require('ztree-excheck');
	require('bootstrap-daterangepicker');
	require('bootstrap');
	Backbone.emulateHTTP = true;
	
	
	var Management = Model.extend({
		defaults : {
			name: '',
			id : 1,
			title : '',
			cid :'1',
			status:'',
			params:'',
			companyName:'',
			number:'',
			statusExplain:'',
			detail : '',
			content : '',
			createTime : '',
			updateTime: '',
			companyCommander: ''
		},
		serialize : function() {
			var data = this.toJSON();
			var updateTime = parseInt(this.get('updateTime'), 10);
			var updateTimeText = '';
			if (updateTime > 0) {
				updateTime = moment(updateTime);
				updateTimeText = updateTime.isValid() ? updateTime
						.format('YYYY-MM-DD HH:mm') : '';
			}

			var status = this.get('status');
			var statusMap = {
				1: '准备状态',
				2: '起草状态',
				3: '审批状态',
				4: '签署状态',
				5: '执行状态',
				6: '结束状态'
			};
			var statusText = statusMap[status] ||  '未知';	

			var cname = this.get('cname');
			var dname = this.get('dname');
			var sender = dname != '' ? dname : cname;
			data.updateTimeText = updateTimeText;
			data.statusText = statusText;
			data.sender = sender;
			return data;
		},
		syncOptions : {
			wait : true,
			processData : true
		},
		destroy : function(options) {
			var data = this.pick('id');
			Management.__super__.destroy.call(this, _.extend({
				dataType : 'text',
				url : CONTEXT_PATH + '/web/deleteMessage.do',
				data : data,
			}, this.syncOptions, options));
		},
		save : function(attrs, options) {
			Management.__super__.save.call(this, attrs, _.extend({},
					this.syncOptions, options));
		}
	});
	require('json2');

	var managementCreateModalRender = template($('#tmpl-managementCreateModal').html());
	
	//鼠标hover时显示全部	
	$(".names").hover(function(){
		var Val=$(".names").val();
		document.getElementById("mingc").title=Val;		
	},function(){
		console.log("离开");
	})
	
	//合同名称字数限制
	$(".names").keyup(function(){
		var Len=$(".names").val().length;
		if(Len>50){
			$(this).val($(this).val().substring(0,50));
		}
		
	})
	
	/*$("table tbody tr").each(function(){
			var dd=$(this).find("td").eq(1).text();
			var arr=dd.split(",");
			 for(var i in arr){
				 if(arr[i].length>20){
				 	var oo=$(this).find("td").eq(1).text();
				 	//alert(oo);
				 	//alert(11);
				 	$(this).find("td").eq(1).text(oo.substring(0,20)+"...");				 					$(this).mouseover(function(){
				 		$(this).find("td").eq(1).text(oo);
				 	}
				 	$(this).mouseout(function(){
				 		$(this).find("td").eq(1).text(oo.substring(0,20)+"...");	
				 	})
				 	
				 }
			}
		})*/
		
	//合同编号字数限制
	$(".bhao").keyup(function(){
		var blen=$(".bhao").val().length;
		if(blen>50){
			$(this).val($(this).val().substring(0,50));
		}
	})
	//模糊查询--名称
	$('#mingc').bind('input propertychange', function() {
		var Value=$(this).val();				
		$("table tbody tr").each(function(){
			if($(this).find("td").eq(1).html().indexOf(Value)!=-1){
				var p=document.createElement("li");            	
            	p.innerHTML=$(this).find("td").eq(1).html();           	    
				$(".lis").append(p);
			} 						
		})
		if($("#mingc").val().length==0){
			$(".lis").hide();
		}
		$(".lis li").click(function(){
			var aa=$(".names").val()
			var bb=$(this).html();
			aa=bb;
			$(".names").val(aa);
		})
	});
	
	
	
	//点击搜索触发查询
	$(".sousuo").click(function(){
		var htbh=$(".bhao").val();
		var htmc=$("#mingc").val();
		$("table tbody tr").show();
		$("table tbody tr").each(function(){
			if($(this).find("td").eq(0).html().indexOf(htbh)!=-1&&$(this).find("td").eq(1).html().indexOf(htmc)!=-1){
				//console.log($(this).find("td").eq(1).html());				
			}else{
				$(this).hide();
				$(".zw").show();
			}
			
		})
	})
	//点击筛选.zw隐藏
	$(".sx").click(function(){
		$(".zw").hide();
	})
	
	$(".sousuo").click(function(){
		$(".zw").hide();
	})
	$(".names").blur(function(){
		$(".lis").hide();
	})		
		
    var ManagementCreateModal = FormModal.extend({
        template: managementCreateModalRender,
        initForm: function() {
            this.$form.validate({
                rules: {
                    name: {
                        required: true,
                        maxlength: 50
                    },
                    number: {
                        required: true,
                        maxlength:50
                    },
                    money: {
                        required: true,
                        maxlength: 50
                    },
                    companyName: {
                        required: true,
                        maxlength: 50
                    },
                    companyCommander: {
                        required: true,
                        maxlength: 50
                    },
                    
                    statusExplain: {
                    	
                    	rangelength: [0,500]
                    }

                },
                messages: {
                    name: {
                        required: '必填项',
                        maxlength: '字符数不超过50个'
                    },
                    number: {
                        required: '必填项',
                        maxlength: '字符数不超过50个'
                    },
                    money: {
                        required: '必填项',
                        maxlength: '字符数不超过50个'
                    },
                    companyName: {
                        required: '必填项',
                        maxlength: '字符数不超过50个'
                    },
                    companyCommander: {
                        required: '必填项',
                        maxlength: '字符数不超过50个'
                    },
                   
                    statusExplain: {
                       
                        rangelength: $.validator.format("请输入长度 0 到 500 个字符")
                    }
                }
            });
        },
       
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var data = this.$form.serializeObject();
                var params={
                cid:COMPANY_ID,
                companyCommander:data.companyCommander,
                companyName:data.companyName,
                money:data.money,
                name:data.name,
                number:data.number,
                status:data.status,
                statusExplain:data.statusExplain           	
                }                
                console.log(params);                
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: CONTEXT_PATH + '/api/contract/create.do',
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
        }       		
    });

    var managementEditModalRender = template($('#tmpl-managementEditModal').html());
    var ManagementEditModal = ManagementCreateModal.extend({
        template: managementEditModalRender,
        initForm: function() {
            this.$form.validate({
                rules: {                                     
                    statusExplain: {
                    	rangelength: [1, 500]
                    }
                },
                messages: {                                     
                    statusExplain: {
                        rangelength: $.validator.format("请输入长度 0 到 500 个字符")
                    }
                }
            });
        },
        submit: function(event) {
            if (this.$form.valid()) {
                var $target = $(event.target);
                var params = this.$form.serializeObject();
                console.log(params);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: CONTEXT_PATH + '/api/contract/update.do',
                    context: this,
                    data:params,
                    
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
                             console.log(resp.message);
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
        }
    });
	
	var itemRender = template($('#tmpl-item').html());
	var ItemView = Backbone.View.extend({
		tagName : 'tr',
		template : itemRender,
		events : {
			'click [data-do="edit"]' : 'doEdit',
			'click [data-do="delete"]' : 'doDelete',
			'click [data-do="view"]' : 'doView'
		},
		initialize : function() {
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'change', this.render);
			
		},
		doView: function(e) {
			var id = $(e.target).data('id');
			window.location.href = CONTEXT_PATH + '/web/system/managementView.htm?id=' + id
		},
		
		doEdit : function(e) {
			Backbone.trigger('edit:management', this.model, this);
		},
		doDelete : function(e) {
			var id = $(e.target).data('id');
            var _this = this;
            confirm('确认删除此合同记录？\n删除后手机端将无法查看到此条记录。', function() {
                $.ajax({
                    url: CONTEXT_PATH + '/api/contract/delete.do',
                    type: 'post',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    context: _this,
                    beforeSend: function() {},
                    success: function(data) {
                        if (data.success) {
                            alert(data.message);
                            this.model.collection.refresh();
                        } else {
                            alert(data.message);
                        }
                    }
                });
            })

		},
		render : function() {
			var markup = this.template({
				model : this.model.serialize()
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
	var DataTable = Backbone.View
			.extend({
				noDataRender : template('<tr><td colspan="{{count}}">暂无数据</td></tr>'),
				loadingRender : template('<tr><td colspan="{{count}}">数据加载中...</td></tr>'),
				initialize : function() {
					this.cacheEls();

					this.listenTo(this.collection, 'reset', this.reset);
					this.listenTo(this.collection, 'request', this.request);
					this.listenTo(this.collection, 'sync', this.sync);
					this.listenTo(this.collection, 'error', this.error);
					this.listenTo(this.collection, 'destroy', this.refresh);

					this.listenTo(this.collection, 'change:sort', this.refresh);
										
				},
				addOne : function(model, collection, options) {
					model.set('cid', COMPANY_ID);
					//alert(model.cid)
					//alert(COMPANY_ID)									
					var itemView = new ItemView({
						model : model
					});
					this.$items.append(itemView.render().el);
				},
				reset : function(collection, options) {
					var previousModels = options.previousModels;
					_.each(previousModels, function(model) {
						model.trigger('remove');
					});
					
					this.$items.empty();

					if (collection.length == 0) {
						this.$items.html(this.noDataRender({
							count : this.colHeadersCount
						}));
					} else {
						collection.each(function(model, index) {
							model.set({
								index : index + 1,
								$index : index
							});
							this.addOne(model, collection);
						}, this);
					}
				},
				cacheEls : function() {
					this.$headers = this.$('[role="col-headers"]');
					this.$items = this.$('[role="items"]');
					this.colHeadersCount = this.$headers.find('th').size();
				},
				request : function(collection) {
					if (collection instanceof Backbone.Collection) {
						var markup = this.loadingRender({
							count : this.colHeadersCount
						});

						this.$items.empty().html(markup);
					}
				},
				refresh : function() {
					var data = this.model.getData();
					this.collection.refresh({});
				}
			});

	function run() {
		$('.table-bordered > tbody').on('mouseover',function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

		$('.primary-nav').metisMenu();
		var query = new Backbone.Model({
			
		});
		
		_.extend(query, {
			autoParam : function() {
				return {
					/*cid : COMPANY_ID*/
				}
			},
			getData : function() {
				var attrs = this.toJSON();
				return _.extend(attrs, this.autoParam());
			}
		});
		var list = new Backbone.Collection(null, {
			model : Management
		});
		_.extend(list, {
			url : CONTEXT_PATH + '/api/contract/queryForWeb.do',
			parse : function(resp) {
				var parsed = _.extend({
					success : false,
					model : {}
				}, resp);
				
				var model = parsed.model;
				var items = _.isArray(model.list) ? model.list : []; 
				
				return items;
			},
			refresh : function(options) {
				var data = query.getData();
				options = $.extend(true, {
					type : 'post',
					parse : true,
					reset : true,
					data : data
				}, options);

				this.fetch(options);
			}
		});

		var table = new DataTable({
			el : '#datatable',
			model : query,
			collection : list
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
        // 分页
      var pager = new Pager({
            className: 'pagination pull-right',
            collection: list
        });
      pager.listenTo(list, 'sync', function(collection, resp, options) {
			var pageVo = resp.model;
			if (pageVo == null) {
				this.$el.empty();
			} else {
				var attrs = _.pick(pageVo, 'pageNum', 'pageSize', 'total', 'pages');
				attrs.totalPages = pageVo.pageTotal;
				this.update({
					pageNo: attrs.pageNum,
					pageSize: attrs.pageSize,
					totalPages: attrs.pages,
					totalCount: attrs.total
				});
			}
		});
        pager.on('page', function(pageNo) {
            var data = search.serialize();
            _.extend(data, {
                pageNo: pageNo
            }, query.toJSON());

            searchHandler(data);
        });
       
     
		
		table.$el.after(pager.render().$el);

		function searchHandler(data) {
			var clean = data;
			// 过滤空的搜索条件
			if (_.isObject(data) && !_.isArray(data)) {
				clean = {};
				_.each(data, function(value, key) {
					if (_.isObject(value)) {
						if (!_isEmpty(value))
							clean[key] = value;
					} else {
						if (value.toString() != '')
							clean[key] = value;
					}
				});
			}
			list.fetch({
				type : 'post',
				parse : true,
				reset : true,
				data : clean
			});
		}		

		searchHandler(query.getData());
				       
		var modal;
		$('[data-do="create:management"]').on('click', function() {
            var attrs = {
                companyId: COMPANY_ID
            }
            modal = new ManagementCreateModal({
                model: new Management(attrs),
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
        });

        Backbone.on('edit:management', function(model) {
            modal = new ManagementEditModal({
                model: model,
                collection: list
            });
            modal.render().$el.appendTo(document.body);
            modal.initForm();
            modal.show();
            
        });

		
	}

	exports.run = run;
	
});