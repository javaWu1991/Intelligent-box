<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="酒店管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">企业列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            地区：<select class="form-control">
                                <option value="1">北京</option>
    
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="name" placeholder="企业名称">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="m-b">
                    	<shiro:hasAnyRoles name="admin">
                        <button type="button" class="btn btn-default" data-do="create:company"><i class="fa fa-plus" aria-hidden="true"></i> 新建</button>
                        </shiro:hasAnyRoles>
                    </div>
                    <div class="table-responsive">
                        <table id="sole-table" class="datatable table table-bordered table-striped">
                            <thead>
                                <tr role="col-headers">
                                    <th><input type="checkbox" data-do="toggleAll"></th>
                                    <th>酒店名称</th>
                                    <th>编码</th>
                                    <th>地区</th>
                                    <th>规模</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody role="items">
                                <script type="text/html" id="tmpl-companyItem">
                                <td class="col-checkbox"><input type="checkbox" data-do="toggleOne"></td>
                                <td class="col-company">
                                    <span data-toggle="tooltip" title="{{model.name}}">{{model.name}}</span>
                                </td>
                                <td class="col-code">{{model.code}}</td>
                                <td class="col-area">
                                    <span data-toggle="tooltip" title="{{model.provinceName}} {{model.cityName}} {{model.areaName}}">{{model.provinceName}} {{model.cityName}} {{model.areaName}}</span>
                                </td>
                                <td class="col-scale">{{model.scale}}</td>
                                <td class="col-status">{{model.statusText}}</td>
                                <td class="col-datetime">{{model.createTimeText}}</td>
                                <td class="col-actions">
								<shiro:hasAnyRoles name="admin,areaManager">
                                <a href="javascript:void(0);" data-do="setManager">分配区域管理员</a>
								</shiro:hasAnyRoles>
								<shiro:hasAnyRoles name="admin,customerManager">
                                <a href="${contextPath}/web/system/companyAdmin.do?cid={{model.id}}">管理员维护</a>
                                <a href="javascript:void(0);" data-do="edit">编辑</a>
                                <# if(model.status == 1) { #>
                                <a href="javascript:void(0);" data-do="disable">停用</a>
                                <# } else if(model.status == 0) { #>
                                <a href="javascript:void(0);" data-do="enable">启用</a>
                                <# } #>
                                <a href="javascript:void(0);" data-do="delete">删除</a>
								</shiro:hasAnyRoles>
                                </td>
                                </script>
                            </tbody>
                        </table>
                        <div class="toolbar-bottom"></div>
                    </div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=BxmYo69b8MhlHdm4IzemPHCrdyluaBHg"></script>
<script>seajs.use('page/company/list', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-setManagerModal">
<div class="modal-dialog" style="width:800px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">设置 [{{model.name}}] 区域管理员</h4>
        </div>
        <div class="modal-body">
            <form method="post">
                <input type="hidden" name="cid" value="{{model.id}}">
                <table class="datatable table table-bordered table-hover">
                    <thead>
                        <tr role="col-headers">
                            <th>&nbsp;</th>
                            <th>登录账号</th>
                            <th>真实姓名</th>
                            <th>用户类型</th>
                            <th>联系方式</th>
                        </tr>
                    </thead>
                    <tbody role="items"></tbody>
                </table>
            </form>
            <div class="toolbar-bottom clearfix"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-default" data-do="cancelSet">取消设置</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script type="text/html" id="tmpl-customerManagerItem">
<td style="text-align:center"><input type="radio" value="{{model.account}}" name="account"<# if(model.$checked) { #> checked="checked"<# } #>></td>
<td>{{model.account}}</td>
<td>{{model.name}}</td>
<td>{{model.type}}</td>
<td>{{model.mobile}}</td>
</script>
<script type="text/template" id="tmpl-companyCreateModal">
<div class="modal-dialog" style="width:800px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">新建企业</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-5 col-sm-6">
                        <div class="form-group">
                            <label for="inputName">企业名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" placeholder="企业名称">
                        </div>
                        <div class="form-group">
                            <label for="inputArea">地区<i class="required">*</i></label>
                            <div class="area-picker"></div>
                        </div>
                        <div class="form-group">
                            <label for="inputAddress">地址</label>
                            <input type="text" class="form-control" id="inputAddress" name="adress" placeholder="街道地址">
                        </div>
                        <div class="form-group">
                            <label for="inputScale">酒店规模</label>
                            <input type="text" class="form-control" id="inputScale" name="scale" placeholder="酒店规模">
                        </div>
                        <div class="form-group">
                            <label for="inputContacts">酒店联系人</label>
                            <input type="text" class="form-control" id="inputContacts" name="contacts" placeholder="联系人姓名">
                        </div>
                        <div class="form-group">
                            <label for="inputContactsMobile">酒店联系人手机号</label>
                            <input type="text" class="form-control" id="inputContactsMobile" name="contactsMobile" placeholder="联系人手机号">
                        </div>
                        <div class="form-group">
                            <label for="inputAccount">管理员手机号</label>
                            <input type="text" class="form-control" id="inputAccount" name="account" placeholder="管理员手机号">
                        </div>
                    </div>
                    <div class="col-md-7 col-sm-6">
                        <div class="form-group">
                            <label for="inputAppId">公众号ID</label>
                            <input type="text" class="form-control" id="inputAppId" name="appId" placeholder="公众号ID">
                        </div>
                        <div class="form-group">
                            <label for="inputMchId">商户号</label>
                            <input type="text" class="form-control" id="inputMchId" name="mchId" placeholder="商户号">
                        </div>
                        <div class="form-group">
                            <label for="inputLoc">地理位置标注</label>
                            <div class="row m-b">
                                <div class="col-md-5"><input type="text" class="form-control" id="inputLng" name="longitude" readonly="readonly"></div>
                                <div class="col-md-5"><input type="text" class="form-control" id="inputLat" name="latitude" readonly="readonly"></div>
                            </div>
                            <div class="map" id="loc"></div>
                            <p class="help-block">拖动标记进行位置标注</p>
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
<script type="text/template" id="tmpl-companyEditModal">
<div class="modal-dialog" style="width:800px">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑 {{model.name}}</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="id" value="{{model.id}}">
                <div class="row">
                    <div class="col-md-5 col-sm-6">
                        <div class="form-group">
                            <label for="inputName">企业名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="企业名称">
                        </div>
                        <div class="form-group">
                            <label for="inputArea">地区<i class="required">*</i></label>
                            <div class="area-picker"></div>
                        </div>
                        <div class="form-group">
                            <label for="inputAddress">地址</label>
                            <input type="text" class="form-control" id="inputAddress" name="adress" placeholder="街道地址" value="{{model.adress}}">
                        </div>
                        <div class="form-group">
                            <label for="inputScale">酒店规模</label>
                            <input type="text" class="form-control" id="inputScale" name="scale" value="{{model.scale}}" placeholder="酒店规模">
                        </div>
                        <div class="form-group">
                            <label for="inputContacts">酒店联系人</label>
                            <input type="text" class="form-control" id="inputContacts" name="contacts" value="{{model.contacts}}" placeholder="联系人姓名">
                        </div>
                        <div class="form-group">
                            <label for="inputContactsMobile">酒店联系人手机号</label>
                            <input type="text" class="form-control" id="inputContactsMobile" name="contactsMobile" value="{{model.contactsMobile}}" placeholder="联系人手机号">
                        </div>
                    </div>
                    <div class="col-md-7 col-sm-6">
               <div class="form-group">
                            <label for="inputAppId">公众号ID</label>
                            <input type="text" class="form-control" id="inputAppId" name="appId" value="{{model.appId}}" placeholder="公众号ID">
                        </div>
                        <div class="form-group">
                            <label for="inputMchId">商户号</label>
                            <input type="text" class="form-control" id="inputMchId" name="mchId" value="{{model.mchId}}" placeholder="商户号">
                        </div>
                        <div class="form-group">
                            <label for="inputLoc">地理位置标注</label>
                            <div class="row m-b">
                                <div class="col-md-5"><input type="text" class="form-control" id="inputLng" name="longitude" value="{{model.longitude}}" readonly="readonly"></div>
                                <div class="col-md-5"><input type="text" class="form-control" id="inputLat" name="latitude" value="{{model.latitude}}" readonly="readonly"></div>
                            </div>
                            <div class="map" id="loc"></div>
                            <p class="help-block">拖动标记进行位置标注</p>
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
<script type="text/html" id="tmpl-bulkAction">
<shiro:hasAnyRoles name="admin,customerManager">
<a href="javascript:void(0);" data-do="bulk:delete">删除</a>
<a href="javascript:void(0);" data-do="bulk:disable">禁用</a>
<a href="javascript:void(0);" data-do="bulk:enable">启用</a>
</shiro:hasAnyRoles>
</script>
</body>
</html>