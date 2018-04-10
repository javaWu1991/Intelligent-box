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
        <c:set var="screenTitle" value="个人信息" />
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
                            <label for="inputName" class="col-sm-4 control-label">姓名</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="inputName" name="name" placeholder="姓名" value="${currentUser.name}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputJob" class="col-sm-4 control-label">职位</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="inputJob" name="job" placeholder="职位" value="${currentUser.job}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputMobile" class="col-sm-4 control-label">手机号码</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="inputMobile" name="mobile" placeholder="手机号码" value="${currentUser.mobile}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputShortNum" class="col-sm-4 control-label">短号</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="inputShortNum" name="shortNum" placeholder="短号" value="${currentUser.shortNum}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail" class="col-sm-4 control-label">电子邮箱</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="inputEmail" name="email" placeholder="电子邮箱" value="${currentUser.email}">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-4 col-sm-8">
                                <button type="button" class="btn btn-primary" data-do="submit">保存</button>
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