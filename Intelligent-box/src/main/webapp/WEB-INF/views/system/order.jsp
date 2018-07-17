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
        <c:set var="screenTitle" value="订单信息" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">订单列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            订单状态：<select class="form-control" name="status">
                                <option value="">全部</option>
                                <option value="0">支付成功</option>
                                <option value="1">支付失败</option>
                                <option value="2">退款</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="productName" placeholder="产品名称">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <table id="sole-table" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>产品名称</th>
                                <th>支付价格</th>
                                <th>支付状态</th>
                                 <th>订单号</th>
                                <th>设备编号</th>  
                                <th>货柜编号</th>  
                                <th>支付时间</th>                                                                   
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td width="60">{{model.productName}}</td>
                            <td width="60">{{model.price}}(元)</td>
                            <td width="60">{{model.statusText}}</td>
                            <td width="100">{{model.orderCode}}</td>
                            <td width="60">{{model.machineId}}</td>
                            <td width="60">{{model.containerNumber}}</td>
                            <td width="80">{{model.createTimeText}}</td>                                   
                            <td class="col-actions" width="60">
                            <# if(model.status == 0)#>
<shiro:hasPermission name="admin"> 
                             <a href="javascript:void(0);" data-do="delete">退款</a>
  </shiro:hasPermission> 
                             </#>
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
<script>seajs.use('page/system/order', function(page){ page.run(); });</script>
</body>
</html>