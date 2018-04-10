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
        <c:set var="screenTitle" value="待审核人员管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-body">
                    <table id="sole-table" class="datatable table table-bordered table-hover" role="datatable">
                        <thead>
                            <tr role="col-headers">
                                <th>姓名</th>
                                <th>手机号</th>
                                <th>短号</th>
                                <th>申请加入部门</th>
                                <th>职位</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items"></tbody>
                    </table>
                    <div class="toolbar-bottom"></div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/pending-user', function(page){ page.run(); });</script>
<script type="text/html" id="tmpl-item">
<td>{{model.name}}</td>
<td>{{model.account}}</td>
<td>{{model.shortNum}}</td>
<td>{{model.mobile}}</td>
<td>{{model.job}}</td>
<td class="col-actions">
    <a href="javascript:void(0);" data-do="review">审核</a>
</td>
</script>
<script type="text/template" id="tmpl-reviewModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">员工信息审核</h4>
        </div>
        <div class="modal-body">
            <form>
                <input type="hidden" name="id" value="{{model.id}}">
                <input type="hidden" name="mobile" value="{{model.account}}">
                <div class="form-group">
                    <label class="control-label">部门名称</label>
                    <p class="form-control-static">{{model.orgName}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">姓名</label>
                    <p class="form-control-static">{{model.orgName}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">手机号码</label>
                    <p class="form-control-static">{{model.mobile}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">短号</label>
                    <p class="form-control-static">{{model.shortNum}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">邮箱</label>
                    <p class="form-control-static">{{model.email}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">性别</label>
                    <p class="form-control-static">{{model.sex}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label">审核</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="status" value="1"> 通过
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="status" value="3"> 不通过
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
</body>
</html>