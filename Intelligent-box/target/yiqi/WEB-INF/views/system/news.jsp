<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<link href="//cdn.bootcss.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" media="all" href="${contextPath}/assets/dep/bootstrap-daterangepicker/2.1.14/daterangepicker.css"/>
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow:auto;height:300px;}
.demo i {
    position: absolute;
    left: 8px;
    top: 35px;
    cursor: pointer;
}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="滚动消息" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">滚动消息</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group"> 公告状态：<select class="form-control" name="status">
                                <option value="0">全部</option>
                                <option value="1">未上线</option>
                                <option value="2">已上线</option>
                                <option value="3">已下线</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="title" placeholder="内容">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="btn-group" role="group">
                        <a href="javascript:void(0);" class="btn btn-default" data-do="create:notice"><span class="fa fa-plus" aria-hidden="true"></span> 新建滚动消息</a>
                    </div>
                    <br>
                    <br>
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>消息内容</th>
                                <th>发送对象</th>
                                <th>显示时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items"></tbody>
                    </table>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/news', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-noticeCreateModal">
<div class="modal-dialog" style="width:760px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建滚动消息</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-sm-7 col-md-7">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">滚动消息内容<i class="required">*</i></label>
                            <textarea class="form-control" id="inputTitle" name="title" placeholder="填写滚动消息内容"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="inputDate" class="control-label">显示时间<i class="required">*</i></label>
                            <div class="input-prepend demo"><input readonly="readonly" type="text" data-ui="datatimerange" class="form-control" style="padding:0 6px 0 28px"><i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5 col-md-5">
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人<i class="required">*</i></label>
                            <div class="org">
                                <ul class="ztree dept-tree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit" id="save_news_btn">保存</button>
        </div>
    </div>
</div>
</script>
<script type="text/html" id="tmpl-item">
<td width="50" class="col-index">{{model.index}}</td>
<td width="200"><div class="longtext" style="width:200px;">{{model.title}}</div></td>
<td width="300"><div class="longtext" data-toggle="tooltip" title="{{model.sender}}" style="width:300px">{{model.sender}}</div></td>
<td width="320">{{model.createTimeText}}||{{model.modifyTimeText}}</td>
<td width="60">{{model.statusText}}</td>
<td class="col-actions">
    <a href="javascript:void(0);" data-do="edit">编辑</a>
    <a href="javascript:void(0);" data-do="delete">删除</a>
</td>
</script>
<script type="text/template" id="tmpl-noticeEditModal">
<div class="modal-dialog" style="width:760px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑滚动消息</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-sm-7 col-md-7">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">滚动消息内容<i class="required">*</i></label>
                            <textarea class="form-control" id="inputTitle" name="title" placeholder="填写滚动消息内容" >{{model.title}}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="inputDate" class="control-label">显示时间<i class="required">*</i></label>
                            <div class="input-prepend demo">
                                <input readonly="readonly" type="text" data-ui="datatimerange" class="form-control" style="padding:0 6px 0 28px" value="{{model.createTimeText}}-{{model.modifyTimeText}}"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5 col-md-5">
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人<i class="required">*</i></label>
                            <div class="org">
                                <ul class="ztree dept-tree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>
<script>
UMEDITOR_HOME_URL = '${contextPath}/assets/dep/umeditor/';
</script>
</body>
</html>