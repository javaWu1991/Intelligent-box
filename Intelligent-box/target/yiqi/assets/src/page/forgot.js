define(function(require, exports, module) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var template = require('template');
	require('jquery-validate');
	require('jquery-util');
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
				var data = this.$el.serializeObject();

				this.model.fetch({
					type: 'post',
					dataType: 'json',
					data: data
				});
			}
			return false;
		},
		cacheEls: function() {

		}
	});

	$.validator.addMethod('mobile', function(value, element) {
		return this.optional(element) || value.length == 11 && (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i).test(value);
	});

	var ForgotForm = BaseForm.extend({
		events: {
			'submit': 'onSubmit',
			'click [data-do="get-code"]': 'doGetCode'
		},
		initialize: function() {
			ForgotForm.__super__.initialize.apply(this, arguments);
			this.validator = this.$el.validate({
				errorClass: 'error',
				errorPlacement: function(error, element) {
					if (element.attr('name') == 'code') {
						error.appendTo(element.parent());
					} else {
						error.insertAfter(element);
					}
				},
				rules: {
					account: {
						required: true,
						mobile: true
					},
					code: {
						required: true,
						digits: true
					},
					pass: {
						required: true,
						rangelength: [6, 16]
					},
					confirmPass: {
						equalTo: "#newPassword"
					}
				},
				messages: {
					account: {
						required: '必填项',
						mobile: '格式不正确'
					},
					code: {
						required: '必填项',
						digits: '请输入数字'
					},
					pass: {
						required: '请输入密码',
						rangelength: '密码字符数6-16位'
					},
					confirmPass: {
						equalTo: '两次输入的密码不一致'
					}

				}
			});

			this.model.url = this.$el.attr('action');
			this.listenTo(this.model, 'request', this.lock);
			this.listenTo(this.model, 'sync', this.done);
			this.listenTo(this.model, 'error', this.error);
		},
		cacheEls: function() {
			this.$alert = this.$('.alert-form');
			this.$smsTime = this.$('#inputSMSTime');
			this.$valiCode = this.$('#inputValiCode');
			this.$mobile = this.$('#inputAccount');
			this.$getCodeBtn = this.$('[data-do="get-code"]');

		},
		timer: null,
		lockInterval: 30,
		lock: false,
		doGetCode: function(event) {
			if (this.lock) return false;

			var m = $.trim(this.$mobile.val());

			if (!(/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i).test(m)) {
				this.validator.showErrors({
					account: '请输入手机号码'
				});
			} else {
				var url = CONTEXT_PATH + '/api/sms/verification/' + this.$mobile.val();
				$.ajax({
					url: url,
					context: this,
					dataType: 'json',
					beforeSend: function() {
						this.lock = true;
					},
					success: function(resp) {
						resp = _.extend({
							success: false,
							message: '发送失败，请重试',
							model: ''
						}, resp);

						if (resp.success) {
							this.$getCodeBtn.html('已发送');
							this.lockAction();

							var model = resp.model;
							model = model.split('@@@');
							if (model.length != 2) model = ['', ''];
							this.$smsTime.val(model[0]);
							this.$valiCode.val(model[1]);
						} else {
							this.alert('发送失败，请重试');
							this.lock = false;
						}
					},
					error: function() {
						this.alert('发送失败，请重试');
						this.lock = false;
					}
				})
			}
		},
		lockLoop: function() {
			if (this.count <= 0) {
				clearInterval(this.timer);
				this.$getCodeBtn.html('获取验证码');
				this.lock = false;
			} else {
				this.$getCodeBtn.html('重新获取(' + (this.count--) + 's)');
			}
		},
		lockAction: function() {
			this.count = this.lockInterval;
			this.timer = setInterval(_.bind(this.lockLoop, this), 1000);
		}
	});

	function run() {
		var model = new Backbone.Model;
		var soleForm = new ForgotForm({
			el: '#sole-form',
			model: model
		});


		model.on('sync', function(model, response, options) {
			_.defaults(response, {
				success: false,
				message: '修改失败',
				model: []
			});
			if (!response.success) {
				soleForm.alert(response.message);
			} else {
				soleForm.hide();
				$('.forsuccess').show();
			}
		});
	}

	exports.run = run;
});