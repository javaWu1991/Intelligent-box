<%@ page language="java" pageEncoding="utf-8"%>
<%--
配置项
1、系统配置，由后台输出至页面
2、seajs 配置
--%>
<script id="config">
	var report_domian = '${ADAUrl}';
	var SourceUrl = '${SourceUrl}';
	var myDate = new Date();
	var creteDate = myDate.toLocaleString();
	var report_appid = '650';
	var CONTEXT_PATH = '<c:out value="${contextPath}"/>';
	var COMPANY_ID = '<c:out value="${sessionScope.companyId}"/>';
	var IS_SUPER = '<c:out value="${sessionScope.isSuper}"/>';
	IS_SUPER = IS_SUPER == 'true';
	var COMPANY_NAME = '<c:out value="${sessionScope.companyName}"/>';
	var USER_NAME = '<c:out value="${sessionScope.userName}"/>';
	var SEA_CONFIG = {
		debug : true,
		base : CONTEXT_PATH + '/assets',
		paths : {
			'page' : 'src/page',
			'component' : 'src/component',
			'util' : 'src/component/util'
		},
		alias : {
			'jquery' : 'dep/jquery/1.11.2/jquery.js',
			'jqueryui' : 'dep/jquery-ui/jquery-ui.min.js',
			'bootstrap' : 'dep/bootstrap/3.3.6/js/bootstrap-cmd',
			'underscore' : 'dep/underscore/1.8.3/cmd/underscore-min',
			'backbone' : 'dep/backbone/1.3.3/backbone.min',
			'bootstrap-daterangepicker' : 'dep/bootstrap-daterangepicker/2.1.14/daterangepicker',
			'bootstrap-moment' : 'dep/bootstrap-daterangepicker/2.1.14/moment',
			'moment' : 'dep/moment/2.13.0/moment',

			'video' : 'dep/video/5.8.0/video.min',
			'unslider' : 'dep/unslider/2.0/dist/js/unslider-min',
			'underscore' : 'dep/underscore/1.8.3/underscore',

			'plupload' : 'dep/plupload/2.1.3/js/plupload.full.min.js',
			'jquery-slimScroll' : 'dep/jquery-slimscroll/1.3.7/jquery.slimscroll',
			'jquery-placeholder' : 'dep/jquery-placeholder/2.1.2/jquery.placeholder.min',

			'jquery-validate' : 'dep/jquery-validation/1.15.0/jquery.validate.min',
			'jquery-validate-additional' : 'dep/jquery-validation/1.15.0/additional-methods.min',

			'calendar' : 'dep/calendar/calendar',
			'bootstrap-datetimepicker' : 'dep/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
			'bootstrap-datetimepicker-zh-CN' : 'dep/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',

			'ztree' : 'dep/zTree/js/jquery.ztree.core',
			'ztree-excheck' : 'dep/zTree/js/jquery.ztree.excheck',
			'umeditor' : 'dep/umeditor/umeditor',
			'umeditor-config' : 'dep/umeditor/umeditor.config',
			'umeditor-lang' : 'dep/umeditor/lang/zh-cn/zh-cn',
			'jquery-form' : 'dep/jquery-form/jquery.form',
			'metisMenu' : 'dep/metisMenu/metisMenu.min',

			'md5' : 'util/md5',
			'cookie' : 'util/cookie',
			'parseQueryString' : 'util/parseQueryString',
			'template' : 'util/template',
			'walkList' : 'util/walkList',
			'jquery-util' : 'util/jquery-util',
			'csrf' : 'util/csrf',
			'json2' : 'dep/shim/json2'
		}
	};
</script>
