<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow:auto;height:300px;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="版本管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">版本管理</div>
                </div>
                <div class="panel-body">  
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                           	 类型：<select class="form-control" name="type">
                                <option value="0">安卓</option>
                                <option value="1">iOS</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="appVersion" placeholder="版本号">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="m-b">
                        <div class="dropdown">
                            <button id="appType" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-default dropdown-toggle"><i class="fa fa-plus" aria-hidden="true"></i> 新建 <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="appType">
                                <li><a href="javascript:void(0);" data-do="create:android">安卓</a></li>
                                <li><a href="javascript:void(0);" data-do="create:ios">iOS</a></li>
                            </ul>
                        </div>
                    </div>
                    <br>
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>版本号（数字）</th>
                                <th>版本显示号</th>
                                <th>更新人</th>
                                <th>更新策略</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="140">{{model.appVersion}}</td>
                            <td width="140">{{model.appShowVersion}}</td>
                            <td width="140">{{model.updaterName}}</td>
                            <td>{{model.updateDes}}</td>
                            </script>
                        </tbody>
                    </table>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>
var  ANDROID_VERSION= ${sessionScope.Android};
var  IOS_VERSION= ${sessionScope.IOS};
</script>
<script>seajs.use('page/system/version', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-androidCreateModal">
<div class="modal-dialog" >
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="name" value="${sessionScope.userName}">
                <div class="row">
                    <div class="col-sm-7 col-md-7">
     					<div class="form-group">
                            <label for="inputApkfile" class="control-label">版本上传<i class="required">*</i></label>
                            <img src="" data-src="" />
                            <input type="file" class="form-control" id="inputApkfile" name="apk" placeholder="">
                        </div>
                        <div class="form-group">
                            <label for="version" class="control-label">版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="version" name="version" placeholder="版本号">
                        </div>
                        <div class="form-group">
                            <label for="showVersion" class="control-label">显示版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="showVersion" name="showVersion" placeholder="显示版本号">
                        </div>
 		  			    <div class="form-group">
                            <label for="android-isAllUpdate" class="control-label">版本升级</label>
							<div class="row">
                   		    	<div class="col-sm-6 col-md-6">
									<select class="form-control android-isAllUpdate" name="isAllUpdate" id="android-isAllUpdate">
                               			 <option value="1">全量</option>
                                		 <option value="0">灰度</option>
                          	    	</select>
								</div>
                   		    	<div class="col-sm-6 col-md-6">
									<select class="form-control" name="isGrayUpdate">
                               			 <option value="1">强制</option>
                                		 <option value="0">可选</option>
                           			 </select>
								</div>
							</div>
                	    </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">更新摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="description" placeholder="更新摘要"></textarea>
                        </div>   
                    </div>
                    <div class="col-sm-5 col-md-5 android-recevier" style="display:none">
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人</label>
                            <div class="org">
                                <ul class="ztree dept-tree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>
<script type="text/template" id="tmpl-iosCreateModal">
<div class="modal-dialog" >
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="name" value="${sessionScope.userName}">
                <div class="row">
                    <div class="col-sm-7 col-md-7">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">Ipaurl<i class="required">*</i></label>
                            <input type="text" class="form-control" id="ipaUrl" name="ipaUrl" placeholder="url">
                        </div>
                        <div class="form-group">
                            <label for="iosVersion" class="control-label">版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="iosVersion" name="version" placeholder="版本号">
                        </div>
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">显示版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="showVersion" name="showVersion" placeholder="显示版本号">
                        </div>
 		  			    <div class="form-group">
						    <label for="ios-isAllUpdate" class="control-label">版本升级</label>
							<div class="row">
                   		    	<div class="col-sm-6 col-md-6">
									<select class="form-control ios-isAllUpdate" name="isAllUpdate" >
                               			 <option value="1">全量</option>
                                		 <option value="0">灰度</option>
                          	    	</select>
								</div>
                   		    	<div class="col-sm-6 col-md-6">
									<select class="form-control" name="isMandatory">
                               			 <option value="1">强制</option>
                                		 <option value="0">可选</option>
                           			 </select>
								</div>
							</div>
                	    </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">更新摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="description" placeholder="更新摘要"></textarea>
                        </div>   
                    </div>
                    <div class="col-sm-5 col-md-5 ios-recevier" style="display:none">
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人</label>
                            <div class="org">
                                <ul class="ztree dept-tree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script>
UMEDITOR_HOME_URL = '${contextPath}/assets/dep/umeditor/';
</script>
</body>
</html>