<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="公司职位管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">职位列表</div>
                </div>
                <div class="panel-body">
                    <div class="m-b">
                        <button type="button" class="btn btn-default" data-do="create:position"><i class="fa fa-plus" aria-hidden="true"></i> 新建</button>
                    </div>
                    <div class="table-responsive">
                        <table id="sole-table" class="datatable table table-bordered table-striped">
                            <thead>
                                <tr role="col-headers">
                                    <th>序号</th>
                                    <th>职位名称</th>
                                    <th>级别</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody role="items">
                                <script type="text/html" id="tmpl-item">
                                <td class="col-index" width="50">{{model.$index+1}}</td>
                                <td>{{model.positionName}}</td>
                                <td width="100">{{model.level}}</td>
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
<script>seajs.use('page/company/position', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-positionCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建职位</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <div class="form-group">
                    <label for="inputPositionName">职位名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputPositionName" name="positionName" placeholder="职位名称">
                </div>
                <div class="form-group">
                    <label for="inputAddress">职位级别<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputLevel" name="level" placeholder="数字越小级别越高">
                    <p class="form-control-static">数字越小级别越高</p>
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
<script type="text/template" id="tmpl-positionEditModal">
<div class="modal-dialog" style="width:800px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑 {{model.positionName}}</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="id" value="{{model.id}}">
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <div class="form-group">
                    <label for="inputPositionName">职位名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputPositionName" name="positionName" placeholder="职位名称" value="{{model.positionName}}">
                </div>
                <div class="form-group">
                    <label for="inputAddress">职位级别<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputLevel" name="level" placeholder="数字越小级别越高" value="{{model.level}}">
                    <p class="form-control-static">数字越小级别越高</p>
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