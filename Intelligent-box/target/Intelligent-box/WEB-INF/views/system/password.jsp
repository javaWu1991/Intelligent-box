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
        <c:set var="screenTitle" value="密码修改" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="row m-t">
                <div class="col-sm-6">
                    <form id="form-password" method="post" class="form-horizontal" enctype="multipart/form-data">
                         <input type="hidden" name="id" value="${currentUser.id}">
                        <div class="form-group">
                            <label for="inputOldPassword" class="col-sm-4 control-label">原密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" id="inputOldPassword" name="oldPass" placeholder="必填">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword" class="col-sm-4 control-label">新密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" id="inputPassword" name="newPass" placeholder="必填">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPasswordRetry" class="col-sm-4 control-label">确认新密码</label>
                            <div class="col-sm-8">
                                <input type="password" class="form-control" id="inputPasswordRetry" name="passRetry" placeholder="必填">
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
<script>seajs.use('page/system/password', function(page){ page.run(); });</script>
</body>
</html>