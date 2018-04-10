<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<link rel="stylesheet" href="${contextPath}/assets/dep/zTree/css/zTreeStyle/zTreeStyle.css"/>
<link rel="stylesheet" href="${contextPath}/assets/src/css/phoneSimulate.css">
<link href="${contextPath}/assets/dep/umeditor/themes/default/css/umeditor.min.css" type="text/css" rel="stylesheet">
<link rel="stylesheet" type="text/css" media="all" href="${contextPath}/assets/dep/bootstrap-daterangepicker/2.1.14/daterangepicker.css"/>
<style>.org{border:1px solid #cccccc;}.dept-tree{overflow:auto;height:300px;} .form-control:focus{box-shadow: none;}</style>
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
        <!-- screen title -->
        <c:set var="screenTitle" value="产品管理" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
        <div class="wrapper wrapper-content">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">产品列表</div>
                </div>
                <div class="panel-body">
                    <form id="search" class="form-filter form-inline">
                        <div class="form-group">
                            产品状态：<select class="form-control" name="status">
                                <option value="">全部</option>
                                <option value="0">缺货</option>
                                <option value="1">有货</option>
                                <option value="2">热销</option>
                                 <option value="3">下架</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" name="title" placeholder="产品名称">
                        </div>
                        <button type="submit" class="btn btn-default">搜索</button>
                        <button type="reset" class="btn btn-default" data-do="reset">重置搜索条件</button>
                    </form>
                    <hr />
                    <div class="btn-group" role="group">
                        <a href="javascript:void(0);" class="btn btn-default" data-do="create:notice"><span class="fa fa-plus" aria-hidden="true"></span> 添加产品</a>
                    </div>
                    <br>
                    <br>
                    <table id="datatable" class="datatable table table-bordered table-hover">
                        <thead>
                            <tr role="col-headers">
                                <th>序号</th>
                                <th>产品名称</th>
                                <th>产品状态</th>
                                <th>创建时间</th> 
                                <th>原价格</th>
                                <th>优惠后价格</th>
                                <th>折扣价</th>
                                <th>产品数量</th>
                                <th>货柜编码</th>
                                <th>机器编码</th>          
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td width="200">{{model.title}}</td>
                            <td width="80">普通公告</td>
                            <!--<td>&nbsp;</td>-->
                            <td>{{model.sender}}</td>
                            <td width="160">{{model.createTimeText}}</td>
                            <td width="60">{{model.statusText}}</td>
                            <td class="col-actions" width="200">
                                <a href="javascript:void(0);" data-do="edit">编辑</a>
                                <a href="${contextPath}/api/messages/message/detail/{{model.id}}" target="_blank">详情</a>
                                <# if(model.sort == 0) { #>
                                <a href="javascript:void(0);" data-do="stick">取消置顶</a>
                                <# } else { #>
                                <a href="javascript:void(0);" data-do="stick">置顶</a>
                                <# } #>
                                <a href="javascript:void(0);" data-do="delete">删除</a>
                            </td>
                            </script>
                        </tbody>
                    </table>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/notice', function(page){ page.run(); });</script>
<script type="text/template" id="tmpl-noticeCreateModal">
<div class="modal-dialog" style="min-width:960px;width:90%">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">添加产品</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-sm-8 col-md-9">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">标题<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputTitle" name="title" placeholder="公告标题">
                        </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="detail" placeholder="公告摘要"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="inputDate" class="control-label">创建时间<i class="required">*</i></label>
                            <div class="input-prepend demo"><input readonly="readonly" type="text" data-ui="datatimerange" class="form-control" style="padding:0 6px 0 28px"><i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputContent" class="control-label">正文<i class="required">*</i></label>
                            <textarea id="editor" name="content" type="text/plain"></textarea>
                        </div>
                    </div>
                    <div class="col-sm-4 col-md-3">
                        <div class="form-group">
                            <label class="control-label">是否发送短信</label>
                            <div class="checkbox">
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="isSend" value="1"> 发送
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPicfile" class="control-label">封面<i class="required">*</i></label>
                            <input type="file" class="form-control" id="inputPicfile" name="picfile" placeholder="封面">
                        </div>
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人<i class="required">*</i></label>
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
            <button type="button" class="btn btn-info" data-do="preview">预览</button>
            <button type="button" class="btn btn-primary" data-do="submit" id="save_add_btn">保存</button>
        </div>
    </div>
    <div class="iphone" style="display:none">
        <div class="iphone-top">
          <span class="camera"></span>
          <span class="sensor"></span>
          <span class="speaker"></span>
        </div>
        <div class="top-bar"></div>
        <div class="iphone-screen" id="iphone-screen">
          这里是手机屏幕
        </div>
        <div class="buttons">
          <span class="on-off"></span>
          <span class="sleep"></span>
          <span class="up"></span>
          <span class="down"></span>
        </div>
        <div class="bottom-bar"></div>
        <div class="iphone-bottom">
          <span></span>
        </div>
        <div class="button">
            <br><button type="button" class="btn btn-inverse" data-do="closePreview">关闭预览</button>
        </div>
    </div>
</div>
</script>
<script type="text/template" id="tmpl-noticeEditModal">
<div class="modal-dialog" style="min-width:960px;width:90%">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">编辑公告</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">

                <div class="row">
                    <div class="col-sm-8 col-md-9">
                        <input type="hidden" name="id" value="{{model.id}}">
                        <div class="form-group">
                            <label for="inputTitle" class="control-label">标题<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputTitle" name="title" value="{{model.title}}" placeholder="公告标题">
                        </div>
                        <div class="form-group">
                            <label for="inputDetail" class="control-label">摘要<i class="required">*</i></label>
                            <textarea class="form-control" id="inputDetail" name="detail" placeholder="公告摘要" >{{model.detail}}</textarea>
                        </div>
                         <div class="form-group">
                            <label for="inputDate" class="control-label">创建时间<i class="required">*</i></label>
                            <div class="input-prepend demo"><input readonly="readonly" type="text" data-ui="datatimerange" class="form-control" style="padding:0 6px 0 28px"><i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputContent" class="control-label">正文<i class="required">*</i></label>
                            <textarea id="editor" name="content" type="text/plain">{{model.content}}</textarea>
                        </div>
                    </div>
                    <div class="col-sm-4 col-md-3">
                        <div class="form-group">
                            <label for="inputPicfile" class="control-label">封面<i class="required">*</i></label>
                            <div><img src="{{model.picurl}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div>
                            <input type="file" class="form-control" id="inputPicfile" name="picfile" placeholder="封面" data-value="{{model.picurl}}">
                        </div>
                        <div class="form-group">
                            <label for="inputReciverse" class="control-label">接收人<i class="required">*</i></label>
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
            <button type="button" class="btn btn-info" data-do="preview">预览</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
    <div class="iphone" style="display:none">
        <div class="iphone-top">
          <span class="camera"></span>
          <span class="sensor"></span>
          <span class="speaker"></span>
        </div>
        <div class="top-bar"></div>
        <div class="iphone-screen" id="iphone-screen">
          这里是手机屏幕
        </div>
        <div class="buttons">
          <span class="on-off"></span>
          <span class="sleep"></span>
          <span class="up"></span>
          <span class="down"></span>
        </div>
        <div class="bottom-bar"></div>
        <div class="iphone-bottom">
          <span></span>
        </div>
        <div class="button">
            <br><button type="button" class="btn btn-inverse" data-do="closePreview">关闭预览</button>
        </div>
    </div>
</div>
</script>
<script>
UMEDITOR_HOME_URL = '${contextPath}/assets/dep/umeditor/';
</script>
</body>
</html>