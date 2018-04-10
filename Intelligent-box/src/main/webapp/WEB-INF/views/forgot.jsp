<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="./common/head-public.jsp"%>
<%@ include file="./common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/src/css/login.css" />
<style>
form .form-group label.error { left: 310px; top: 10px; width: 180px; }
</style>
</head>
<body class="gray-bg">
<div class="middle-box loginscreen">
    <h1 class="text-center logo-name">W+</h1>
    <form action="${contextPath}/web/system/updatePasswordBycode.do" id="sole-form" class="form-forgot m-t m-b" method="post">
        <h2>取回密码</h2>
        <div class="alert-form alert alert-danger hide" role="alert"></div>
        <div class="form-group">
            <label for="inputAccount" class="sr-only">手机号码</label>
            <input type="text" id="inputAccount" name="account" class="form-control" placeholder="手机号码" autofocus>
        </div>
        <div class="form-group">
            <label for="inputCode" class="sr-only">验证码</label>
            <input type="text" id="inputCode" name="code" class="form-control m-b" placeholder="验证码">
            <a href="javascript:void(0);"  data-do="get-code">获取验证码短信</a>
          	<input type="hidden" id="inputSMSTime" name="smsTime">
            <input type="hidden" id="inputValiCode" name="valiCode">
        </div>
        <!-- 添加 -->
        <div class="form-group">
            <label for="inputPass" class="sr-only">新密码</label>
            <input type="password" id="newPassword" name="pass" class="form-control" placeholder="新密码" autofocus>
        </div>  
        <div class="form-group">
            <label for="inputConfirmPass" class="sr-only">再次确认密码</label>
            <input type="password" id="confirmPassword" name="confirmPass" class="form-control" placeholder="再次确认密码" autofocus>
        </div>     
        <button class="btn btn-primary btn-block m-b" type="submit">确定</button>
        <hr />
        <p class="text-center">
            <small class="text-muted">登录 &amp; 创建账号</small>
        </p>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/login.htm">登录</a>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/register.htm">创建账号</a>
    </form>
    <div class="forsuccess" style="display:none;">
        <h2>取回密码</h2>
        <p>您的账户已经取回成功！</p>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/login.htm">立即登录</a>
    </div>
</div>
<script>seajs.use('page/forgot', function(page){ page.run(); });</script>
</body>
</html>