<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css" />
<link rel="stylesheet" href="${contextPath}/assets/src/css/phoneSimulate.css">
<link rel="stylesheet" href="${contextPath}/assets/src/css/common.css" />
<link rel="stylesheet" href="${contextPath}/assets/dep/bootstrap/3.3.6/css/bootstrap.css" />
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<link rel="stylesheet" type="text/css" media="all" href="${contextPath}/assets/dep/bootstrap-daterangepicker/2.1.14/daterangepicker.css" />
</head>

<body>
	<div id="wrapper">
		<%@ include file="../common/primary-nav.jsp"%>
		<!-- page content -->
		<div id="page-wrapper" class="page-wrapper">
			<%@ include file="../common/header.jsp"%>
			<!-- screen title -->
			<c:set var="screenTitle" value="设备注册信息" />
			<div class="page-heading">
				<h2>${screenTitle}</h2>
			</div>
			<!-- end screen title -->
			<!-- page main -->
			<div class="wrapper wrapper-content">
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">设备列表</div>
					</div>
					<div class="panel-body">
						<hr />
						<div class="m-b">
							<script type="text/html" id="tmpl-bulkAction">
<shiro:hasPermission name="admin"> 
								<button type="button" class="btn btn-default" data-do="bulk:binding">绑定企业</button>&nbsp;&nbsp;&nbsp;
  </shiro:hasPermission>   
							</script>
						</div>
						<div class="table-responsive">
							<table id="sole-table" class="datatable table table-bordered table-hover">
								<thead>
									<tr role="col-headers">
										<th><input type="checkbox" data-do="toggleAll"></th>
										<th>序号</th>
										<th>设备序列号</th>
										<th>是否被绑定</th>
										<th>注册时间</th>
										<th>更新时间</th>
									</tr>
								</thead>
								<tbody role="items">
									<script type="text/html" id="tmpl-item">
										<td class="col-checkbox" width="20"><input type="checkbox" data-do="toggleOne"></td>
										<td width="50">{{model.index}}</td>
										<td width="60">{{model.machineId}}</td>
										<td width="60">{{model.statusText}}</td>
										<td width="60">{{model.createTimeText}}</td>
										<td width="60">{{model.updateTimeText}}</td>
									</script>
								</tbody>
							</table>
							<div class="toolbar-bottom"></div>
						</div>
					</div>
				</div>
			</div>
			<!-- end page main -->
		</div>
		<!-- end page content -->
	</div>
	<script>
		seajs.use('page/system/machineRegister', function(page) {
			page.run();
		});
	</script>
	
	<script type="text/template" id="tmpl-companyCreateModal">
<div class="modal-dialog" style="width:800px">
    <div class="modal-content">
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-5 col-sm-6">
                         <div class="form-group" style="width:600px;">
                            	请选择需要绑定的酒店:
                            	  <select id="companySelect" name="corpId" style="background-color:transparent;border:0;"></select>
                        </div>  
                             <div class="form-group"  style="width:600px;">
                                                                                    请输入房间号:
                                 <input type="text" class="form-control" id="roomCode" name="roomCode" placeholder="房间号">
                        </div> 
       <div class="form-group" id="machine" style="width:600px;">
                        </div>  
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
        	
        	  <button type="button" class="btn btn-primary" data-do="submit">确定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        </div>
    </div>
</div>
</script>
</body>

</html>