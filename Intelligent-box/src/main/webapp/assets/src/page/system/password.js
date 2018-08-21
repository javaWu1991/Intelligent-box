define(function(require, exports, module) {
	var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('jquery-form');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
	var Backbone = require('backbone');
	var template = require('template');
	require('jquery-validate');
    require('bootstrap');
    require('metisMenu');

	 var BaseForm = Backbone.View.extend({
	        id: function() {
	            return this.cid;
	        },
	        events: {
	            'click [data-do="submit"]': 'submit'
	        },
	        initialize: function() {
	            this.cacheEls();
	        },
	        submit: function() {
	            // override
	        },
	        cacheEls: function() {
	            this.$form = this.$el;
	        }
	    });
	
	    var PasswordForm = BaseForm.extend({
	        submit: function() {
	            var params = this.$form.serializeObject();
	            this.$form.ajaxSubmit({
	                url: CONTEXT_PATH + '/web/system/updatePassword.do',
	                context: this,
	                success: function(resp) {
	                    resp = _.extend({
	                        success: false,
	                        message: '操作失败'
	                    }, resp);

	                    if (resp.success) {
	                        this.model.set(params);
	                        alert('操作成功').delay(1);
	                    } else {
	                        alert(resp.message);
	                    }
	                },
	                error: function() {
	                    alert('操作失败');
	                }
	            });
	        }
	    });
	

	function run() {
		 $('.primary-nav').metisMenu();
		var model = new Backbone.Model;
		var passwordForm = new PasswordForm({
			el : '#form-password',
			model : model
		});
	}

	exports.run = run;
});