<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<style>.org{padding: 10px;background-color: #f8f8f8}.dept-tree{overflow: auto;height: 400px;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="通讯录" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="org">
                                <ul id="org-tree" class="ztree dept-tree"></ul>
                            </div>
                        </div>
                        <div id="org-users" class="org-users col-sm-9">
                        </div>
                    </div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>
var currentCompany = {
    status: '<c:out value="${sessionScope.company.isHide}"/>'
};
</script>
<script>seajs.use('page/system/contacts', function(page){ page.run(); });</script>
<script type="text/html" id="tmpl-orgUserList">
<# if(model.type == type.TYPE_DEPT) { #>
<form class="search form-inline" role="search">
    <div class="form-group">
        <input type="text" class="form-control" name="name" placeholder="姓名">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" name="mobile" placeholder="手机号">
    </div>
	<div class="form-group">
        <input type="text" class="form-control" name="job" placeholder="标签">
    </div>
    <button type="submit" class="btn btn-default">搜索</button>
    <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
</form>
<hr>
<div class="btn-toolbar m-b" role="toolbar">
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-primary" data-do="create:orgUser"><i class="fa fa-plus" aria-hidden="true"></i> 添加员工</a>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-primary" data-do="sendsms"><i class="fa fa-send" aria-hidden="true"></i> 客户端安装短信通知</a>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-primary" data-do="create:org"><i class="fa fa-plus" aria-hidden="true"></i> 新增子部门</a>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-primary" data-do="edit:org"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑部门</a>
        <a href="javascript:void(0);" class="btn btn-danger" data-do="delete:org"><i class="fa fa-minus" aria-hidden="true"></i> 删除部门</a>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-info" data-do="sort:org"><i class="fa fa-arrows-v" aria-hidden="true"></i>排序</a>
    </div>
</div>
<table class="datatable table table-bordered table-hover" role="datatable">
    <thead>
        <tr role="col-headers">
            <th><input type="checkbox" data-do="toggleAll"></th>
            <th>姓名</th>
			<th>部门</th>
            <th>手机号</th>
            <th>短号</th>
            <th>职位</th>
            <th>排序</th>
			<th>状态</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody role="items"></tbody>
</table>
<div class="toolbar-bottom clearfix"></div>
<# } else if(model.type == type.TYPE_CO) { #>
<div class="btn-toolbar" role="toolbar">
    <div class="btn-group" role="group">
        <# if(model.status == 1) { #>
        <a href="javascript:void(0);" class="btn btn-default" data-do="disableHidden"><i class="fa fa-eye" aria-hidden="true"></i> 取消高管模式</a>
        <# } else { #>
        <a href="javascript:void(0);" class="btn btn-default" data-do="enableHidden"><i class="fa fa-eye-slash" aria-hidden="true"></i> 设置高管模式</a>
        <# } #>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-default" data-do="create:org"><i class="fa fa-plus" aria-hidden="true"></i> 新增子部门</a>
    </div>
    <div class="btn-group" role="group">
        <a href="javascript:void(0);" class="btn btn-default" data-do="import:orgUser"><i class="fa fa-save" aria-hidden="true"></i> 导入</a>
        <a href="${contextPath}/web/system/exportExcel.do?cid={{model.id}}" target="_blank" class="btn btn-default"><i class="fa fa-upload" aria-hidden="true"></i> 导出</a>
    </div>
</div>
<# if(COMPANY_ID == 1) { #>
<div>
	<IFRAME style="margin-top:10px;width:100%;" title="企业地图" NAME="companyMap" src="${contextPath}/api/company/queryById?id="+COMPANY_ID frameBorder=0 width=750 height=400></IFRAME>
</div>
<# }#>
<# }#>
</script>
<script type="text/html" id="tmpl-bulkAction">
<a href="javascript:void(0);" data-do="bulk:delete">删除</a>
</script>
<script type="text/html" id="tmpl-item">
<td><input type="checkbox" data-do="toggleOne"></td>
<td>{{model.name}}</td>
<td>{{model.orgName}}</td>
<td>{{model.mobile}}</td>
<td>{{model.shortNum}}</td>
<td>{{model.job}}</td>
<td>{{model.sort}}</td>
<td>{{model.status == 1 ? "在职" : "离职"}}</td>
<td class="col-actions">
    <a href="javascript:void(0);" data-do="edit">编辑</a>
    <a href="javascript:void(0);" data-do="delete">删除</a>
    <# if(model.isLeader == null || model.isLeader == 0) { #>
    <a href="javascript:void(0);" data-do="setAsLeader">置领</a>
    <# } else { #>
    <a href="javascript:void(0);" data-do="setAsLeader">取消置领</a>
    <# } #>
</td>
</script>
<script type="text/template" id="tmpl-orgUserCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建员工信息</h4>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <input type="hidden" name="orgId" value="{{model.orgId}}">
                <div class="form-group">
                    <label class="control-label">部门名称</label>
                    <p class="form-control-static">{{model.orgName}}</p>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputName" class="control-label">姓名<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" placeholder="姓名">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputJobId" class="control-label">职位<i class="required">*</i></label>
                            <select class="form-control job-list" id="inputJobId" name="jobId">
                                <option value="">请选择</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputMobile" class="control-label">手机号码<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputMobile" name="mobile" placeholder="手机号码">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputShortNum" class="control-label">短号</label>
                            <input type="text" class="form-control" id="inputShortNum" name="shortNum" placeholder="短号">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputEmail" class="control-label">电子邮箱</label>
                    <input type="text" class="form-control" id="inputEmail" name="email" placeholder="电子邮箱">
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label">性别</label>
                            <div class="radio">
                                <label class="radio-inline">
                                    <input type="radio" name="sex" value="0" checked="checked"> 男
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="sex" value="1"> 女
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputSort" class="control-label">排序</label>
                            <input type="text" class="form-control" id="inputSort" name="sort" placeholder="排序" value="1">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="control-label">隐藏号码</label>
                            <div class="checkbox">
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="isLeader" value="1"> 是
                                </label>
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
<script type="text/template" id="tmpl-orgUserEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑员工信息</h4>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" name="id" value="{{model.id}}">
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <input type="hidden" name="orgId" value="{{model.orgId}}">
                <div class="row">
                    <div class="col-md-6">
                		<div class="form-group">
                   			 <label class="control-label">部门名称</label>
                    		<p class="form-control-static">{{model.orgName}}</p>
               			 </div>
					</div>
				</div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputName" class="control-label">姓名<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" placeholder="姓名" value="{{model.name}}">
                        </div>
						<div class="form-group">
                            <label for="inputJob" class="control-label">在职状态<i class="required">*</i></label>
                            <select class="form-control" id="" name="status">
								<option value='1' <# if(model.status == 1) { #> selected="selected"<# } #>>在职</option>
								<option value='2' <# if(model.status == 2) { #> selected="selected"<# } #>>离职</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="inputJob" class="control-label">职位<i class="required">*</i></label>
                            <select class="form-control job-list" id="inputJobId" name="jobId">
                                <option value="">请选择</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="inputMobile" class="control-label">手机号码<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputMobile" name="mobile" placeholder="手机号码" value="{{model.mobile}}">
                        </div>
                        <div class="form-group">
                            <label for="inputShortNum" class="control-label">短号</label>
                            <input type="text" class="form-control" id="inputShortNum" name="shortNum" value="{{model.shortNum}}" placeholder="短号">
                        </div>
            		    <div class="form-group">
               			     <label for="inputEmail" class="control-label">电子邮箱</label>
                 			   <input type="text" class="form-control" id="inputEmail" name="email" placeholder="电子邮箱" value="{{model.email}}">
             		   </div>
                		<div class="form-group">
                            <label for="inputSort" class="control-label">排序</label>
                            <input type="text" class="form-control" id="inputSort" name="sort" placeholder="排序" value="{{model.sort}}">
                        </div>
                        <div class="form-group">
                            <label class="control-label">性别</label>
                            <div class="radio">
                                <label class="radio-inline">
                                    <input type="radio" name="sex" value="0"<# if(model.sex == 0) {#> checked="checked"<#}#>> 男
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" name="sex" value="1"<# if(model.sex == 1) {#> checked="checked"<#}#>> 女
                                </label>
                            </div>
                        </div>
    					<div class="form-group">
                            <label class="control-label">隐藏号码</label>
                            <div class="checkbox">
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="isLeader" value="1"<# if(model.isLeader == 1) { #> checked="checked"<# } #>> 是
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">更改部门</label>
                            <div class="org">
                                <ul id="edit-org-tree" class="ztree dept-tree"></ul>
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

<script type="text/template" id="tmpl-orgCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建部门</h4>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <input type="hidden" name="higherId" value="{{model.higherId}}">
                <div class="form-group">
                    <label for="inputOrgName" class="control-label">部门名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputOrgName" name="orgName" placeholder="部门名称">
                </div>
                <div class="form-group">
                    <label for="inputSort" class="control-label">排序</label>
                    <input type="text" class="form-control" id="inputSort" name="sort" placeholder="排序" value="1">
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

<script type="text/template" id="tmpl-orgEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑部门</h4>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" name="cid" value="{{model.companyId}}">
                <input type="hidden" name="id" value="{{model.id}}">
                <input type="hidden" name="higherId" value="{{model.higherId}}">
                <div class="form-group">
                    <label for="inputOrgName" class="control-label">部门名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputOrgName" name="orgName" placeholder="部门名称" value="{{model.name}}">
                </div>
                <div class="form-group">
                    <label for="inputSort" class="control-label">排序</label>
                    <input type="text" class="form-control" id="inputSort" name="sort" placeholder="排序" value="{{model.sort}}">
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

<script type="text/template" id="tmpl-orgUserImportModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">通讯录导入</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="cid" value="{{model.id}}">
                <div class="form-group">
                    <label for="inputExcel" class="control-label">导入文件</label>
                    <input type="file" class="form-control" id="inputExcel" name="excel">
                </div>
                <p><a href="/upload/import-template.xlsx">下载导入模板</a></p>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script type="text/template" id="tmpl-orgSort">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">排序</h4>
        </div>
        <div class="modal-body">
            <form>
                <div class="form-group">
                    <label for="inputOrgSort" class="control-label">排序</label>
                    <input type="text" class="form-control" id="inputOrgSort" name="orgSort" placeholder="输入排序号">
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

<script type="text/template" id="tmpl-sendSMSModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">客户端安装通知</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputMessage" class="control-label">发送短信的内容</label>
                            <div class="sms-content">
                            {{USER_NAME}} 邀请您加入 [{{COMPANY_NAME}}] 工作手机。链接：http://xxxx
                            <textarea name="message" class="hide">{{USER_NAME}} 邀请您加入 [{{COMPANY_NAME}}] 工作手机。链接：http://xxxx</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputPhoneNos" class="control-label">接收员工</label>
                            <div class="sms-receivers">
                                <ul>
                                    <# for(var i = 0, length = collection.length, item; i < length; i++) { item = collection[i]; #>
                                    <li>{{item.name}}<input type="hidden" name="phoneNos" value="{{item.mobile}}"></li>
                                    <# } #>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">发送</button>
        </div>
    </div>
</div>
</script>

</body>
</html>