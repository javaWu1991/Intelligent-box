define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');
    var formInit = require('../../../component/mobile/form');
    var url = 'reportdata.do?type=cc';

    var setdata = {
        control: [{
            'describeName': '部门',
            'isRequired': false,
            'reName': 'orgid',
            'sequence': 100,
            'controlId': 'DepartmentField',
            'exp': '请选择',
            'value': '',
            'jsonData': ''
        }]
    };
    var tableRender = template($('#tmpl-vacate').html());

    var formatDate = function (date) {
        return date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2);
    };
    var setDefaultData = function ($form) {
        var date = new Date();
        var enddate = formatDate(date);
        date.setMonth(date.getMonth() - 1);
        var startdate = formatDate(date);

        $form.find('[name=startdate]').val(startdate);
        $form.find('[name=enddate]').val(enddate);
    };
    var run = function () {
        var $form = $('.search-form');
        formInit($form, setdata);

        var myChart = echarts.init($('.report-chart')[0]);
        $('.search-button').on('click', function () {
            if ($('[name=orgid]').val() === '') {
                alert('请先选择部门!'); return;
            }
            var query = $form.serializeArray();

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                data: query,
                success: function (res) {
                    var list = JSON.parse(res.message);
                    var html = tableRender({ list: list });
                    $('.report-table tbody').html(html);

                    var option = {
                        title: {
                            show: false,
                            text: '出差报表'
                        },
                        backgroundColor: '#fff',
                        tooltip: {},
                        legend: {
                            show: true,
                            data: ['人数']
                        },
                        xAxis: {
                            data: _.map(list, function (item, key) { return key; })
                        },
                        yAxis: {},
                        series: [{
                            name: '人数',
                            type: 'bar',
                            data: _.map(list, function (item, key) { return item; })
                        }]
                    };
                    myChart.setOption(option);
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
