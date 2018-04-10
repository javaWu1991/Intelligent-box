define(function (require, exports, module) {
    var $ = require('jquery'),
        _ = require('underscore');
    var template = require('template');
    var formInit = require('../../../component/mobile/form');
    var url = 'reportdata.do?type=qj';

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

    var testdata = [
        {
            '1': 66, '2': 33, '3': 28, '4': 99, '5': 87, '6': 112,
            '7': 14, '8': 57, '9': 19, '10': 41, '11': 48, '12': 89
        },
        {
            '1': 36, '2': 73, '3': 48, '4': 59, '5': 67, '6': 32,
            '7': 44, '8': 77, '9': 79, '10': 61, '11': 38, '12': 103
        }
    ];

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

    var parseData = function (data) {
        var month = [], days = [], people = [],
            tableData = [];
        for (var i = 1; i <= 12; i++) {
            month.push(i);
            days.push(data[0][i] || 0);
            people.push(data[1][i] || 0);
            tableData.push({
                month: i,
                days: data[0][i] || 0,
                people: data[1][i] || 0
            });
        }

        var chartData = {
            title: {
                show: false,
                text: '请假报表'
            },
            backgroundColor: '#fff',
            tooltip: {},
            legend: {
                show: true,
                data: ['天数', '人数']
            },
            xAxis: {
                data: month
            },
            yAxis: {},
            series: [{
                name: '天数',
                type: 'line',
                showSymbol: false,
                data: days
            }, {
                name: '人数',
                type: 'line',
                showSymbol: false,
                data: people
            }]
        };

        return  { table: tableData, chart: chartData };
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
                    var data = parseData(list);
                    var html = tableRender({list: data.table});
                    $('.report-table tbody').html(html);
                    myChart.setOption(data.chart);
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
