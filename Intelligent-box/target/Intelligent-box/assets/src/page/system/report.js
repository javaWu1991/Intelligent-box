define(function(require, exports) {
    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    require('bootstrap');

    require('metisMenu');
    var viewMap = {
        realtime: {
            url: report_domian + '/BDP-WEB/app/report/basic/basic!realtimeAnaly.action?SSO=cmoa&appid=' + report_appid
        },
        trend: {
            url: report_domian + '/BDP-WEB/app/report/basic/basic!trendAnaly.action?SSO=cmoa&appid=' + report_appid
        },
        activeUser: {
            url: report_domian + '/BDP-WEB/app/report/basic/basic!activeUser.action?SSO=cmoa&appid=' + report_appid
        },
        keepUser: {
            url: report_domian + '/BDP-WEB/app/report/basic/basic!keepUser.action?SSO=cmoa&appid=' + report_appid
        },
        payAnaly: {
            url: report_domian + '/BDP-WEB/app/report/basic/basic!payAnaly.action?SSO=cmoa&appid=' + report_appid
        },
        area: {
            url: report_domian + '/BDP-WEB/app/report/user/user!area.action?SSO=cmoa&appid=' + report_appid
        },
        terminalDi: {
            url: report_domian + '/BDP-WEB/app/report/user/user!terminalDi.action?SSO=cmoa&appid=' + report_appid
        }
    }

    var ReportView = Backbone.View.extend({
        initialize: function() {
            this.$wrapper = this.$('.wrapper-content').css('padding', 0);
            this.$iframe = this.$('#reportIframe');
            this.resize = _.debounce(_.bind(this._resize, this), 10);
            $(window).off('resize.reportview').on('resize.reportview', this.resize);
            this.resize();
            if (reportView == '') reportView = 'trend';
            if (_.isObject(viewMap[reportView])) {
                var url = viewMap[reportView]['url'];
                this.$iframe.attr('src', url);
            }
        },
        _resize: function() {
            var height = $(window).height() - 140;
            if (height < 400) height = 400;
            this.$wrapper.height(height);
        }
    });

    function run() {
        $('.primary-nav').metisMenu();
        new ReportView({
            el: '#page-wrapper'
        });
    }

    exports.run = run;
});