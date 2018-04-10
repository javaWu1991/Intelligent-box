<%@ page pageEncoding="utf-8"%> 
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>   
<!DOCTYPE html>  
<html>  
<head>  
<meta charset="utf-8">  
<title>上传图片</title>  
</head>  
<body>  

<shiro:user>  
欢迎[<shiro:principal/>]登录，<a href="${pageContext.request.contextPath}/logout">退出</a>  
</shiro:user>   


添加内部应用
<form action="http://127.0.0.1:8080/yiqi/web/apply/addApply.do" method="post" enctype="multipart/form-data">
type<input type="text" name="type" />
<br />
id<input type="text" name="isInside" />
<br />
应用名称<input type="text" name="name" />
<br />
应用程序：<input type="file" name="apkFile" />
<br />
程序图标：<input type="file" name="icoFile" />
<br />
图片1<input type="file" name="imgFiles" />
<br />
图片2<input type="file" name="imgFiles" />
<br />
图片3<input type="file" name="imgFiles" />
<br />
图片4<input type="file" name="imgFiles" />
<br />
免登录： 是<input type="radio" checked="checked" name="needLogin" value="0" />
<br />
否
<input type="radio" name="needLogin" value="1" />
<br />
传送参数：手机号码<input type="checkbox" name="loginMobile" value="1"/>  用户id <input type="checkbox" name="loginUserid"  value="1"/> 渠道号 <input type="checkbox" name="loginChannel"  value="1"/>
<br />
免否开发： 是<input type="radio" checked="checked" name="isopen" value="1" />
否
<input type="radio" name="isopen" value="0" />
<br />
选择人员：
人员1<input type="checkbox" name="userIds" value="1"/> 
人员2<input type="checkbox" name="userIds" value="12"/> 
人员3<input type="checkbox" name="userIds" value="13"/> 
人员4<input type="checkbox" name="userIds" value="14"/> 
人员5<input type="checkbox" name="userIds" value="15"/> 
人员6<input type="checkbox" name="userIds" value="16"/> 
人员7<input type="checkbox" name="userIds" value="17"/> 
<input type="submit" value="Submit" />
</form>

添加安卓应用
<form action="http://172.20.14.113:8080/yiqi/web/apply/addApply.do" method="post" enctype="multipart/form-data">
type<input type="text" name="type" />
<br />
id<input type="text" name="id" />
<br />
应用名称<input type="text" name="name" />
<br />
应用程序：<input type="file" name="apkFile" />
<br />
程序图标：<input type="file" name="icoFile" />
<br />
图片1<input type="file" name="imgFiles" />
<br />
图片2<input type="file" name="imgFiles" />
<br />
图片3<input type="file" name="imgFiles" />
<br />
图片4<input type="file" name="imgFiles" />
<br />
免登录： 是<input type="radio" checked="checked" name="needLogin" value="0" />
<br />
否
<input type="radio" name="needLogin" value="1" />
<br />
传送参数：手机号码<input type="checkbox" name="loginMobile" value="1"/>  用户id <input type="checkbox" name="loginUserid"  value="1"/> 渠道号 <input type="checkbox" name="loginChannel"  value="1"/>
<br />
免否开发： 是<input type="radio" checked="checked" name="isopen" value="1" />
否
<input type="radio" name="isopen" value="0" />
<br />
选择人员：
人员1<input type="checkbox" name="userIds" value="1"/> 
人员2<input type="checkbox" name="userIds" value="12"/> 
人员3<input type="checkbox" name="userIds" value="13"/> 
人员4<input type="checkbox" name="userIds" value="14"/> 
人员5<input type="checkbox" name="userIds" value="15"/> 
人员6<input type="checkbox" name="userIds" value="16"/> 
人员7<input type="checkbox" name="userIds" value="17"/> 
<input type="submit" value="Submit" />
</form>
<br/>
<br/>
<br/>
添加ios应用
<form action="http://172.20.14.113:8080/yiqi/web/apply/addApply.do" method="post" enctype="multipart/form-data">
type<input type="text" name="type" />
<br />
id<input type="text" name="id" />
<br />
应用名称<input type="text" name="name" />
<br />
应用链接：<input type="text" name="applyProcedure" />
<br />
启动参数：<input type="text" name="startupParameter" />
<br />
程序图标：<input type="file" name="icoFile" />
<br />
图片1<input type="file" name="imgFiles" />
<br />
图片2<input type="file" name="imgFiles" />
<br />
图片3<input type="file" name="imgFiles" />
<br />
图片4<input type="file" name="imgFiles" />
<br />
免登录： 是<input type="radio" checked="checked" name="needLogin" value="0" />
<br />
否
<input type="radio" name="needLogin" value="1" />
<br />
传送参数：手机号码<input type="checkbox" name="loginMobile" value="1"/>  用户id <input type="checkbox" name="loginUserid"  value="1"/> 渠道号 <input type="checkbox" name="loginChannel"  value="1"/>
<br />
免否开发： 是<input type="radio" checked="checked" name="isopen" value="1" />
否
<input type="radio" name="isopen" value="0" />
<br />
选择人员：
人员1<input type="checkbox" name="userIds" value="1"/> 
人员2<input type="checkbox" name="userIds" value="12"/> 
人员3<input type="checkbox" name="userIds" value="13"/> 
人员4<input type="checkbox" name="userIds" value="14"/> 
人员5<input type="checkbox" name="userIds" value="15"/> 
人员6<input type="checkbox" name="userIds" value="16"/> 
人员7<input type="checkbox" name="userIds" value="17"/> 
<input type="submit" value="Submit" />
</form>

<br/>
<br/>
<br/>
添加html5
<form action="http://172.20.14.113:8080/yiqi/web/apply/addApply.do" method="post" enctype="multipart/form-data">
type<input type="text" name="type" />
<br />
id<input type="text" name="id" />
<br />
应用名称<input type="text" name="name" />
<br />
应用链接：<input type="text" name="applyProcedure" />
<br />
启动参数：<input type="text" name="startupParameter" />
<br />
程序图标：<input type="file" name="icoFile" />
<br />
图片1<input type="file" name="imgFiles" />
<br />
图片2<input type="file" name="imgFiles" />
<br />
图片3<input type="file" name="imgFiles" />
<br />
图片4<input type="file" name="imgFiles" />
<br />
免登录： 是<input type="radio" checked="checked" name="needLogin" value="0" />
<br />
否
<input type="radio" name="needLogin" value="1" />
<br />
传送参数：手机号码<input type="checkbox" name="loginMobile" value="1"/>  用户id <input type="checkbox" name="loginUserid"  value="1"/> 渠道号 <input type="checkbox" name="loginChannel"  value="1"/>
<br />
免否开发： 是<input type="radio" checked="checked" name="isopen" value="1" />
否
<input type="radio" name="isopen" value="0" />
<br />
选择人员：
人员1<input type="checkbox" name="userIds" value="1"/> 
人员2<input type="checkbox" name="userIds" value="12"/> 
人员3<input type="checkbox" name="userIds" value="13"/> 
人员4<input type="checkbox" name="userIds" value="14"/> 
人员5<input type="checkbox" name="userIds" value="15"/> 
人员6<input type="checkbox" name="userIds" value="16"/> 
人员7<input type="checkbox" name="userIds" value="17"/> 
<input type="submit" value="Submit" />
</form>

</body>  
</html>  
