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
        <c:set var="screenTitle" value="开门信息" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">开门列表</div>
                </div>
                <div class="panel-body">
                    <hr />
                    <table id="sole-table" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>产品名称</th>
                                <th>设备序列号</th>
                                <th>柜号</th>
                                 <th>开门类型</th>
                                <th>开门状态</th>  
                                <th>开门时间</th>  
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td width="60">{{model.productName}}</td>
                            <td width="60">{{model.machineId}}</td>
                            <td width="60">{{model.containerNumber}}</td>
                            <td width="60">{{model.typeText}}</td>
                            <td width="60">{{model.statusText}}</td>
                            <td width="80">{{model.createTimeText}}</td>                                   
                            </script>
                        </tbody>
                    </table>
                    <div class="toolbar-bottom"></div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/openDoor', function(page){ page.run(); });</script>
</body>
</html>