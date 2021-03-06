define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var formInit = require('../../../component/mobile/form');

    var testdata = {
        control: [
            {
        		'describeName': '领用明细',
        		'isRequired': false,
        		'reName': 'receiveTable',
        		'sequence': 100,
        		'controlId': 'TableField',
        		'exp': '新增入库明细',
        		'value': '',
        		'jsonData': ''
        	}, {
        		'describeName': '申请人',
        		'isRequired': true,
        		'reName': 'appName',
        		'sequence': 101,
        		'controlId': 'TextField',
        		'exp': '请输入',
        		'value': '',
        		'jsonData': ''
        	}, {
        		'describeName': '产品名称',
        		'isRequired': true,
        		'reName': 'productName',
        		'sequence': 102,
        		'controlId': 'TextField',
        		'exp': '请输入',
        		'value': '',
        		'jsonData': ''
        	}, {
        		'describeName': '规格',
        		'isRequired': false,
        		'reName': 'size',
        		'sequence': 103,
        		'controlId': 'TextField',
        		'exp': '请输入',
        		'value': '',
        		'jsonData': ''
        	}, {
        		'describeName': '数量',
        		'isRequired': false,
        		'reName': 'number',
        		'sequence': 104,
        		'controlId': 'NumberField',
        		'exp': '请输入',
        		'value': '',
        		'jsonData': ''
        	}, {
        		'describeName': '备注',
        		'isRequired': false,
        		'reName': 'remark',
        		'sequence': 105,
        		'controlId': 'TextareaField',
        		'exp': '请输入',
        		'value': '',
        		'jsonData': ''
        	}, {
                'describeName': '审批人',
                'sequence': 900,
                'reName': 'manager',
                'controlId': 'ApproveSelect'
            }
        ]
    };

    var buildModel = function (form) {
        var model = [];
        form.find('.table-box').each(function () {
            var temp = {};
            $(this).find('[name]').each(function (index, item) {
                temp[$(item).attr('name')] = $(item).val();
            });
            model.push(temp);
        });

        return JSON.stringify(model);
    };

    var run = function () {
        var $form = $('.content-form');
        formInit($form, testdata);

        $('.submit').on('click', function () {
            var valid = $form.checkRequired();
            if (!valid.success) {
                alert(valid.message); return;
            }

            var model = buildModel($form);
            var boxes = $form.find('.table-box').remove();
            var formdata = $form.serializeArray();
            $form.find('.table-container').append(boxes);
            formdata.push({ name: 'model', value: model });
            formdata.push({ name: 'userId', value: G.userId });
            formdata.push({name:'companyId',value: G.companyId});

            $.ajax({
                url: '../workFlow/start/outStorage.do',
                type: 'post',
                dataType: 'json',
                data: formdata,
                success: function (res) {
                    if (res.success) {
                        alert('提交成功！');
                    }
                    else {
                        alert(res.message);
                    }
                },
                error: function () {
                    alert('发生错误，请稍后再试！');
                }
            });
        });

        $('.header .back').on('click', function () {
            history.back();
        });
    };

    module.exports = {
        run: run
    };
});
