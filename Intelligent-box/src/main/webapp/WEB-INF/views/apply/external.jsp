<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
</head>
<body>
<div id="wrapper">
    <div class="color-line"></div>
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="应用管理-外部应用" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-body">
                    <form id="search" class="form-inline" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" name="name" placeholder="应用名称">
                        </div>
                        <div class="form-group">
                            <select class="form-control" name="type">
                                <option value="">所有</option>
                                <option value="1">安卓应用</option>
                                <option value="2">iOS应用</option>
                                <option value="3">HTML5应用</option>
                                <option value="4">服务号</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="m-b">
                        <div class="dropdown">
                            <button id="appType" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default navbar-btn dropdown-toggle"><i class="fa fa-plus" aria-hidden="true"></i> 新建<span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="appType">
                                <li><a href="javascript:void(0);" data-do="create:android">安卓应用</a></li>
                                <li><a href="javascript:void(0);" data-do="create:ios">iOS应用</a></li>
                                <li><a href="javascript:void(0);" data-do="create:h5">HTML5应用</a></li>
                                <li><a href="javascript:void(0);" data-do="create:fw">服务号</a></li>
                            </ul>
                        </div>
                    </div>
                    <table id="table-app" class="datatable table table-striped table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>应用名称</th>
                                <th>应用简介</th>
                                <th>类型</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-externalAppItem">
                            <td class="col-index" width="50">{{model.$index + 1}}</td>
                            <td class="col-name" width="100">{{model.name}}</td>
                            <td class="col-intr">{{model.intro}}</td>
                            <td class="col-type" width="100">{{model.typeText}}</td>
                            <td class="col-status" width="100">{{model.statusText}}</td>
                            <td class="col-actions" width="400">
                                <# if(model.state == 1) { #>
                                    <a href="javascript:void(0);" data-do="disable">停用</a>
                                <# } else if(model.state == 0) { #>
                                    <a href="javascript:void(0);" data-do="enable">启用</a>
                                <# } #>
                                <a href="javascript:void(0);" data-do="edit">编辑</a>
                                <a href="javascript:void(0);" data-do="delete">删除</a>
                                <# if(model.type == 4) { #>
                                    <a  href="${contextPath}/web/system/externalService.htm?sid={{model.id}}">留言管理</a>
                                    <a href="${contextPath}/web/company/externalMenu.htm?sid={{model.id}}" >菜单管理</a>
                                    <a  href="${contextPath}/web/system/externalServerNumber.htm?sid={{model.id}}">服务号管理</a>
                                <# }#>
                            </td>
                            </script>
                        </tbody>
                    </table>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/apply/external', function(page){ page.run(); });</script>
<%@ include file="./inputModal.jsp"%>
</body>
</html>