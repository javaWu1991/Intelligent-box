<%@ page language="java" pageEncoding="utf-8"%>
<div class="navbar navbar-static-top navbar-fixed-top" role="navigation">
    <div class="nav-header navbar-left">
        <h1><img width="120px" height="36px" src="${contextPath}/assets/src/css/img/xajunlogo.png"> &nbsp;&nbsp;| &nbsp;&nbsp;酒店智能盒子(<select id="company" name="company" style="background-color:transparent;border:0;" onchange="change();"></select>)</h1>
    
    </div>
    <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
            <a href="javascript:void(0);" id="dropdown-account" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-user"></i> 设置 <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdown-account">
                <li><a href="${contextPath}/web/system/password.htm">密码修改</a></li>
            </ul>
        </li>
        <li>
            <a href="${contextPath}/web/exit.do">
                <i class="fa fa-sign-out"></i> 退出
            </a>
        </li>
    </ul>
</div>
<script>seajs.use('page/system/header', function(page){ page.run(); });
function change(){
    var obj = document.getElementById("company"); //定位id
    var index = obj.selectedIndex; // 选中索引
    var text = obj.options[index].text; // 选中文本
    var value = obj.options[index].value
       $.ajax({
            type: "post",
            url: CONTEXT_PATH + '/web/checkLogin.do',
            dataType: "json",
            context: this,  
            data:{
                id:value,
                name:text
            },
            success: function(data) {   
            	alert("切换成功！");
            }
        });
}
</script>
<script>
var CID = '${sessionScope.companyId}';
var COMPANY_NAME = '${sessionScope.companyName}';
var admin = '${sessionScope.isAdminLogin}';
</script>