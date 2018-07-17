<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link rel="stylesheet" href="${contextPath}/assets/src/css/phoneSimulate.css">
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<link rel="stylesheet" type="text/css" media="all" href="${contextPath}/assets/dep/bootstrap-daterangepicker/2.1.14/daterangepicker.css"/>
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow:auto;height:300px;} .form-control:focus{box-shadow: none;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="升级包管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            产品状态：<select class="form-control" name="status">
                                <option value="">全部</option>
                                <option value="0">禁用</option>
                                <option value="1">正常</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="productName" placeholder="产品名称">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="btn-group" role="group">
                        <a href="javascript:void(0);" class="btn btn-default" data-do="create:notice"><span class="fa fa-plus" aria-hidden="true"></span> 添加产品</a>
                    </div>
                    <br>
                    <br>
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>版本号</th>
                                <th>链接</th>
                                <th>上传时间</th>                           
                                <th>状态</th>        
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td width="60">{{model.newBuind}}</td>
                            <td width="60">{{model.buindUrl}}</td>
                            <td width="140">{{model.createTimeText}}</td>                       
                            <td width="60">{{model.statusText}}</td>
                            <td class="col-actions" width="210">    
<shiro:hasPermission name="admin">                                                     
                                <# if(model.status == 0) { #>
                                <a href="javascript:void(0);" data-do="stick">禁用</a>
                                <# } else { #>
                                <a href="javascript:void(0);" data-do="stick">启用</a>
                                <# } #>  
  </shiro:hasPermission>                            
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
<script>seajs.use('page/system/machineUpdate', function(page){ page.run(); });

</script>
<script type="text/template" id="tmpl-noticeCreateModal">
<div class="modal-dialog" style="min-width:960px;width:90%">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">添加升级包</h4>
        </div>
           <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-5 col-sm-6">
                        <div class="form-group">
                             <label for="inputPicfile" class="control-label">上传升级包<i class="required">*</i></label>
                            <input type="file" class="form-control" id="inputmr" name="mr" placeholder="上传升级包">
                        </div>
                         <div class="form-group">
                             <label for="desc" class="control-label">升级说明</label>
                            <textarea id="desc" name="desc" type="text/plain" style="width: 400px;height: 200px;"></textarea>
                        </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit" id="save_add_btn">保存</button>
        </div>
    </div>
</script>
</body>
</html>