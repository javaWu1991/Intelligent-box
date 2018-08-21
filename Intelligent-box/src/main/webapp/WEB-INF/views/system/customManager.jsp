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
        <c:set var="screenTitle" value="${company.name}后勤管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">后勤管理列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            姓名：<input type="text" class="form-control" name="name" placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            手机号：<input type="text" class="form-control" name="mobile" placeholder="请输入手机号">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="m-b">
                        <button type="button" class="btn btn-default" data-do="create:admin"><i class="fa fa-plus" aria-hidden="true"></i> 新建</button>
                    </div>
                    <table id="sole-table" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>登录账号</th>
                                <th>真实姓名</th>
                                <th>用户类型</th>
                                <th>企业名称</th>
                                <th>联系方式</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.$index+1}}</td>
                            <td width="120">{{model.account}}</td>
                            <td width="120">{{model.name}}</td>
                            <td width="100">{{model.type}}</td>
                            <td width="200" class="col-company">
                                <span data-toggle="tooltip" title="{{model.companyName}}">{{model.companyName}}</span></td>
                            <td width="120">{{model.mobile}}</td>
                            <td width="100">{{model.statusText}}</td>
                            <td class="col-actions">
                            <a href="javascript:void(0);" data-do="edit">编辑</a>
                            <# if(model.status == 1) { #>
                            <a href="javascript:void(0);" data-do="disable">停用</a>
                            <# } else if(model.status == 0) { #>
                            <a href="javascript:void(0);" data-do="enable">启用</a>
                            <# } #>
                            <a href="javascript:void(0);" data-do="delete">删除</a>
							<shiro:hasAnyRoles name="admin">
                            <a href="javascript:void(0);" data-do="role">角色分配</a>
							</shiro:hasAnyRoles>
                            </td>
                            </script>
                        </tbody>
                    </table>
                    <div class="toolbar-bottom"></div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>
var CID = '${company.id}';
var COMPANY_CODE = '${company.code}';
var COMPANY_NAME = '${company.name}';
</script>
<script>seajs.use('page/system/customManager', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-customManagerCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建后勤人员</h4>
        </div>
        <div class="modal-body">
            <form>
                <input style="visibility:hidden; position:absolute; z-index;-999;" type="password">
                <div class="form-group">
                    <label for="inputMobile" class="control-label">账号<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputMobile" name="mobile" placeholder="请输入手机号码">
                </div>
                <div class="form-group">
                    <label for="inputName" class="control-label">姓名<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputName" name="name" placeholder="不超过10个字符">
                </div>
                <div class="form-group">
                    <label class="control-label">性别</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="sex" value="0" checked="checked"> 女
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="sex" value="1"> 男
                        </label>
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
<script type="text/template" id="tmpl-customManagerEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑后勤人员</h4>
        </div>
        <div class="modal-body">
            <form>
                <input style="visibility:hidden; position:absolute; z-index;-999;" type="password">
                <input type="hidden" name="tid" value="{{model.tid}}">
                <input type="hidden" name="uid" value="{{model.id}}">
                <div class="form-group">
                    <label for="inputMobile" class="control-label">账号<i class="required">*</i></label>
                    <p class="form-control-static">{{model.mobile}}</p>
                </div>
                <div class="form-group">
                    <label for="inputName" class="control-label">姓名<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="管理员姓名">
                </div>
                <div class="form-group">
                    <label class="control-label">性别</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="sex" value="0"<# if(model.sex == 0) {#> checked="checked"<#}#>> 女
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="sex" value="1"<# if(model.sex == 1) {#> checked="checked"<#}#>> 男
                        </label>
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
<script type="text/template" id="tmpl-roleAssignModal">
<div class="modal-dialog" >
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{model.name}} 角色分配</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="uid" value="{{model.id}}">
                <input type="hidden" name="cid" value="{{model.cid}}">
                 <div class="form-group">
                    <label for="inputReciverse" class="control-label">角色</label>
                     <div class="org">
                         <ul class="ztree dept-tree"></ul>
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
<script type="text/html" id="tmpl-bulkAction">
<a href="javascript:void(0);" data-do="bulk:delete">删除</a>
<a href="javascript:void(0);" data-do="bulk:disable">禁用</a>
<a href="javascript:void(0);" data-do="bulk:enable">启用</a>
</script>
</body>
</html>