'use strict';
define(function(require, exports) {
    var $ = require('jquery');
    require('jquery-form');
    require('jquery-util');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var alert = require('component/Alert');
    var FormModal = require('component/FormModal');
    var template = require('template');
    require('jquery-validate');
    require('jquery-validate-additional');
    Backbone.emulateHTTP = true;

    /*
     ** randomWord 产生任意长度随机字母数字组合
     ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
     */

    function randomWord(randomFlag, min, max) {
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            var pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }

    jQuery.validator.addMethod("notEmpty", function(value, element) {
        return this.optional(element) || $.trim(value) !== '';
    }, "不能为空");

    var AppInputModal = FormModal.extend({
        TokenBotton: function() {
            var random = randomWord(false, 12);
            $("#inputToken").val(random);
            return false;
        },
        EncodingAESkey: function() {
            var random = randomWord(false, 12);
            $("#inputAESkey").val(random);
            return false;
        },
        submit: function(event) {
            var $target = $(event.target);
            var isNew = this.model.isNew();
            var isInside = this.model.get('isInside');
            var data = this.$form.serializeObject();
            var loginMobile = 0;
            var loginUserid = 0;
            var loginChannel = 0;
            if (data.loginMobile) {
                loginMobile = 1;
            } else {
                loginMobile = 0;
            };
            if (data.loginUserid) {
                loginUserid = 1;
            } else {
                loginMobile = 0;
            };
            if (data.loginChannel) {
                loginChannel = 1;
            } else {
                loginChannel = 0;
            };
            var url = CONTEXT_PATH + '/web/apply/updateApply.do';
            if (isNew) url = CONTEXT_PATH + '/web/apply/addApply.do';
            if (this.$form.valid()) {
                this.$form.ajaxSubmit({
                    url: url,
                    context: this,
                    beforeSend: function() {
                        $target.prop('disabled', true);
                        $('[data-dismiss="modal"]').prop('disabled', true);
                    },
                    data: {
                        isopen: 1,
                        loginMobile: loginMobile,
                        loginUserid: loginUserid,
                        loginChannel: loginChannel
                    },
                    success: function(resp) {
                        resp = _.extend({
                            success: false,
                            message: '操作失败'
                        }, resp);
                        if (resp.success) {
                            alert('操作成功').delay(1);
                            this.collection.refresh();
                            this.hide();
                        } else {
                            if (resp.message == '') resp.message = '操作失败';
                            alert(resp.message);
                        }
                    },
                    error: function() {
                        alert('操作失败');
                    },
                    complete: function() {
                        $target.prop('disabled', false);
                        $('[data-dismiss="modal"]').prop('disabled', false);
                    }
                });

            }
        }
    });

    function initForm() {
        this.$form.validate({
            errorPlacement: function(error, element) {
                if (element.is(":radio"))
                    error.appendTo(element.parent().parent());
                else if (element.is(":checkbox"))
                    error.appendTo(element.parent().parent());
                else
                    error.appendTo(element.parent());
            },
            ignore: '',
            rules: {
                type: {
                    required: true,
                    digits: true,
                    range: [1, 4],
                },
                isopen: {
                    required: true,
                    digits: true,
                    range: [0, 1],
                },
                version: {
                    required: true,
                    notEmpty: true,
                    maxlength: 20
                },
                isInside: {
                    required: true,
                    digits: true,
                    range: [0, 1],
                },
                name: {
                    required: true,
                    notEmpty: true,
                    rangelength: [1, 6]
                },
                intro: {
                    required: true,
                    notEmpty: true,
                    maxlength: 500
                },
                applyprocedure: {
                    required: true
                },
                icoFile: {
                    required: {
                        depends: function(element) {
                            var value = $.trim($(element).data('value'));
                            return value === '';
                        }
                    },
                    accept: 'image/*'
                }
            },
            messages: {
                type: {
                    required: '必填项'
                },
                isopen: {
                    required: '必填项',
                    range: $.validator.format("请输入0和1"),
                },
                version: {
                    required: '必填项',
                    notEmpty: '请输入字符',
                    maxlength: $.validator.format("最多可输入20个字符"),
                },
                isInside: {
                    required: '必填项',
                    range: $.validator.format("请输入0和1"),
                },
                name: {
                    required: '必填项',
                    notEmpty: '请输入字符',
                    rangelength: '不超过6个字符'
                },
                intro: {
                    required: '必填项',
                    notEmpty: '请输入字符',
                    maxlength: $.validator.format("最多可输入500个字符"),
                },
                applyprocedure: {
                    required: '必填项'
                },
                icoFile: {
                    required: '请上传图标',
                    accept: '请上传图片'
                }
            }
        });
    }

    var androidInputModalRender = template($('#tmpl-androidInputModal').html());
    var AndroidInputModal = AppInputModal.extend({
        template: androidInputModalRender,
        initForm: initForm
    });
    var iOSInputModalRender = template($('#tmpl-iOSInputModal').html());
    var iOSInputModal = AppInputModal.extend({
        template: iOSInputModalRender,
        initForm: initForm
    });
    var h5InputModalRender = template($('#tmpl-h5InputModal').html());
    var H5InputModal = AppInputModal.extend({
        template: h5InputModalRender,
        initForm: initForm
    });
    var fwInputModalRender = template($('#tmpl-fwInputModal').html());
    var FWInputModal = AppInputModal.extend({
        template: fwInputModalRender,
        initForm: initForm
    });

    return {
        AndroidInputModal: AndroidInputModal,
        iOSInputModal: iOSInputModal,
        H5InputModal: H5InputModal,
        FWInputModal: FWInputModal
    };
})