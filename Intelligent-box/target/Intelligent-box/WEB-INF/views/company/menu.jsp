<%@ page language="java" pageEncoding="utf-8" %>
<%@ include file="../common/head-public.jsp" %>
<%@ include file="../common/ie.jsp" %>
</head>
<body>
<div id="wrapper">
        <%@ include file="../common/primary-nav.jsp" %>
        <!-- page content -->
        <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp" %>
        <!-- screen title -->
        <c:set var="screenTitle" value="应用管理-内部应用-菜单管理"/>
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">菜单管理</div>
                </div>
                <div class="panel-body">
                    <div class="col-md-4 col-sm-4">
                        <div class="m-b">
                            <button type="button" class="btn btn-default" data-do="create:province"><i class="fa fa-plus" aria-hidden="true"></i> 新建一级菜单</button>
                        </div>
                        <div class="table-responsive">
                            <table id="table-pro" class="datatable table table-bordered">
                                <tbody role="items">
                                </tbody>
                            </table>
                            <div class="toolbar-bottom"></div>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-4">
                        <div class="m-b">
                            <button type="button" class="btn btn-default" data-do="create:city"><i class="fa fa-plus" aria-hidden="true"></i> 新建二级菜单</button>
                        </div>
                        <div class="table-responsive" style="height:372px;overflow-x:hidden;overflow-y:auto;">
                            <table id="table-city" class="datatable table table-bordered">
                            <tbody role="items"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-4">
                        <div class="m-b">
                            <button type="button" class="btn btn-default" data-do="create:qu"><i class="fa fa-plus" aria-hidden="true"></i> 新建三级菜单</button>
                        </div>
                        <div class="table-responsive" style="height:372px;overflow-x:hidden;overflow-y:auto;">
                            <table id="table-qu" class="datatable table table-bordered">
                                <tbody role="items"></tbody>
                            </table>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/company/menu', function(page){ page.run(); });</script>
<script type="text/html" id="tmpl-menuItem">
<td style="display:none">{{model.id}}</td>
<td class="col-area"><a href="javascript:void(0);" data-do="next">{{model.name}}</td>
<td class="col-area"><a href="javascript:void(0);" data-do="next" >{{model.link}}</td>
<td class="col-actions">
    <a href="javascript:void(0);" data-do="edit">编辑</a>
    <a href="javascript:void(0);" data-do="delete">删除</a>
</td>
</script>   
<script type="text/template" id="tmpl-menuCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="fMenu" value="{{model.fMenu}}">
                <div class="form-group">
                    <label for="inputName">名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputName" name="name" placeholder="名称">
                </div>
                <div class="form-group">
                    <label for="inputLink">Link<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputLink" name="link" placeholder="link">
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
<script type="text/template" id="tmpl-menuEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑 {{model.name}}</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="id" value="{{model.id}}">
                <div class="">
                    <div class="form-group">
                        <label for="inputName">名称<i class="required">*</i></label>
                        <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="角色名称">
                    </div>
                    <div class="form-group">
                        <label for="inputLink">Link<i class="required">*</i></label>
                        <input type="text" class="form-control" id="inputLink" name="link" placeholder="link" value="{{model.link}}">
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
</body>
</html>