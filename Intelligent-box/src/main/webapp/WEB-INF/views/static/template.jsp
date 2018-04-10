<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/taglibs.jsp"%>
<%@ include file="../common/vars.jsp"%>
<!doctype html>
<html class="no-js" lang="">
<head>
<%@ include file="../common/mobile/head.jsp"%>
<title></title>
<%@ include file="../common/mobile/header-scripts.jsp"%>
</head>
<body>
<h1 class="block-title">
	<a class="pull-left" href="javascript:">取消</a>
	表单页面
	<a class="pull-right" href="javascript:">提交</a>
</h1>

<div class="block-body">
	<form class="form form-vertical">
		<div class="row">
			<label class="control-label col-xs-3">审批编号</label>
			<div class="col-xs-9">
				<input class="form-control" type="text" placeholder="请填写审批编号" />
			</div>
		</div>
		<div class="row">
			<label class="control-label col-xs-3">选择输入</label>
			<div class="col-xs-9 select-wrapper">
				<input type="hidden" name="" />
				<div class="input-group">
					<input class="form-control" type="text" placeholder="请选择(必填)" />
					<span class="input-group-addon pull-arrow">&gt;</span>
				</div>
				<ul class="pull-select">
					<li class="selected" data-value="" >all</li>
					<li class="" data-value="1" >中国</li>
					<li class="" data-value="2" >亚洲</li>
				</ul>
			</div>
		</div>
		<div class="row">
			<label class="control-label col-xs-3">日期</label>
			<div class="col-xs-9">
				<input class="form-control" type="text" readonly="readonly" value="2016-08-28" />
			</div>
		</div>
		<div class="row">
			<label class="control-label col-xs-3">审批编号</label>
			<div class="col-xs-9">
				<p class="form-static">123456</p>
			</div>
		</div>
		<div class="row">
			<label class="control-label col-xs-3">选择输入</label>
			<div class="col-xs-9">
				<p class="form-static">中国</p>
			</div>
		</div>
		<div class="row">
			<label class="control-label col-xs-3">日期</label>
			<div class="col-xs-9">
				<p class="form-static">2016-08-28</p>
			</div>
		</div>
	</form>
</div>

<div class="block-body">
	<h2>已选择人员(10)</h2>
	<div class="headers-wrapper block-content">
		<img src="" alt="" class="header"/>
		<img src="" alt="" class="header" />
		<img src="" alt="" class="header" />
		<img src="" alt="" class="header" />
	</div>
</div>

<div class="block-body">
	<h2>test</h2>
	<div class="block-content">
		<button type="button" id="modal_alert" class="btn btn-primary" >这是一个信息对话框</button>
		<button type="button" id="modal_comfirm" class="btn btn-primary" >这是一个确认对话框</button>
	</div>	
</div>

<%@ include file="../common/mobile/footer-scripts.jsp"%>
<script type="text/javascript">

(function($){

	layer.config({
	  extend: ['skin/myskin/style.css'], //加载您的扩展样式
	  skin: 'layer-ext-myskin'
	});

	$('#modal_alert').on('click', function(){
		// layer.open({
		// 	area: ['300px', '200px'],
		// 	shadeClose: true, //点击遮罩关闭
		// 	content: '你的操作已经生效'
		// });
		layer.alert('你的操作已经生效');
	});

	$('#modal_comfirm').on('click', function(){
		layer.confirm('确定提交给：杭小研');
	});

	//多个的时候以wrapper为单位
	var $wrapper = {};
	$('.pull-arrow').on('click', function(){
		$wrapper = $(this).parent().parent();
		$wrapper.find('.pull-select').show();
	});

	$('.pull-select').on('click', 'li', function(){
		var $this = $(this),
			value= $this.data('value'),
			name = $this.html();
		$wrapper.find('.pull-select').hide();
		$wrapper.find('input[type=hidden]').val(value);
		$wrapper.find('input[type=text]').val(name);
	});
})($);
</script>
</body>
</html>
