define(function(require, exports, module) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var template = require('template');
    var AreaPicker = require('component/AreaPicker');
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
				var data = this.$el.serializeObject();

				var areaData = this.areaPicker.getSelection();

                var p = areaData[0];
                var c = areaData[1];
                var a = areaData[2];

                _.extend(data, {
                    areaId: a.id,
                    areaName: a.name,
                    cityId: c.id,
                    cityName: c.name,
                    provinceId: p.id,
                    provinceName: p.name,
                });

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

	$.validator.addMethod('code', function(value, element) {
		var m = $.trim($('#inputMobile').val());
		var smsTime = $('#inputSMSTime').val();
		return this.optional(element) || value.length == 11 &&
			(/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i).test(value);
	});

	var RegisterForm = BaseForm.extend({
		events: {
			'submit': 'onSubmit',
			'click [data-do="get-code"]': 'doGetCode'
		},
		initialize: function() {
			RegisterForm.__super__.initialize.apply(this, arguments);
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
					mobile: {
						required: true,
						mobile: true
					},
					code: {
						required: true,
						digits: true
					},
					password: {
						required: true,
						rangelength: [6, 16]
					},
					confirmPassword: {
						equalTo: "#inputPassword"
					},
					email: {
						required: true,
						email: true
					},
					companyName: {
						required: true
					},
					detailAddress: {
						required: true
					},
					name: {
						required: true
					}
				},
				messages: {
					mobile: {
						required: '必填项',
						mobile: '格式不正确'
					},
					code: {
						required: '必填项',
						digits: '请输入数字'
					},
					password: {
						required: '请输入密码',
						rangelength: '密码字符数6-16位'
					},
					confirmPassword: {
						equalTo: '两次输入的密码不一致'
					},
					email: {
						required: '必填项',
						email: '格式不正确'
					},
					companyName: {
						required: '必填项'
					},
					detailAddress: {
						required: '必填项'
					},
					name: {
						required: '必填项'
					}
				}
			});

			this.model.url = this.$el.attr('action');
			this.areaPicker = new AreaPicker({
                el: this.$('.area-picker')
            });
			this.listenTo(this.model, 'request', this.lock);
			this.listenTo(this.model, 'sync', this.done);
			this.listenTo(this.model, 'error', this.error);
		},
		cacheEls: function() {
			this.$alert = this.$('.alert-form');
			this.$smsTime = this.$('#inputSMSTime');
			this.$valiCode = this.$('#inputValiCode');
			this.$mobile = this.$('#inputMobile');
			this.$getCodeBtn = this.$('[data-do="get-code"]');
		},
		timer: null,
		lockInterval: 30,
		doGetCode: function(event) {
			var m = $.trim(this.$mobile.val());
			if (!(/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i).test(m)) {
				this.validator.showErrors({
					mobile: '请输入手机号码'
				});
			} else {
				var url = CONTEXT_PATH + '/api/sms/verification/' + this.$mobile.val();
				$.ajax({
					url: url,
					context: this,
					dataType: 'json',
					beforeSend: function() {
						this.$getCodeBtn.prop('disabled', true);
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
							if (model.length != 2) {
								this.alert('验证码获取失败，请重试');
							} else {
								this.$smsTime.val(model[0]);
								this.$valiCode.val(model[1]);
							}
						} else {
							this.alert('发送失败，请重试');
							this.$getCodeBtn.prop('disabled', false);
						}
					},
					error: function() {
						this.alert('发送失败，请重试');
						this.$getCodeBtn.prop('disabled', false);
					}
				})
			}
		},
		lockLoop: function() {
			if (this.count <= 0) {
				clearInterval(this.timer);
				this.$getCodeBtn.html('获取验证码').prop('disabled', false);
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
		var soleForm = new RegisterForm({
			el: '#sole-form',
			model: model
		});

		model.on('sync', function(model, response, options) {
			_.defaults(response, {
				success: false,
				message: '注册失败',
				model: []
			});
			if (!response.success) {
				soleForm.alert(response.message);
			} else {
				soleForm.hide();
				$('.regsuccess').show();
			}
		});
	}

	exports.run = run;
});