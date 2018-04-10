<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/src/css/duban/need/laydate.css" />
<link rel="stylesheet" href="${contextPath}/assets/src/css/page.css" />
<style type="text/css">
	.laydate_top{
		background: #FFFFFF;
	}
	#laydate_table{
		background: #FFFFFF;
	}
</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="督办导出" />
        
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">督办列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            开始时间：<input type="text" class="form-control inputName" id="startTime" name="startTime" placeholder="请输入时间">
                        </div>
                        <div class="form-group">
                            结束时间：<input type="text" class="form-control inputMobile" id="endTime" name="endTime" placeholder="请输入时间">
                        </div>
                        <div class="form-group">
                           	<select class="form-control" name="status" id="status">
                                <option value="">请选择督办状态</option>
                                <option value="1">进行中</option>
                                <option value="2">已完成</option>
                                <option value="3">已到期</option>                               
                            </select>
                        </div>
                        <div class="form-group">
                        <button type="button" class="btn btn-default sousuo">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                        <a type="button" class="btn btn-default export" href="${contextPath}/web/supervise/exportSupervise.do">导出</a>
                        </div>
                    </form>
                    <hr />                                       
                    <table id="sole-table" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>事项</th>
                                <th>完成时限</th>  
                                <th>工作要求</th>
                                <th>落实处室</th>
                                <th>督办来源</th>
                                <th>督办日期</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody role="items" id="detail">
                            
                        </tbody>
                    </table>                   
                 <ul class="page" maxshowpageitem="5" pagelistcount="10"  id="page"></ul>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>

<script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="${contextPath}/assets/src/page/duban/laydate.dev.js"></script>
<script src="${contextPath}/assets/src/page/system/page.js"></script>
<script src="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="${contextPath}/assets/src/page/system/dubanExport.js"></script>
<script>seajs.use('page/system/duban', function(page){ page.run(); });</script>
</body>
</html>