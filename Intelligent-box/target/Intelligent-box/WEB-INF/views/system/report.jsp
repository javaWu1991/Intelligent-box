<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow: auto;height: 200px;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="统计" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <iframe id="reportIframe" frameborder="0" width="100%" height="99%"></iframe>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>
var reportView = '${param.view}';
</script>
<script>seajs.use('page/system/report', function(page){ page.run(); });</script>
</body>
</html>