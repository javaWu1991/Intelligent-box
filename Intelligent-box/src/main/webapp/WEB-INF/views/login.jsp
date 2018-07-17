<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="./common/head-public.jsp"%>
<%@ include file="./common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/src/css/login.css" />
<link rel="stylesheet" href="${contextPath}/assets/dep/jquery/1.11.2/jquery.js" />
<style>
form .form-group label.error {
  position: absolute;
  right: 110px;
  top:75px;
  font-weight:bold;
}
</style>
</head>
<body class="gray-bg">
<div class="middle-box loginscreen">
    <img  class="loginscreen logo-img" src="${contextPath}/assets/src/css/img/xajunlogo.png">
    <form id="form-login" class="formlogin" method="post" action="${contextPath}/web/checkPass.do">
        <div class="alert-login alert alert-danger hide" role="alert"></div>
        <!-- 取消以下注释可禁止自动填充表单 -->
        <!-- <input type="password" style="visibility: hidden; position: absolute; z-index: -1"> -->
        <div class="form-group">
            
            <input type="text" id="inputUsername" name="account" class="formlogin form-control1" placeholder="请输入手机号码" oninput="change();">
        </div>
        <div class="form-group">
            
            <input type="password" id="inputPassword" name="password" class="formlogin form-control2" placeholder="请输入登录密码" >
        </div>
        <button class="formlogin form-control3 disabled" type="submit" >立即登录</button>
    </form>
    <div class="formlogin form-control4">杭州小爱君生物科技有限公司</div>
    <div class="formlogin form-control5">地址：杭州市临安区武肃街1079号科技企业化基地B楼322室</div>
</div>
<script>seajs.use('page/login', function(page){ page.run(); });

</script>
<script type="text/javascript">
window.onload=function(){
	var otxt=$('#inputUsername').val();
	if(otxt!=""){
		$('.formlogin.form-control3').css({'background-color':'#3498db'}); 
		$('.formlogin.form-control3.disabled').css({'pointer-events':'auto'}); 
	  }
 
}
function change(){
	var otxt=$('#inputUsername').val();
	if(otxt!=""){
		$('.formlogin.form-control3').css({'background-color':'#3498db'});
		$('.formlogin.form-control3.disabled').css({'pointer-events':'auto'}); 
	}else{
		$('.formlogin.form-control3').css({'background-color':'#9B9B9B'});
		$('.formlogin.form-control3.disabled').css({'pointer-events':'none'}); 
	}
}
</script>
</body>
</html>