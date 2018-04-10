<%@ page language="java" pageEncoding="utf-8"%>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<div class="navbar-default navbar-static-side" role="navigation">
    <ul class="primary-nav metismenu">
        <shiro:hasPermission name="company">
        <li><a href="${contextPath}/web/company/list.htm"><i class="fa fa-cubes"></i> <span class="nav-label">酒店管理</span></a></li>
        </shiro:hasPermission>
        <shiro:hasPermission name="admin">
        <li><a href="javascript:void(0);"><i class="fa fa-user-secret"></i> <span class="nav-label">管理员管理</span> <span class="fa arrow"></span></a>
            <ul class="nav-second-level collapse">
                <shiro:hasAnyRoles name="admin,customerManager">
                    <li><a href="${contextPath}/web/system/companyAdmin.htm">酒店管理员</a></li>
                </shiro:hasAnyRoles>
                <shiro:hasAnyRoles name="admin,areaManager">
                    <li><a href="${contextPath}/web/system/areaAdmin.htm">区域管理员</a></li>
                </shiro:hasAnyRoles>
                <shiro:hasAnyRoles name="admin,customerManager">
                    <li><a href="${contextPath}/web/system/customManager.htm">后勤管理</a></li>
                </shiro:hasAnyRoles>
            </ul>
        </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="companyInfo">
        <!-- <li><a href="${contextPath}/web/system/companyInfo.htm"><i class="fa fa-wrench"></i> <span class="nav-label">企业信息</span></a></li> -->
        </shiro:hasPermission>
        <li><a href="javascript:void(0);"><i class="fa fa-comments"></i> <span class="nav-label">产品管理</span> <span class="fa arrow"></span></a>
            <ul class="nav-second-level collapse">
                <li><a href="${contextPath}/web/boxWeb/productList.htm">产品列表</a></li>
                <%--<li>
                     <a href="${contextPath}/web/pendingNotice.htm">待审核</a> 
                </li>--%>
            </ul>
        </li>
        <li><a href="javascript:void(0);"><i class="fa fa-bar-chart"></i> <span class="nav-label">统计管理</span> <span class="fa arrow"></span></a>
            <ul class="nav-second-level collapse">
                <li><a href="${contextPath}/web/system/report.htm?view=realtime">实时分析</a></li>
                <li><a href="${contextPath}/web/system/report.htm?view=area">地域分布</a></li>
                <li><a href="${contextPath}/web/system/report.htm?view=goods">订单分析</a></li>
            </ul>
        </li>          
        <!-- <li><a href="${contextPath}/web/system/area.htm"><i class="fa fa-map-marker"></i> <span class="nav-label">产品管理</span></a></li>  -->  
    </ul>
</div>