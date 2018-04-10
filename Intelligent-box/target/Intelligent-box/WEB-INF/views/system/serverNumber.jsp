<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow:auto;height:300px;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="应用管理-内部应用-服务号" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">服务号</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <!-- <div class="form-group">
                          服务号状态：<select class="form-control" name="status">
                                <option value="1">发送成功</option>
                                <option value="2">待审核</option>
                                <option value="3">发送失败</option>
                            </select>
                        </div> -->
                        <div class="form-group">
                            <input type="text" class="form-control" name="title" placeholder="标题或内容">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="btn-group" role="group">
                        <a href="javascript:void(0);" class="btn btn-default" data-do="create:notice"><span class="fa fa-plus" aria-hidden="true"></span> 新建</a>
                    </div>
                    <br>
                    <br>
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>标题</th>
                                <th>发送内容</th>
                                <th>发送时间</th>
                                <!-- <th>发送状态</th> -->
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td>{{model.title}}</td>
                            <td>{{model.content}}</td>
                            <td>{{model.createTimeText}}</td>
                            <td class="col-actions">
								<a href="javascript:void(0);" data-do="delete">删除</a>
                            </td>
                            </script>
                        </tbody>
                    </table>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/serverNumber', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-noticeCreateModal">
<div class="modal-dialog" >
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
              	<input type="hidden" name="uid" value="${sessionScope.uid}">
                    <div class="">
               		 <div class="row">
                    	<div class="col-sm-7 col-md-7">
                        <div class="form-group">
                            <label for="inputPicfile" class="control-label">封面<i class="required">*</i></label>
                            <img src="" data-src="" />
                            <input type="file" class="form-control" id="inputPicfile" name="picfile" placeholder="封面">
                        </div>
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">标题<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputTitle" name="title" placeholder="标题">
                        </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="detail" placeholder="摘要"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="inputContent" class="control-label">正文<i class="required">*</i></label>
                            <textarea id="inputContent" class="form-control" name="content" type="text/plain"></textarea>
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
<script type="text/template" id="tmpl-noticeEditModal">
<div class="modal-dialog" style="min-width:960px;width:90%">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">

                <div class="row">
                    <div class="col-sm-8 col-md-9">
                        <input type="hidden" name="id" value="{{model.id}}">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">标题<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputTitle" name="title" value="{{model.title}}" placeholder="公告标题">
                        </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="detail" placeholder="摘要">{{model.detial}}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="inputContent" class="control-label">正文<i class="required">*</i></label>
                            <textarea id="editor" name="content" type="text/plain">{{model.content}}</textarea>
                        </div>
                    </div>
                    <div class="col-sm-4 col-md-3">
                        <div class="form-group">
                            <label for="inputPicfile" class="control-label">封面<i class="required">*</i></label>
                            <input type="file" class="form-control" id="inputPicfile" name="picfile" placeholder="封面">
                        </div>
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