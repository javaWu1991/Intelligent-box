<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="./common/head-public.jsp"%>
<%@ include file="./common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/src/css/login.css" />
<style>
.regscreen .logo-name { font-size:120px; }
.regsuccess { width: 360px; height: 300px; }
.regsuccess p { margin-top: 30px; color: green; font-size: 16px; line-height: 1.5; }
form .form-group label.error { left: 310px; top: 10px; width: 180px; }
form .area-select select { width: 30%; }
</style> 
</head>
<body class="gray-bg">
<div class="middle-box loginscreen regscreen">
    <h1 class="text-center logo-name">W+</h1>
    <form action="${contextPath}/web/system/register.do" id="sole-form" class="form-register m-t m-b" method="post">
        <h2>账号注册</h2>
        <div class="alert-form alert alert-danger hide" role="alert"></div>
        <!-- 取消以下注释可禁止自动填充表单 -->
        <input type="password" style="visibility: hidden; position: absolute; z-index: -1">
        <div class="form-group">
            <label for="inputMobile" class="sr-only">手机号码</label>
            <input type="text" id="inputMobile" name="mobile" class="form-control" placeholder="输入手机号码" autofocus>
        </div>
        <div class="form-group clearfix">
            <label for="inputCode" class="sr-only">验证码</label>
            <input type="text" id="inputCode" name="code" class="form-control" style="float:left;width:170px" placeholder="输入验证码" autofocus>
            <button type="button" class="btn btn-primary" data-do="get-code" style="float:right;width:120px;padding-left:0;padding-right:0;border-radius:0;">获取验证码</button>
            <input type="hidden" id="inputSMSTime" name="smsTime">
            <input type="hidden" id="inputValiCode" name="valiCode">
        </div>
        <div class="form-group">
            <label for="inputPassword" class="sr-only">密码</label>
            <input type="password" id="inputPassword" name="password" class="form-control" placeholder="输入密码">
        </div>
        <div class="form-group">
            <label for="inputConfirmPassword" class="sr-only">确认密码</label>
            <input type="password" id="inputConfirmPassword" name="confirmPassword" class="form-control" placeholder="再次输入密码">
        </div>
        <div class="form-group">
            <label for="inputEmail" class="sr-only">邮箱</label>
            <input type="text" id="inputEmail" name="email" class="form-control" placeholder="输入您常用的电子邮箱">
        </div>
        <div class="form-group">
            <label for="inputCcompanyName" class="sr-only">公司名称</label>
            <input type="text" id="inputCcompanyName" name="companyName" class="form-control" placeholder="输入公司名称">
        </div>
        <div class="form-group">
            <label for="inputDtailAddress" class="sr-only">地区</label>
            <div class="area-picker"></div>
        </div>
        <div class="form-group">
            <label for="inputDtailAddress" class="sr-only">公司地址</label>
            <input type="text" id="inputDtailAddress" name="detailAddress" class="form-control" placeholder="输入地址">
        </div>
        <div class="form-group">
            <label for="inputName" class="sr-only">管理员姓名</label>
            <input type="text" id="inputName" name="name" class="form-control" placeholder="输入管理员姓名">
        </div>
        <button class="btn btn-primary btn-block m-b" type="submit">确定</button>
        <hr />
        <p class="text-center">
            <small class="text-muted">已有账号？</small>
        </p>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/login.htm">登录</a>
    </form>
    <div class="regsuccess" style="display:none;">
        <h2>账号注册</h2>
        <p>您的账号已注册成功！</p>
        <a class="btn btn-sm btn-default btn-block" href="${contextPath}/web/login.htm">立即登录</a>
    </div>
</div>
<script>seajs.use('page/register', function(page){ page.run(); });</script>
</body>
</html>