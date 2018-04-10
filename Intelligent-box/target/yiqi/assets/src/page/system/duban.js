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
})