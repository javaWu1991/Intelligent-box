<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="应用管理-外部应用-自动回复留言" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">自动回复留言</div>
                </div>
                <div class="panel-body">
                     <form id="search" class="form-inline">
                        <div class="form-group">
                            <input type="text" class="form-control" name="requestContent" placeholder="">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                    </form>
                    <hr /> 
                    <div class="m-b">
                        <button type="button" class="btn btn-default" data-do="create:role"><i class="fa fa-plus" aria-hidden="true"></i> 新建</button>
                    </div>
                    <div class="table-responsive">
                        <table id="table-rol" class="datatable table table-bordered table-striped">
                            <thead>
                                <tr role="col-headers">
                                    <th>请求内容</th>
                                    <th>响应内容</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody role="items">
                                <script type="text/html" id="tmpl-roleItem">
                                <td class="col-company">{{model.requestContent}}</td>
                                <td class="col-company">{{model.responseContent}}</td>
                                <td class="col-actions">
                                <a href="javascript:void(0);" data-do="edit">编辑</a>
                                <a href="javascript:void(0);" data-do="delete">删除</a>
                                </td>
                                </script>
                            </tbody>
                        </table>
                        <div class="toolbar-bottom"></div>
                    </div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/service', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-roleCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建服务号</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                		<input type="hidden" name="cid" value="${sessionScope.companyId}">
                        <div class="form-group">
                            <label for="inputDesc">请求内容<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputDesc" name="requestContent" placeholder="请求内容">
                        </div>
                        <div class="form-group">
                            <label for="inputRole">响应内容<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputRole" name="responseContent" placeholder="响应内容">
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
<script type="text/template" id="tmpl-roleEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑 {{model.name}}</h4>
        </div>
        <div class="modal-body">
            <form method="post">
              	<input type="hidden" name="cid" value="${sessionScope.companyId}">
              	<input type="hidden" name="id" value="{{model.id}}">
                        <div class="form-group">
                            <label for="inputDesc">请求内容<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputDesc" name="requestContent" value="{{model.requestContent}}">
                        </div>
                        <div class="form-group">
                            <label for="inputRole">响应内容<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputRole" name="responseContent"  value="{{model.responseContent}}">
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
</body>
</html>