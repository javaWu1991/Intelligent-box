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
        <c:set var="screenTitle" value="企业信息" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="row m-t">
                <div class="col-sm-6">
                    <form id="form-info" method="post" class="form-horizontal"  enctype="multipart/form-data">
                   		 <input type="hidden" name="id" value="${currentUser.id}">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">企业名称</label>
                            <div class="col-sm-3">
                                <p class="form-control-static">${sessionScope.companyName}</p>
                            </div>
                            <div class="col-sm-6">
                                当前为试用期，马上升级<br/>
                                <button type="button">版本升级</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">企业LOGO</label>
                            <div class="col-sm-3">
                                <img src="<c:out value="${sessionScope.company.logo}"/>"/>
                            </div>
                            <div class="col-sm-6">
                                <button type="button">更改LOGO</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">企业管理员</label>
                            <div class="col-sm-3">
                                <p class="form-control-static"><c:out value="${sessionScope.user.account}"/></p>
                            </div>
                            <div class="col-sm-6">
                                <button type="button">查看管理员</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">联系电话</label>
                            <div class="col-sm-9">
                                <p class="form-control-static"><c:out value="${sessionScope.user.mobile}"/></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/profile', function(page){ page.run(); });</script>
</body>
</html>