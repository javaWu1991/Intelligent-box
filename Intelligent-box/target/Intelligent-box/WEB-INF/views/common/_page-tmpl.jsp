<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
</head>
<body>
<div id="wrapper">
    <div class="color-line"></div>
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="管理员管理" />
        <div class="row page-heading">
            <div class="col-lg-10">
                <h2>${screenTitle}</h2>
            </div>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/admin', function(page){ page.run(); });</script>
</body>
</html>