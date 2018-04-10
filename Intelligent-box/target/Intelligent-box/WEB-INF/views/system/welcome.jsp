<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="欢迎" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->

    </div><!-- end page content -->
</div>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=BxmYo69b8MhlHdm4IzemPHCrdyluaBHg"></script>
<script>seajs.use('page/company/list', function(page){ page.run(); });</script>





</body>
</html>