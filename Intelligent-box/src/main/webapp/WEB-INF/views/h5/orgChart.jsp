<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>企业组织结构</title>
<meta name="keywords" content="">
<meta name="description" content="">
<meta name="author" content="hy">
<!-- <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"> -->
<style>
html, body { padding: 0; margin: 0; }
.tree ul{padding-top:20px;position:relative;transition:all 0.5s;-webkit-transition:all 0.5s;-moz-transition:all 0.5s}.tree li{float:left;text-align:center;list-style-type:none;position:relative;padding:20px 5px 0 5px;transition:all 0.5s;-webkit-transition:all 0.5s;-moz-transition:all 0.5s}.tree li::before,.tree li::after{content:'';position:absolute;top:0;right:50%;border-top:1px solid #ccc;width:50%;height:20px}.tree li::after{right:auto;left:50%;border-left:1px solid #ccc}.tree li:only-child::after,.tree li:only-child::before{display:none}.tree li:only-child{padding-top:0}.tree li:first-child::before,.tree li:last-child::after{border:0 none}.tree li:last-child::before{border-right:1px solid #ccc;border-radius:0 5px 0 0;-webkit-border-radius:0 5px 0 0;-moz-border-radius:0 5px 0 0}.tree li:first-child::after{border-radius:5px 0 0 0;-webkit-border-radius:5px 0 0 0;-moz-border-radius:5px 0 0 0}.tree ul ul::before{content:'';position:absolute;top:0;left:50%;border-left:1px solid #ccc;width:0;height:20px}.tree li a{border:1px solid #ccc;padding:5px 10px;text-decoration:none;color:#333;font-family:arial,verdana,tahoma;font-size:14px;display:inline-block;border-radius:5px;-webkit-border-radius:5px;-moz-border-radius:5px;transition:all 0.5s;-webkit-transition:all 0.5s;-moz-transition:all 0.5s}.tree li a:hover,.tree li a:hover+ul li a{background:#c8e4f8;color:#000;border:1px solid #94a0b4}.tree li a:hover+ul li::after,.tree li a:hover+ul li::before,.tree li a:hover+ul::before,.tree li a:hover+ul ul::before{border-color:#94a0b4}
.clearfix:before,.clearfix:after { content: " "; display: table;}
.clearfix{ *zoom: 1; }
</style>
</head>
<body>
<c:choose>
<c:when test="${id==1}">
<ul id="org-chart" class="tree clearfix">
    <li>
        <a href="#">中移杭州研发中心（海创）</a>
        <ul>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=9">创新业务产品部</a>
                <ul>
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">UED组</a>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=2">咪咕组</a>
                    </li>
                    <!-- <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">助理组</a>
                    </li> -->
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=5">模型组</a>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=6">平台组</a>
                    </li>
                    <!-- <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">产品组</a>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">运营组</a>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">WEB组</a>
                    </li> -->
                    <li>
                        <a href="${pageContext.request.contextPath}/api/company/contact?id=8">个人助理开发组</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=4">质量测试部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=2">运营支撑部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=3">安全产品部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=5">企业发展部</a>
            </li>
        </ul>
    </li>
</ul>
</c:when>
<c:when test="${id==2}">
<ul id="org-chart" class="tree clearfix">
    <li>
        <a href="${pageContext.request.contextPath}/api/company/contact?id=1">中移杭州研发中心（新座）</a>
        <ul>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">综合部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">市场拓展部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">融合通信系统部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">终端应用产品部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">智慧互联产品部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">计划财务部</a>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/api/company/contact?id=1">人力资源部</a>
            </li>
        </ul>
    </li>
</ul>
</c:when>
</c:choose>
<script type="text/javascript">
</script>
</body>
</html>