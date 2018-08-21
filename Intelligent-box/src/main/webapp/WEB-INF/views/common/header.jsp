<%@ page language="java" pageEncoding="utf-8"%>
<style type="text/css">
.qimo8{ overflow:hidden; width:200px;margin-top:17px;}
.qimo8 .qimo {/*width:99999999px;*/width:8000%; height:30px;}
.qimo8 .qimo div{ float:left;}
.qimo8 .qimo ul{float:left; height:30px; overflow:hidden; zoom:1; }
.qimo8 .qimo ul li{float:left; line-height:30px; list-style:none;}
.qimo8 li a{margin-right:10px;color:#444444;}
</style>
<div class="navbar navbar-static-top navbar-fixed-top" role="navigation">
    <div class="nav-header navbar-left">
        <h1><img width="120px" height="36px" src="${contextPath}/assets/src/css/img/xajunlogo.png"> &nbsp;&nbsp;| &nbsp;&nbsp;酒店智能盒子(<select id="company" name="company" style="background-color:transparent;border:0;" onchange="change();"></select>)
        <img style="width:30px ;height:30px ;margin-left:100px"  src="${contextPath}/assets/src/css/img/warning.png"></h1>
    </div>
    <div id="demo" class="qimo8">
  <div class="qimo">
        <div id="demo1" class="nav-header navbar-left">
        <ul id="con1"><ul>
    
    </div>
            <div id="demo2"></div>
            </div>
            </div>
       <div id="demo1" class="nav-header navbar-right" style="margin-top:-50px">      
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
            	window.location.reload() ;
            }
        });
}
</script>
<script>
var CID = '${sessionScope.companyId}';
var COMPANY_NAME = '${sessionScope.companyName}';
var admin = '${sessionScope.isAdminLogin}';
</script>

    <script type="text/javascript">
    var demo = document.getElementById("demo");
    var demo1 = document.getElementById("demo1");
    var demo2 = document.getElementById("demo2");
    demo2.innerHTML=document.getElementById("demo1").innerHTML;
    function Marquee(){
    if(demo.scrollLeft-1000>=0){
     demo.scrollLeft-=1000;
    }
    else{
     demo.scrollLeft++;
    }
    }
    var myvar=setInterval(Marquee,30);
    demo.onmouseout=function (){myvar=setInterval(Marquee,30);}
    demo.onmouseover=function(){clearInterval(myvar);}
    </script>