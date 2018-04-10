<%@ page language="java" pageEncoding="utf-8"%>
<div class="navbar navbar-static-top navbar-fixed-top" role="navigation">
    <div class="nav-header navbar-left">
        <h1>货柜| <c:out value="${sessionScope.companyName}"/> 管理后台</h1>
    </div>
    <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
            <a href="javascript:void(0);" id="dropdown-account" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-user"></i> ${sessionScope.userName} <span class="caret"></span>
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