<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>欢迎</title>
<meta name="keywords" content="">
<meta name="description" content="">
<meta name="author" content="hy">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
<style>
html, body { padding: 0; margin: 0; }
.company-info { margin: 0 auto;  width: 80%;  font-size: 14px; line-height: 1.5; color: #333; }
</style>
</head>
<body>
<p>欢迎您！</p>
<h1><c:out value="${mobile}" /></h1>
</body>
</html>