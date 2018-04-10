define(function(require, exports, module) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var confirm = require('component/Confirm');
	var alert = require('component/Alert');
	var FormModal = require('component/FormModal');
	var SearchForm = require('component/SearchForm');
	var Pager = require('component/Pager');
	var template = require('template');
	var Model = require('component/Model');
	var OrgModel = require('component/OrgModel');
	var DeptTree = require('component/DeptTree');
	require('jquery-form');
	require('jquery-validate');
	require('jquery-util');
	require('metisMenu');
	Backbone.emulateHTTP = true;
	/*
	 * 模型
	 */
	var Org = OrgModel.Org;
	var Company = OrgModel.Company;
	var Dept = OrgModel.Dept;
	var OrgUser = require('./OrgUser');
	OrgUser = OrgUser.extend({
		toggleSelect: function(selected) {
			this.$selected = _.isBoolean(selected) ? selected : !this.$selected;
			this.trigger('toggle:select', this.$selected, this);
		}
	});
	/*
	 * 创建组织 - 部门
	 */
	var orgCreateModalRender = template($('#tmpl-orgCreateModal').html());
	var OrgCreateModal = FormModal.extend({
		template: orgCreateModalRender,
		submit: function(event) {
			if (this.$form.valid()) {
				var $target = $(event.target);
				var data = this.$form.serializeObject();
				this.model.save(null, {
					url: CONTEXT_PATH + '/web/system/addOrUpdateOrg.do',
					context: this,
					data: data,
					success: function(model, resp, options) {
						resp = _.extend({
							success: false,
							model: {}
						}, resp);
						if (resp.success) {
							var model = resp.model;
							var $pId = this.model.get('$pId');
							var attrs = {
								id: model.id,
								name: model.orgName,
								companyId: model.cid,
								higherId: model.higherId,
								$pId: $pId,
								sort: model.sort
							}
							this.collection.add(new Dept(attrs));
							alert('操作成功').delay(1);
							this.hide();
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					},
					beforeSend: function() {
						$target.prop('disabled', true);
						$('[data-dismiss="modal"]').prop('disabled', true);
					},
					complete: function() {
						$target.prop('disabled', false);
						$('[data-dismiss="modal"]').prop('disabled', false);
					}
				});
			}
		},
		initForm: function() {
			this.$form.validate({
				rules: {
					orgName: {
						required: true,
						rangelength: [1, 255]
					},
					sort: {
						required: true,
						digits: true,
						rangelength: [1, 11]
					}
				},
				messages: {
					orgName: {
						required: '必填项',
						rangelength: '不超过255个字符'
					},
					sort: {
						required: '必填项',
						digits: '必须是数字',
						rangelength: '不超过11位数字'
					}
				}
			});
		}
	});
	/*
	 * 编辑组织 - 部门
	 */
	var orgEditModalRender = template($('#tmpl-orgEditModal').html());
	var OrgEditModal = FormModal.extend({
		template: orgEditModalRender,
		submit: function(event) {
			if (this.$form.valid()) {
				var $target = $(event.target);
				var data = this.$form.serializeObject();
				this.model.save(null, {
					url: CONTEXT_PATH + '/web/system/addOrUpdateOrg.do',
					context: this,
					data: data,
					success: function(model, resp, options) {
						resp = _.extend({
							success: false,
							model: []
						}, resp);

						if (resp.success) {
							var attrs = _.pick(data, ['orgName', 'sort']);
							this.model.set({
								name: attrs.orgName,
								sort: attrs.sort
							});
							alert('操作成功').delay(1);
							this.hide();
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					},
					beforeSend: function() {
						$target.prop('disabled', true);
						$('[data-dismiss="modal"]').prop('disabled', true);
					},
					complete: function() {
						$target.prop('disabled', false);
						$('[data-dismiss="modal"]').prop('disabled', false);
					}
				});
			}
		},
		initForm: function() {
			this.$form.validate({
				rules: {
					orgName: {
						required: true,
						rangelength: [1, 255]
					},
					sort: {
						required: true,
						digits: true,
						rangelength: [1, 11]
					}
				},
				messages: {
					orgName: {
						required: '必填项',
						rangelength: '不超过255个字符'
					},
					sort: {
						required: '必填项',
						digits: '必须是数字',
						rangelength: '不超过11位数字'
					}
				}
			});
		}
	});
	/*员工排序*/

	var orgSortModalRender = template($('tmpl-orgSort').html());
	var OrgSortModal = FormModal.extend({
		template: orgSortModalRender,
		// render: function() {
	 //    	OrgUserEditModal.__super__.render.call(this);
		// 	var orgList = new Backbone.Collection(null, {
		// 		model: Org
		// 	});
		// },
		submit: function(event) {
			if (this.$form.valid()) {
				var $target = $(event.target);
				var data = this.$form.serializeObject();
				this.model.save(null, {
					url: CONTEXT_PATH + '/web/system/users.do',
					context: this,
					data: data,
					success: function(model, resp, options) {
						resp = _.extend({
							success: false,
							model: []
						}, resp);

						if (resp.success) {
							alert('操作成功').delay(1);
							this.hide();
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					},
					beforeSend: function() {
						$target.prop('disabled', true);
						$('[data-dismiss="modal"]').prop('disabled', true);
					},
					complete: function() {
						$target.prop('disabled', false);
						$('[data-dismiss="modal"]').prop('disabled', false);
					}
				});
			}
		},
		initForm: function() {
			this.$form.validate({
				rules: {
					orgSort: {
						required: true,
						digits: true,
					}
				},
				messages: {
					orgSort: {
						required: '必填项',
						digits: '必须是数字',
					}
				}
			});
		}
	});

	$.validator.addMethod('mobile', function(value, element) {
		return this.optional(element) || value.length == 11 && (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i).test(value);
	});

	/*
	 * 创建员工
	 */
	var orgUserCreateModalRender = template($('#tmpl-orgUserCreateModal')
		.html());
	var OrgUserCreateModal = FormModal.extend({
		template: orgUserCreateModalRender,
		initForm: function() {
			this.$form.validate({
				rules: {
					name: {
						required: true,
						rangelength: [1, 20]
					},
					jobId: {
						required: true
					},
					mobile: {
						required: true,
						mobile: true
					},
					shortNum: {
						digits: true,
						rangelength: [1, 11]
					},
					sort: {
						digits: true,
						rangelength: [1, 11]
					},
					email: {
						email: true,
						rangelength: [1, 50]
					}
				},
				messages: {
					name: {
						required: '必填项',
						rangelength: '不超过20个字符'
					},
					jobId: {
						required: '请选择'
					},
					mobile: {
						required: '必填项',
						mobile: '格式不正确'
					},
					shortNum: {
						digits: '必须是数字',
						rangelength: '不超过11位数字'
					},
					sort: {
						digits: '必须是数字',
						rangelength: '不超过11位数字'
					},
					email: {
						email: '格式不正确',
						rangelength: '不超过50个字符'
					}
				}
			});

			this.initJobList();
		},
		submit: function(event) {
			if (this.$form.valid()) {
				var data = this.$form.serializeObject();
				var orgId = this.model.get('orgId');
				var $target = $(event.target);
				$.ajax({
					url: CONTEXT_PATH + '/web/system/saveUser.do',
					type: 'post',
					context: this,
					data: data,
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '未知错误'
						}, resp);

						if (resp.success == true) {
							alert('操作成功').delay(1);
							this.collection.refresh({
								data: {
									orgId: orgId
								}
							});
							this.hide();
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					},
					beforeSend: function() {
						$target.prop('disabled', true);
						$('[data-dismiss="modal"]').prop('disabled', true);
					},
					complete: function() {
						$target.prop('disabled', false);
						$('[data-dismiss="modal"]').prop('disabled', false);
					}
				});
			}
		},
		cacheEls: function() {
			this.$form = this.$('form');
			this.$jobSelector = this.$('.job-list');
		},
		initJobList: function() {
			$.ajax({
				url: CONTEXT_PATH + '/api/position/list/' + COMPANY_ID,
				type: 'get',
				dataType: 'json',
				context: this,
				success: function(resp) {
					resp = _.extend({
						success: false,
						model: [],
						message: ''
					}, resp);

					var models = resp.model;
					var markup = [];
					if (_.isArray(models) && models.length > 0) {
						_.each(models, function(model) {
							markup.push('<option value="' + model.id + '">' + model.positionName + '</option>');
						});
						this.$jobSelector.append(markup.join(''));
					} else {
						alert('暂无职位信息，无法添加员工');
					}
				}
			});
		}
	});
	/*
	 * 编辑员工
	 */
	var orgUserEditModalRender = template($('#tmpl-orgUserEditModal').html());
	var OrgUserEditModal = OrgUserCreateModal.extend({
		template: orgUserEditModalRender,
		render: function() {
			OrgUserEditModal.__super__.render.call(this);
			var orgList = new Backbone.Collection(null, {
				model: Org
			});

			var attrs = _.extend({
				id: COMPANY_ID,
				name: COMPANY_NAME,
				isRoot: true
			}, currentCompany);

			var company = new Company(attrs);
			orgList.add(company);

			var $tree = this.$('.dept-tree');

			var deptTree = new DeptTree({
				el: $tree,
				model: company,
				collection: orgList
			});

			this.deptTree = deptTree;
			return this;

		},
		initJobList: function() {
			$.ajax({
				url: CONTEXT_PATH + '/api/position/list/' + COMPANY_ID,
				type: 'get',
				dataType: 'json',
				context: this,
				success: function(resp) {
					resp = _.extend({
						success: false,
						model: [],
						message: ''
					}, resp);

					var models = resp.model;
					var markup = [];
					var jobId = this.model.get('jobId');
					var selected = '';
					if (_.isArray(models) && models.length > 0) {
						_.each(models, function(model) {
							selected = model.id == jobId ? ' selected="selected"' : '';
							markup.push('<option value="' + model.id + '"' + selected + '>' + model.positionName + '</option>');
						});
						this.$jobSelector.append(markup.join(''));
					} else {
						alert('暂无职位信息，无法添加员工');
					}
				}
			});
			
		},
		submit: function(event) {
			if (this.$form.valid()) {
				var $target = $(event.target);
				var data = this.$form.serializeObject();
				var isLeader = 0;
				if (data.isLeader) {
					isLeader = 1;
				} else {
					isLeader = 0;
				}
                var orgs = this.deptTree.tree.getSelectedNodes();
                var items = [];
                var changeName=[];
                _.each(orgs, function(item) {
                    var orgId = item.id;
                    var orgName=item.name;
                    items.push(
                        orgId
                    );
                    changeName.push(
                    		orgName
                    );
                });
                var resourceId = items.join(",");
                var changeOrgName = changeName.join(",");
                this.$form.ajaxSubmit({
                	url: CONTEXT_PATH + '/web/system/updateAdmin.do',
					type: 'post',
					context: this,
					data: {
						changeOrgId: resourceId,
						changeOrgName: changeOrgName,
						isLeader: isLeader
					},
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '未知错误'
						}, resp);

						if (resp.success == true) {
							var attrs = _.pick(data, ['account', 'name', 'mobile', 'sex', 'job', 'email', 'shortNum', 'sort','status']);
							this.model.set(attrs);
							alert('操作成功').delay(1);
							this.hide();
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					},
					beforeSend: function() {
						$target.prop('disabled', true);
						$('[data-dismiss="modal"]').prop('disabled', true);
					},
					complete: function() {
						$target.prop('disabled', false);
						$('[data-dismiss="modal"]').prop('disabled', false);
					}
				});
			}
		}
	});
	/*
	 * 导入
	 */
	var orgUserImportModalRender = template($('#tmpl-orgUserImportModal').html());
	var OrgUserImportModal = FormModal.extend({
		template: orgUserImportModalRender,
		submit: function(event) {
			var $target = $(event.target);
			this.$form.ajaxSubmit({
				url: CONTEXT_PATH + '/web/system/importExcel.do',
				context: this,
				success: function(resp) {
					resp = _.extend({
						success: false,
						message: '未知错误'
					}, resp);

					if (resp.success == true) {
						alert(resp.message, function() {
							window.location.reload();
						}).delay(1);
						this.hide();
					} else {
						alert(resp.message);
					}
				},
				error: function() {
					alert('操作失败');
				},
				beforeSend: function() {
					$target.prop('disabled', true);
					$('[data-dismiss="modal"]').prop('disabled', true);
				},
				complete: function() {
					$target.prop('disabled', false);
					$('[data-dismiss="modal"]').prop('disabled', false);
				}
			});
		}
	});
	/*
	 * 发送邀请短信
	 */
	var sendSMSModalRender = template($('#tmpl-sendSMSModal').html());
	var SendSMSModal = FormModal.extend({
		template: sendSMSModalRender,
		render: function() {
			var markup = this.template({
				model: this.model.serialize(),
				collection: this.collection.toJSON()
			});

			this.$el.html(markup);
			this.cacheEls();
			return this;
		},
		submit: function() {
			var data = this.$form.serializeObject();
			var phoneNos = data.phoneNos;
			if (_.isArray(phoneNos))
				data.phoneNos = phoneNos.join('-');
			this.model.save(null, {
				url: CONTEXT_PATH + '/api/sms/custom',
				context: this,
				data: data,
				success: function(model, resp, options) {
					resp = _.extend({
						success: false,
						model: {}
					}, resp);
					if (resp.success) {
						alert('操作成功').delay(1);
						this.hide();
					} else {
						alert('操作失败');
					}
				},
				error: function() {
					alert('操作失败');
				}
			});
		}
	});
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
	 * 员工列表
	 */
	var orgUserListRender = template($('#tmpl-orgUserList').html());
	var OrgUserList = Backbone.View.extend({
		template: orgUserListRender,
		events: {
			'click [data-do="create:org"]': 'doCreateOrg',
			'click [data-do="delete:org"]': 'doDeleteOrg',
			'click [data-do="edit:org"]': 'doEditOrg',

			'click [data-do="create:orgUser"]': 'doCreate',
			'click [data-do="import:orgUser"]': 'doImport',
			'click [data-do="sendsms"]': 'doSendSMS',
			'click [data-do="sort:org"]': 'sortOrg',
			'click [data-do="disableHidden"]': 'toggleCompanyStatus',
			'click [data-do="enableHidden"]': 'toggleCompanyStatus'
		},
		initialize: function() {
			var type = this.model.get('type');
			this.query = new Backbone.Model();
			// 如果选择的是部门，则具有员工列表视图
			if (type == Org.TYPE_DEPT) {
				var table = new DataTable({
					model: this.model,
					collection: this.collection
				});
				this.table = table;

				// 搜索表单
				var searchForm = new SearchForm({
					collection: this.collection
				});
				this.listenTo(searchForm, 'search', this.search);
				this.searchForm = searchForm;

				var pager = new Pager({
					className: 'pagination pull-right'
				});
				this.listenTo(pager, 'page', this.pageTo);
				this.listenTo(this.collection, 'sync', this.updatePager);
				this.pager = pager;

				var bulkAction = new BulkAction({
					className: 'bulk-action pull-left'
				});
				this.listenTo(bulkAction, 'bulk:delete', this.bulkDelete);
				this.listenTo(bulkAction, 'bulk:enable', this.bulkEnable);
				this.listenTo(bulkAction, 'bulk:disable', this.bulkDisable);
				// this.listenTo(bulkAction, 'sort:org', this.sortOrg);
				this.bulkAction = bulkAction;

				this.listenTo(this.model, 'destroy', this.remove);
			} else {
				this.listenTo(this.model, 'change', this.render);
			}
		},
		doCreateOrg: function() {
			Backbone.trigger('create:org', this.model);
		},
		doDeleteOrg: function() {
			var model = this.model;
			confirm('确认删除？', function() {
				var data = model.pick('id');
				$.ajax({
					url: CONTEXT_PATH + '/web/system/deleteOrg.do',
					type: 'post',
					data: data,
					dataType: 'json',
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '操作失败'
						}, resp);

						if (resp.success) {
							alert('操作成功').delay(1);
							model.trigger('destroy', model, model.collection);
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					}
				});
			});
		},
		doEditOrg: function() {
			Backbone.trigger('edit:org', this.model);
		},
		doCreate: function() {
			Backbone.trigger('create:orgUser', this.model);
		},
		doImport: function() {
			Backbone.trigger('import:orgUser', this.model);
		},
		doSendSMS: function() {
			var selection = [];
			this.collection.each(function(model) {
				if (model.$selected == true) {
					selection.push(model.toJSON());
				}
			});
			if (selection.length == 0) {
				alert('请选择接收人');
			} else {
				Backbone.trigger('sendSMS', this.model, selection);
			}
		},
		toggleCompanyStatus: function() {
			var id = this.model.get('id');
			var status = this.model.get('status');

			if (status == 0) {
				status = 1;
			} else {
				status = 0;
			}

			this.model.save(null, {
				url: CONTEXT_PATH + '/web/system/setCompanyIsHide.do',
				type: 'post',
				context: this,
				data: {
					cid: id,
					status: status
				},
				success: function(model, resp, options) {
					resp = _.extend({
						success: false,
						message: '操作失败'
					}, resp);

					if (resp.success == true) {
						alert('操作成功').delay(1);
						this.model.set({
							status: status
						});
					} else {
						alert(resp.message);
					}
				},
				error: function() {
					alert('操作失败');
				}
			});
		},
		bulkDelete: function() {
			var collection = this.collection;
			var selection = collection.getSelection();
			if (selection.length === 0) {
				alert('请选择要删除的条目').delay(1);
			} else {
				var model = this.model;
				confirm('确认删除所选条目？', function() {
					var selection = collection.getSelection();
					var ids = [];
					var orgId = model.get('id');
					_.each(selection, function(model) {
						ids.push(model.get('id'));
					});
					ids = ids.join(',');
					$.ajax({
						url: CONTEXT_PATH + '/web/system/deleteOrgUser.do',
						type: 'post',
						dataType: 'json',
						data: {
							orgId: orgId,
							id: ids
						},
						success: function(resp) {
							resp = _.extend({
								success: false,
								message: '操作失败'
							}, resp);
							if (resp.success) {
								collection.trigger('destroy');
								alert('操作成功').delay(1);
							} else {
								alert(resp.message);
							}
						}
					});
				});
			}
		},
		sortOrg: function() {
			var collection = this.collection;
			var selection = collection.getSelection();
			if (selection.length === 0) {
				alert('请选择要排序的条目').delay(1);
			} else {
				Backbone.on('sort:org', function(model) {
					modal = new OrgSortModal({
						model: model,
						collection: collection
					});
					modal.render().$el.appendTo(document.body);
					modal.initForm();
					modal.show();
				});
				var selection = collection.getSelection();
				var ids = [];
				var orgId = this.model.get('id');
				var sortId = this.model.get('sort');
				_.each(selection, function(model) {
					ids.push(model.get('id'));
				});
				ids = ids.join(',');
				$.ajax({
					url: CONTEXT_PATH + '/web/system/users.do',
					type: 'post',
					dataType: 'json',
					data: {
						orgId: orgId,
						id: ids
					},
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '操作失败'
						}, resp);
						if (resp.success) {
							sortId = $('#inputOrgSort').val();
							alert('操作成功').delay(1);
						} else {
							alert(resp.message);
						}
					}
				});
			}
		},
		render: function() {
			this.$el.html(this.template({
				model: this.model.serialize(),
				type: {
					TYPE_DEPT: Org.TYPE_DEPT,
					TYPE_CO: Org.TYPE_CO
				}
			}));

			if (this.table) {
				this.table.setElement(this.$('[role="datatable"]'));
				this.table.cacheEls();
			}

			if (this.bulkAction) {
				this.$('.toolbar-bottom').append(this.bulkAction.render().$el);
			}

			if (this.pager) {
				this.$('.toolbar-bottom').append(this.pager.render().$el);
			}

			if (this.searchForm) {
				this.searchForm.setElement(this.$('[role="search"]'));
			}

			return this;
		},
		remove: function() {
			this.table && this.table.remove();
			this.pager && this.pager.remove();
			OrgUserList.__super__.remove.call(this);
		},
		pageTo: function(pageNo) {
			this.query.set('pageNo', pageNo);
			this.doSearch(this.query.toJSON());
		},
		search: function(data) {
			if (_.isObject(data)) {
				this.query.clear().set(data);
			}
			this.doSearch(this.query.toJSON());
		},
		doSearch: function(data) {
//			var orgId = this.model.get('id');
//			var data = _.extend({
//				orgId: orgId
//			}, data);
			var clean = data;
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

			this.collection.fetch({
				type: 'post',
				parse: true,
				reset: true,
				data: clean
			});
		},
		updatePager: function(collection, resp, options) {
			var pageVo = resp.pageVo;
			if (pageVo == null) {
				this.pager.$el.empty();
			} else {
				var attrs = _.pick(pageVo, 'pageNo', 'pageSize', 'totalCount');
				attrs.totalPages = pageVo.pageTotal;
				this.pager.update(attrs);
			}
		}
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
			'click [data-do="edit"]': 'doEdit',
			'click [data-do="stick"]': 'doStick',
			'click [data-do="setAsLeader"]': 'doSetAsLeader',
			'click [data-do="toggleOne"]': 'doToggleOne'
		},
		initialize: function() {
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'toggle:select', this.syncToggle);
		},
		doEdit: function() {
			Backbone.trigger('edit:orgUser', this.model, this);
		},
		doDelete: function() {
			var model = this.model;
			var data = this.model.pick('id', 'orgId');
			confirm('确认删除？', function() {
				$.ajax({
					url: CONTEXT_PATH + '/web/system/deleteOrgUser.do',
					data: data,
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '操作失败'
						}, resp);

						if (resp.success) {
							model.trigger('destroy', model, model.collection);
							alert('操作成功').delay(1);
						} else {
							alert(resp.message);
						}
					},
					error: function() {
						alert('操作失败');
					}
				});
			});
		},
		doStick: function() {
			var orgId = this.model.get('orgId');
			var id = this.model.get('id');
			var sort = this.model.get('sort');
			sort = sort == 0 ? 1 : 0;
			this.model.save(null, {
				url: CONTEXT_PATH + '/web/system/toTop.do',
				type: 'post',
				context: this,
				data: {
					orgId: orgId,
					id: id,
					sort: sort
				},
				success: function(model, resp, options) {
					resp = _.extend({
						success: false,
						message: '操作失败'
					}, resp);

					if (resp.success == true) {
						alert('操作成功').delay(1);
						this.model.set({
							sort: sort
						});
					} else {
						alert(resp.message);
					}
				},
				error: function() {
					alert('操作失败');
				}
			});
		},
		doSetAsLeader: function() {
			var id = this.model.get('id');
			var isLeader = this.model.get('isLeader');
			isLeader = isLeader == 1 ? 0 : 1;
			this.model.save(null, {
				url: CONTEXT_PATH + '/web/system/updateAdmin.do',
				type: 'post',
				context: this,
				data: {
					id: id,
					isLeader: isLeader
				},
				success: function(model, resp, options) {
					resp = _.extend({
						success: false,
						message: '操作失败'
					}, resp);

					if (resp.success == true) {
						alert('操作成功').delay(1);
						this.model.set({
							isLeader: isLeader
						});
						this.hide();
					} else {
						alert(resp.message);
					}
				},
				error: function() {
					alert('操作失败');
				}
			});
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
			var data = this.model.serialize();
			var markup = this.template({
				model: data
			});
			this.$el.html(markup);
			this.$toggleOne = this.$('[data-do="toggleOne"]')
			return this;
		}
	});
	/*
	 * 表格
	 * 
	 * 监听集合的 reset 事件更新视图
	 */
	var dataTableRender = template($('#tmpl-dataTable').html());
	var DataTable = Backbone.View.extend({
		template: dataTableRender,
		noDataRender: template('<tr><td colspan="{{count}}">暂无数据</td></tr>'),
		loadingRender: template('<tr><td colspan="{{count}}">数据加载中...</td></tr>'),
		events: {
			'change [data-do="toggleAll"]': 'doToggleAll'
		},
		initialize: function() {
			this.listenTo(this.model, 'change:name', this.update);
			this.listenTo(this.collection, 'change:sort', this.refresh);
			this.listenTo(this.collection, 'reset', this.reset);
			this.listenTo(this.collection, 'request', this.request);
			this.listenTo(this.collection, 'sync', this.sync);
			this.listenTo(this.collection, 'error', this.error);
			this.listenTo(this.collection, 'destroy', this.refresh);
			this.listenTo(this.collection, 'select:one', this.syncToggle);

			this.orgAttrs = {
				companyId: this.model.get('companyId')
			}
		},
		addOne: function(model, collection, options) {
			model.set(this.orgAttrs);
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
					count: 9
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
			this.$items = this.$('[role="items"]');
			this.$toggleAll = this.$('[data-do="toggleAll"]');
		},
		update: function(model, value, collection) {
			this.collection.each(function(model) {
				model.set('orgName', value);
			});
		},
		request: function(collection) {
			if (collection instanceof Backbone.Collection) {
				var markup = this.loadingRender({
					count: 9
				});

				this.$items.empty().html(markup);
			}
		},
		error: function() {
			this.$items.html(this.noDataRender({
				count: 9
			}));
		},
		refresh: function() {
			var orgId = this.model.get('id');
			this.collection.refresh({
				data: {
					orgId: orgId
				}
			});
		},
		syncToggle: function(selected) {
			if (selected === false) {
				this.$toggleAll.prop('checked', false);
			} else {
				var length = this.collection.length;
				this.collection.each(function(model) {
					if (model.$selected === true)
						length--;
				});

				this.$toggleAll.prop('checked', length === 0);
			}
		},
		doToggleAll: function(event) {
			var checked = $(event.target).prop('checked');
			this.$toggleAll.prop('checked', checked);
			this.collection.each(function(model) {
				model.$selected = checked;
				model.trigger('toggle:select', checked, model);
			});
		}
	});

	function run() {
		$('.primary-nav').metisMenu();
		var orgList = new Backbone.Collection(null, {
			model: Org
		});

		var attrs = _.extend({
			id: COMPANY_ID,
			name: COMPANY_NAME,
			isRoot: true
		}, currentCompany);

		var company = new Company(attrs);
		orgList.add(company);

		var deptTree = new DeptTree({
			el: '#org-tree',
			model: company,
			collection: orgList
		});


		var orgUsers = new Backbone.Collection(null, {
			model: OrgUser
		});
		_.extend(orgUsers, {
			url: CONTEXT_PATH + '/web/system/users.do',
			parse: function(resp) {
				var parsed = _.extend({
					success: false,
					model: []
				}, resp);
				var items = _.isArray(parsed.model) ? parsed.model : [];
				_.each(items, function(item) {
					item.companyId = item.cid;
					delete item.cid;
				});
				return items;
			},
			refresh: function(options) {
				options = _.extend({
					type: 'post',
					parse: true,
					reset: true
				}, options);

				$('[data-do="toggleAll"]').prop('checked', false)

				this.fetch(options);
			},
			getSelection: function() {
				return this.filter(function(model) {
					return model.$selected
				});
			}
		});

		var list;
		deptTree.on('select:dept', function(org) {
			list instanceof OrgUserList && list.remove();
			var orgId = org.get('id');
			list = new OrgUserList({
				model: org,
				collection: orgUsers
			});

			list.render().$el.appendTo('#org-users');
			orgUsers.fetch({
				type: 'post',
				parse: true,
				reset: true,
				data: {
					orgId: orgId
				}
			});
		});

		Backbone.on('create:org', function(parentOrg) {
			var type = parentOrg.get('type');
			if (type == Org.TYPE_DEPT) {
				var attrs = parentOrg.pick('id', 'name', 'companyId', '$tId');
				attrs = {
					higherId: attrs.id,
					companyId: attrs.companyId,
					$pId: attrs.$tId
				}
				var modal = new OrgCreateModal({
					model: new Dept(attrs),
					collection: orgList
				});
				modal.render().$el.appendTo(document.body);
				modal.initForm();
				modal.show();
			} else if (type == Org.TYPE_CO) {
				var attrs = parentOrg.pick('id', 'name', 'companyId', '$tId');
				attrs = {
					higherId: 0,
					companyId: attrs.id,
					$pId: attrs.$tId
				}
				var modal = new OrgCreateModal({
					model: new Dept(attrs),
					collection: orgList
				});
				modal.render().$el.appendTo(document.body);
				modal.initForm();
				modal.show();
			}
		});

		Backbone.on('edit:org', function(model) {
			modal = new OrgEditModal({
				model: model
			});
			modal.render().$el.appendTo(document.body);
			modal.initForm();
			modal.show();
		});

		Backbone.on('sort:org', function(model) {
			modal = new OrgSortModal({
				model: model,
				collection: collection
			});
			modal.render().$el.appendTo(document.body);
			modal.initForm();
			modal.show();
		});

		Backbone.on('create:orgUser', function(org) {
			var data = org.pick('id', 'name', 'companyId');
			var attrs = {
				companyId: data.companyId,
				orgName: data.name,
				orgId: data.id
			}
			modal = new OrgUserCreateModal({
				model: new OrgUser(attrs),
				collection: orgUsers
			});
			modal.render().$el.appendTo(document.body);
			modal.initForm();
			modal.show();
		});

		Backbone.on('edit:orgUser', function(model) {
			modal = new OrgUserEditModal({
				model: model,
				collection: orgUsers
			});
			modal.render().$el.appendTo(document.body);
			modal.initForm();
			modal.show();
		});

		Backbone.on('import:orgUser', function(model) {
			modal = new OrgUserImportModal({
				model: model
			});
			modal.render().$el.appendTo(document.body);
			modal.show();
		});

		Backbone.on('sendSMS', function(model, selection) {
			modal = new SendSMSModal({
				className: 'modal-sms modal fade',
				model: model,
				collection: new Backbone.Collection(selection)
			});
			modal.render().$el.appendTo(document.body);
			modal.show();
		});
	}

	exports.run = run;
});