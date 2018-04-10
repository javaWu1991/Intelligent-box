define(function(require, exports, module) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var template = require('template');
	require('jquery-validate');
	var BaseForm = Backbone.View.extend({
		events: {
			'submit': 'onSubmit'
		},
		interval: 2000,
		timer: null,
		locked: false,
		initialize: function() {
			this.cacheEls();
			this._hideAlert = _.bind(this.hideAlert, this);
		},
		show: function() {
			this.$el.show();
		},
		hide: function() {
			this.$el.hide();
		},
		alert: function(message) {
			this.$alert.html(message).removeClass('hide');
			this.timer = setTimeout(this._hideAlert, this.interval);
		},
		lock: function(model, xhr, options) {
			this.locked = true;
		},
		done: function(model, response, options) {
			this.locked = false;
		},
		error: function(model, response, options) {
			this.alert('请求失败');
			// this.alert(response.statusText);
			this.locked = false;
		},
		hideAlert: function() {
			this.$alert.addClass('hide').empty();
		},
		onSubmit: function() {
			if (this.timer) {
				this.hideAlert();
				clearTimeout(this.timer);
			}
			if (!this.locked && this.$el.valid()) {
				var data = this.$el.serializeArray();
				this.model.fetch({
					type: 'post',
					dataType: 'json',
					data: data
				});
			}
			return false;
		},
		done: function(model, response, options) {
			_.defaults(response, {
				success: false,
				model: '',
				message: '设置失败'
			});
			if (response.success) {
				window.location.href = CONTEXT_PATH + '/web/system/welcome.htm';
			} else {
				this.alert(response.message);
			}
		},
		cacheEls: function() {
			this.$alert = this.$('.alert-company');
			this.$company = this.$('#company');
		}
	});
	var LoginForm = BaseForm.extend({
		initialize: function() {
			LoginForm.__super__.initialize.apply(this, arguments);
			this.$el.validate({
				errorClass: 'error',
				rules: {
					'account': {
						required: true
					},
					'password': {
						required: true
					}
				},
				messages: {
					'account': {
						required: '请输入手机号码'
					},
					'password': {
						required: '请输入登录密码'
					}
				}
			});

			this.model.url = this.$el.attr('action');
			this.listenTo(this.model, 'request', this.lock);
			this.listenTo(this.model, 'sync', this.done);
			this.listenTo(this.model, 'error', this.error);
		},
		cacheEls: function() {
			this.$alert = this.$('.alert-login');
		}
	});

	var CompanyForm = BaseForm.extend({
		initialize: function() {
			CompanyForm.__super__.initialize.apply(this, arguments);
			if (!this.model) {
				this.model = new Backbone.Model;
			}
			this.model.url = this.$el.attr('action');
			this.listenTo(this.model, 'request', this.lock);
			this.listenTo(this.model, 'sync', this.done);
			this.listenTo(this.model, 'error', this.error);
		},
		onSubmit: function() {
			if (this.timer) {
				this.hideAlert();
				clearTimeout(this.timer);
			}
			if (!this.locked) {
				var companyId = this.$company.val();
				var model = this.collection.get(companyId);
				if (model) {
					// var data = model.toJSON();
					this.model.fetch({
						type: 'post',
						data: {
							id: model.get('id'),
							name: model.get('name'),
							roleId: model.get('roleId')
						}
					});
				}
			}
			return false;
		},
		done: function(model, response, options) {
			_.defaults(response, {
				success: false,
				model: '',
				message: '设置失败'
			});
			if (response.success) {
				window.location.href = CONTEXT_PATH + '/web/system/welcome.htm';
			} else {
				this.alert(response.message);
			}
		},
		cacheEls: function() {
			this.$alert = this.$('.alert-company');
			this.$company = this.$('#company');
		}
	});

	var Company = Backbone.Model.extend({
		idAttribute: 'dataId',
		defaults: {
			dataId: null,
			id: null,
			roleId: null,
			companyName: '未命名'
		}
	})

	function run() {
		var model = new Backbone.Model;
		var loginForm = new LoginForm({
			el: '#form-login',
			model: model
		});

		var companyCollection = new Backbone.Collection(null, {
			model: Company
		});
		var groupForm = new CompanyForm({
			el: '#form-company',
			collection: companyCollection
		});

		model.on('sync', function(model, response, options) {
			_.defaults(response, {
				success: false,
				message: '登录失败',
				model: []
			});
			if (!response.success) {
				loginForm.alert(response.message);
			} else {
				loginForm.hide();

				var data = response.model;
				var item;
				var markup = [];

				if (_.isArray(data)) {
					_.each(data, function(model) {
						model.dataId = _.uniqueId('c');
					});
					companyCollection.reset(data);
				}
				companyCollection.each(function(model) {
					var item = model.toJSON();
					markup.push('<option value="' + item.dataId + '">' + item.name + '</option>');
				});
				$('#company').html(markup.join(''));

				groupForm.show();
			}
		});
	}

	exports.run = run;
});