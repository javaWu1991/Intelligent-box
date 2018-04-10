<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<style type="text/css">
	.onError{color:red}
	.onSuccess{color:green}
	#Pagination{float:right}
</style>
<link rel="stylesheet" href="${contextPath}/assets/src/css/page.css" />	
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="督办管理员" />
        
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">管理员列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            姓名：<input type="text" class="form-control inputName" name="name" placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            手机号：<input type="text" class="form-control inputMobile" name="mobile" placeholder="请输入手机号">
                        </div>
                        <div class="form-group">
                        <button type="button" class="btn btn-default sousuo">搜索</button>
                        <button type="reset" class="btn btn-default reset" data-do="reset">重置搜索条件</button>
                        </div>
                    </form>
                    <hr />
                    
                    <div class="m-b">
                        <button type="button" class="btn btn-default" data-do="create:companyAdmin"  data-toggle='modal' data-target='#myModals'><i class="fa fa-plus" aria-hidden="true"></i> 新建管理员</button>
                    </div>
                   
                    <table id="sole-table" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>登录账号</th>
                                <th>真实姓名</th>                               
                                <th>联系方式</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items" id="detail">
                            
                        </tbody>
                    </table>                   
                    <ul class="page" maxshowpageitem="5" pagelistcount="10"  id="page"></ul>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>

<!-- 模态框（Modal） -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					确认停用？
				</h4>
			</div>			
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭
				</button>
				<button type="button" class="btn btn-primary quedin" data-dismiss="modal">
					确定
				</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal -->
</div>
<!--新建管理员-->
<div class="modal fade" id="myModals" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建管理员账号</h4>
			</div>	
			 <form id="frmV">
			<div class="modal-body">
           
                <input style="visibility:hidden; position:absolute; z-index;-999;" type="password">
                <input type="hidden" name="companyName" value="">
                <input type="hidden" name="companyNo" value="">
                <!--<div class="form-group">
                    <label class="control-label">企业信息</label>
                    <p class="form-control-static"></p>
                </div>-->
                <div class="form-group">
                    <label for="name" class="control-label">姓名<i class="required">*</i></label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="管理员姓名">
                </div>
                <div class="form-group">
                    <label for="mobile" class="control-label">手机号码<i class="required">*</i></label>
                    <input type="text" class="form-control" id="mobile" name="mobile" placeholder="手机号码">
                </div>
				
           
        </div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭
				</button>
				<button type="button" class="btn btn-primary save">
					保存
				</button>
			</div>
			 </form>
		</div><!-- /.modal-content -->
	</div><!-- /.modal -->
</div>
			
<script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="${contextPath}/assets/src/page/system/page.js"></script>
<script src="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="${contextPath}/assets/src/page/system/dubanManagement.js"></script>
<script>seajs.use('page/system/duban', function(page){ page.run(); });</script>
</body>
</html>