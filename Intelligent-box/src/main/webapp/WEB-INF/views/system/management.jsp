<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<style>
	.lis{
		position: absolute;
		left:20px;
		list-style: none;
		z-index: 9999;
	}
	.lis li{
		width: 174px;
		padding-left: 4px;
		height:25px;
		line-height: 25px;
		background-color:#C8E0F0;
	}	
</style>
<script>
   //计算天数差的函数,sDate1是2016-12-18格式  
   function  DateDiff(sDate1){
       var sDate = sDate1.split(" ")
       sDate1 = sDate[0]
       var  aDate,  oDate1,  oDate2,  iDays  
       aDate  =  sDate1.split("-")  
       oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
       d = new Date()
       var sDate2 = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
       aDate  =  sDate2.split("-")
       oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
       iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)//把相差的毫秒数转换为天数  
       return  iDays != 0 ? iDays : "刚刚更新"
   } 
</script>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="合同管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">合同列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                    	 <div class="form-group">
                           	       合同名称    <input type="text" name="name" class="form-control names" title="dian" id="mingc" style='width:174px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;'/>
                           	       <ul class="lis"></ul>
                           	       合同编号    <input type="text" name="number" placeholder="请输入合同编号" class="form-control bhao"/>
                        </div>
                        <div class="form-group">
                        	<button type="button" class="btn btn-primary sousuo">搜索</button>
                        </div>
                        <div class="form-group">
                           	<select class="form-control" name="status">
                                <option value="">请选择合同状态</option>
                                <option value="1">准备状态</option>
                                <option value="2">起草状态</option>
                                <option value="3">审核状态</option>
                                <option value="4">签署状态</option>
                                <option value="5">执行状态</option>
                                <option value="6">结束状态</option>
                                
                            </select>
                        </div>
                        <div class="form-group">
                        	<button type="submit" class="btn btn-primary sx">筛选</button>
                        	<button type="reset" class="btn btn-primary" data-do="reset" style="margin-left: 10px;">重置搜索条件</button>
                        </div>
                        <div class="form-group">
                        <a href="javascript:void(0);" class="btn btn-primary" data-do="create:management"> 添加合同</a>
                    </div>
                    </form>
                    <hr />                                                          
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th style="text-align: center;">合同编号</th>
                                <th style="text-align: center;">合同名称</th>
                                <th style="text-align: center;">当前状态</th>
                                <th style="text-align: center;">上次更新时间</th>
                                <th style="text-align: center;">未更新天数</th>                                
                                <th style="text-align: center;">操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">                       	
                            <script type="text/html" id="tmpl-item">
                            <td width="80" align="center">{{model.number}}</td>
                            <td width="200" class="item-names"><div class="longtext" data-toggle="tooltip" title="{{model.name}}" style="width:300px;white-space: nowrap;overflow: hidden;">{{model.name}}</div></td>
                            <td width="80" align="center">{{model.statusText}}</td>
                            <td width="160" align="center">{{model.updateTimeText}}</td>
							<td width="100"align="center">{{DateDiff(model.updateTimeText)}}</td>                         
                            <td class="col-actions" width="200" align="center">                               
                                <a href="javascript:void(0);" data-do='view' data-id="{{model.id}}">查看</a>
                                <a href="javascript:void(0);" data-do="edit" data-id="{{model.id}}">更新</a>
                                <a href="javascript:void(0);" data-do="delete" data-id="{{model.id}}">删除</a>
                            </td>
                            </script>
                        </tbody>                       
                    </table>
                    <p class="zw" style="display: none;height:37px;line-height: 37px;">暂无数据</p>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/ht-management/management', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-managementCreateModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建合同</h4>
        </div>
        <div class="modal-body">
            <form method="post">    
            	
                <input type="hidden" name="cid" value="{{model.cid}}">
               
                <div class="form-group">
                    <label for="name">合同名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="合同名称">
                </div>
                <div class="form-group">
                    <label for="number">合同编号<i class="required">*</i></label>
                    <input type="text" class="form-control" id="number" name="number" placeholder="合同编号">
                </div>
                <div class="form-group">
                    <label for="money">合同金额<i class="required">*</i></label>
                    <input type="text" class="form-control" id="money" name="money" placeholder="合同金额">
                </div>
                <div class="form-group">
                    <label for="companyName">对方主体名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="companyName" name="companyName" placeholder="对方主体名称">
                </div>
                <div class="form-group">
                    <label for="companyCommander">合同承办人<i class="required">*</i></label>
                    <input type="text" class="form-control" id="companyCommander" name="companyCommander" placeholder="合同承办人">
                </div>
                <div class="form-group">
                    <label for="status">当前状态</label>
                    <select name="status" id="status">
                        <option value="1">准备状态</option>
                        <option value="2">起草状态</option>
                        <option value="3">审核状态</option>
                        <option value="4">签署状态</option>
                        <option value="5">执行状态</option>
                        <option value="6">结束状态</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statusExplain" class="control-label">状态说明</label>
                    <textarea class="form-control" id="statusExplain" name="statusExplain" placeholder="状态说明"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary saves" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>
<script type="text/template" id="tmpl-managementEditModal">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">更新合同</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="id" value="{{model.id}}">
                <div class="form-group">
                    <label for="name">合同名称</label>
                    <input type="text" class="form-control" id="name" name="name" placeholder="{{model.name}}" disabled="disabled">
                </div>
                <div class="form-group">
                    <label for="number">合同编号</label>
                    <input type="text" class="form-control" id="number" name="number" placeholder="{{model.number}}" disabled="disabled">
                </div>
                <div class="form-group">
                    <label for="money">合同金额</label>
                    <input type="text" class="form-control" id="money" name="money" placeholder="{{model.money}}" disabled="disabled">
                </div>
                <div class="form-group">
                    <label for="companyName">对方主体名称</label>
                    <input type="text" class="form-control" id="companyName" name="companyName" placeholder="{{model.companyName}}" disabled="disabled">
                </div>
                <div class="form-group">
                    <label for="companyCommander">合同承办人</label>
                    <input type="text" class="form-control" id="companyCommander" name="companyCommander" placeholder="{{model.companyCommander}}" disabled="disabled">
                </div>
                <div class="form-group">
                    <label for="status">当前状态</label>
                    <select name="status" id="status">
                        <option value="1">准备状态</option>
                        <option value="2">起草状态</option>
                        <option value="3">审核状态</option>
                        <option value="4">签署状态</option>
                        <option value="5">执行状态</option>
                        <option value="6">结束状态</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label for="statusExplain" class="control-label">状态说明</label>
                    <textarea class="form-control" id="statusExplain" name="statusExplain" placeholder="状态说明"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
        <!--zhu-->
    </div>
</div>
</div>
</script>
<script>
UMEDITOR_HOME_URL = '${contextPath}/assets/dep/umeditor/';
</script>
</body>
</html>