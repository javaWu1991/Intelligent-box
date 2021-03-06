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
	/*
	 * 模型
	 */
	var Notice = Model.extend({
		defaults : {
			id : 0,
			title : '',
			cid : 0,
			detail : '',
			content : '',
			createTime : '',
			cname : '',
			dname : ''
		},
		serialize : function() {
			var data = this.toJSON();
			var createTime = parseInt(this.get('createTime'), 10);
			var type = this.get('type');
			var typeText = '未知';
			if(type==0)
			typeText = '其他';
			if(type==1)
				typeText = '安全套';
			if(type==2)
				typeText = '情趣内衣';
			if(type==3)
				typeText = '跳蛋';
			if(type==4)
				typeText = '飞机杯';
			if(type==5)
				typeText = '精油';
			if(type==6)
				typeText = '湿巾';
			if(type==7)
				typeText = '喷剂';
			var createTimeText = '';
			if (createTime > 0) {
				createTime = moment(createTime);
				createTimeText = createTime.isValid() ? createTime
						.format('YYYY-MM-DD HH:mm') : '';
			}
			data.createTimeText = createTimeText;
			data.typeText = typeText;
			return data;
		},
		syncOptions : {
			wait : true,
			processData : true
		},
		
		save : function(attrs, options) {
			Notice.__super__.save.call(this, attrs, _.extend({},
					this.syncOptions, options));
		}
	});
	require('json2');
	var noticeCreateModalRender = template($('#tmpl-noticeCreateModal').html());
	var NoticeCreateModal = FormModal
			.extend({
				template : noticeCreateModalRender,
				events: {
					'click [data-do="submit"]': 'submit'
				},
				initForm : function() {
					this.$form.validate({
						rules : {
							title: {
		                        required: true,
		                        maxlength: 40
		                    },
							detail: {
		                        required: true,
		                        rangelength: [5, 400]
		                    },
							picfile : {
								required : true,
								accept : 'image/*'
							}
						},
						messages : {
							title: {
		                        required: '必须填写',
		                        maxlength: '输入长度最多为40'
		                    },
							detail: {
		                        required: '必须填写',
		                        rangelength: $.validator.format("请输入长度 5 到 400 个字符"),
		                    },
							picfile : {
								required : '请上传封面图片',
								accept : '必须是图片文件'
							}
						}
					});
				},
				initialize : function() {
					NoticeCreateModal.__super__.initialize.call(this);
				},
				setDatetimeRange: function(event, picker) {
		            var startDate = picker.startDate;
		            var endDate = picker.endDate;
		            this.model.set('createTime', startDate.format('x'));
		            this.model.set('modifyTime', endDate.format('x'));
		       },        
				initEditor : function() {
					this.editor = UM
							.getEditor(
									'editor',
									{
										initialFrameWidth : '100%',
										initialFrameHeight : '300',
										autoHeightEnabled : false,
										imagePath : CONTEXT_PATH,
										imageUrl : CONTEXT_PATH
												+ '/web/edit/upload.do',
										imageFieldName : 'file',
										// imageUrlPrefix : SourceUrl,
										toolbar : [
												'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor | superscript subscript',
												'paragraph justifyleft justifycenter justifyright justifyjustify | insertorderedlist insertunorderedlist | removeformat | selectall cleardoc | image | link unlink | horizontal source' ]
									});
				},
				submit : function(event) {
					var $target = $(event.target);
					var data = this.$form.serializeObject();
					if (this.$form.valid()) {
						this.$form.ajaxSubmit({
							url : CONTEXT_PATH + '/web/boxWeb/addDefaultProduct.do',
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

	var noticeEditModalRender = template($('#tmpl-noticeEditModal').html());
	var NoticeEditModal = FormModal
			.extend({
				template : noticeEditModalRender,
				initForm : function() {
					this.$form.validate({
						rules : {
							title: {
		                        required: true,
		                        maxlength: 40
		                    },
							detail: {
		                        required: true,
		                        rangelength: [5, 400]
		                    },
							picfile : {
								required : true,
								accept : 'image/*'
							}
						},
						messages : {
							title: {
		                        required: '必须填写',
		                        maxlength: '输入长度最多为40'
		                    },
							detail: {
		                        required: '必须填写',
		                        rangelength: $.validator.format("请输入长度 5 到 400 个字符"),
		                    },
							picfile : {
								required : '请上传封面图片',
								accept : '必须是图片文件'
							}
						}
					});
				},
				initialize : function() {
					NoticeCreateModal.__super__.initialize.call(this);
				},
				render : function() {
					NoticeCreateModal.__super__.render.call(this);

					this.listenTo(this.editOrgTree, 'treeLoaded',
							this.checkTree);
					return this;
				},
				initEditor : function() {
					this.editor = UM
							.getEditor(
									'editor',
									{
										initialFrameWidth : '100%',
										initialFrameHeight : '300',
										autoHeightEnabled : false,
										imagePath : CONTEXT_PATH,
										imageUrl : CONTEXT_PATH
												+ '/web/edit/upload.do',
										imageFieldName : 'file',
										toolbar : [
												'undo redo | bold italic underline strikethrough fontfamily fontsize forecolor backcolor | superscript subscript',
												'paragraph justifyleft justifycenter justifyright justifyjustify | insertorderedlist insertunorderedlist | removeformat | selectall cleardoc | image | link unlink | horizontal source' ]
									});
				},
				submit : function(event) {
					var $target = $(event.target);
					var params = this.$form.serializeObject();
					if (this.$form.valid()) {
						this.$form.ajaxSubmit({
							url : CONTEXT_PATH + '/web/boxWeb/updateDefaultProduct.do',
							context : this,
							beforeSend : function() {
								$target.prop('disabled', true);
							},
							success : function(resp) {
								resp = _.extend({
									success : false,
									message : '操作失败'
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
	 * 数据行
	 * 
	 * 监听对象的 remove 和 change 事件更新视图
	 */
	var itemRender = template($('#tmpl-item').html());
	var ItemView = Backbone.View.extend({
		tagName : 'tr',
		template : itemRender,
		events : {
			'click [data-do="edit"]' : 'doEdit',
		},
		initialize : function() {
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'change', this.render);
		},
		doEdit : function() {
			Backbone.trigger('edit:notice', this.model, this);

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
		$('.primary-nav').metisMenu();
		var query = new Backbone.Model({
			cid : COMPANY_ID,
			pageNo:1,
			pageSize:20
		});
		_.extend(query, {
			autoParam : function() {
				return {
					cid : COMPANY_ID
				}
			},
			getData : function() {
				var attrs = this.toJSON();
				return _.extend(attrs, this.autoParam());
			}
		});
		var list = new Backbone.Collection(null, {
			model : Notice
		});
		_.extend(list, {
			url :  CONTEXT_PATH + '/web/boxWeb/getDefaultProductList.do',
			parse : function(resp) {
				var parsed = _.extend({
					success : false,
					model : []
				}, resp);
				var items = _.isArray(parsed.model) ? parsed.model : [];
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
			el : '#search',
			collection : list
		});
		search.on('search', function(data) {
			query.clear();
			_.extend(data, {
			});
			query.set(data);
			searchHandler(query.getData());
		});

		var pager = new Pager({
			className : 'pagination pull-right'
		});

		pager.listenTo(list, 'sync', function(collection, resp, options) {
			var pageVo = resp.pageVo;
			if (pageVo == null) {
				this.$el.empty();
			} else {
				var attrs = _.pick(pageVo, 'pageNo', 'pageSize', 'totalCount');
				attrs.totalPages = pageVo.pageTotal;
				this.update(attrs);
			}
		});

	     pager.on('page', function(pageNo) {
            var data = search.serialize();
            _.extend(data, {
                pageNo: pageNo,
                cid:COMPANY_ID
            });

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
		$('[data-do="create:notice"]').on('click', function() {
			var attrs = {
				cid : COMPANY_ID
			}
			modal = new NoticeCreateModal({
				model : new Notice(attrs),
				collection : list
			});
			modal.render().$el.appendTo(document.body);
			modal.initEditor();
			modal.initForm();
			modal.show();
		});

		Backbone.on('edit:notice', function(model) {
			modal = new NoticeEditModal({
				model : model
			});
			modal.render().$el.appendTo(document.body);
			modal.initEditor();
			modal.initForm();
			modal.show();
		});
	}

	exports.run = run;
});