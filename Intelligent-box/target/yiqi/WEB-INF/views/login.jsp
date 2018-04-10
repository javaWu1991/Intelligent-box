<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="./common/head-public.jsp"%>
<%@ include file="./common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/src/css/login.css" />
<style>
form .form-group label.error {
  position: absolute;
  right: -110px;
  top:6px;
}
</style>
</head>
<body class="gray-bg">
<div class="middle-box loginscreen">
    <h1 class="text-center logo-name">W+</h1>
    <form id="form-login" class="form-login m-t" method="post" action="${contextPath}/web/checkPass.do">
        <h2>欢迎登录</h2>
        <div class="alert-login alert alert-danger hide" role="alert"></div>
        <!-- 取消以下注释可禁止自动填充表单 -->
        <!-- <input type="password" style="visibility: hidden; position: absolute; z-index: -1"> -->
        <div class="form-group">
            <label for="inputUsername" class="sr-only">用户名</label>
            <input type="text" id="inputUsername" name="account" class="form-control" placeholder="用户名" autofocus>
        </div>
        <div class="form-group">
            <label for="inputPassword" class="sr-only">密码</label>
            <input type="password" id="inputPassword" name="password" class="form-control" placeholder="密码">
        </div>
        <button class="btn btn-primary btn-block m-b" type="submit">登录</button>
       <!-- <p class="text-center m-b clearfix">
            <a class="pull-left" href="${contextPath}/web/register.htm">创建账号</a>
            <a class="pull-right" href="${contextPath}/web/forgot.htm"><small>忘记密码？</small></a>
        </p>-->
        <%-- <hr />
        <p class="text-center">
            <small class="text-muted">还没有账号？</small>
        </p>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/register.htm">创建账号</a> --%>
    </form>
    <form id="form-company" class="form-login m-t" method="post" action="${contextPath}/web/checkLogin.do" style="display: none;">
        <h2>选择账号类型</h2>
        <div class="alert-company alert alert-danger hide" role="alert"></div>
        <div class="form-group">
            <label for="inputPassword" class="sr-only">公司组织</label>
            <select id="company" name="company" class="form-control"></select> 
        </div> 
        <button class="btn btn-primary btn-block m-b" type="submit">确定</button>
    </form>
</div>
<script>seajs.use('page/login', function(page){ page.run(); });</script>
</body>
</html>