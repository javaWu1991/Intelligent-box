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
                    <div class="panel-title">默认产品列表</div>
                </div>
                <div class="panel-body">
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
                                <th>创建时间</th> 
                                <th>原价格</th>                            
                                <th>折扣价</th>
                                <th>优惠后价格</th>
                                <th>产品数量</th>
                                <th>货柜编码</th>   
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody role="items">
                            <script type="text/html" id="tmpl-item">
                            <td width="50">{{model.index}}</td>
                            <td width="60">{{model.productName}}</td>
                            <td width="140">{{model.createTimeText}}</td>                       
                            <td width="60">{{model.originalPrice}}</td>
                            <td width="60">{{model.discount}}</td>
                            <td width="80">{{model.favorablePrice}}</td>
                            <td width="60">{{model.productNumber}}</td>
                            <td width="60">{{model.containerNumber}}</td>
                            <td class="col-actions" width="210">
                                <a href="javascript:void(0);" data-do="edit">编辑</a>
                            </td>
                            </script>
                        </tbody>
                    </table>
                     <div class="toolbar-bottom"></div>
                </div>
            </div>
        </div><!-- end page main -->
    </div><!-- end page content -->
</div>
<script>seajs.use('page/system/defaultProduct', function(page){ page.run(); });
function sum(){
	
	 var a = $('#inputOriginalPrice').val(); 
	 var b = $('#inputDiscount').val(); 
	    var sum= Number(a) - Number(b); 
	    $('#inputFavorablePrice').val(Number(sum)); 
}
function checkNumber(e,txt)

{
var key = window.event ? e.keyCode : e.which;

var keychar = String.fromCharCode(key);

reg = /\d|\./;

var result = reg.test(keychar);

if(result)

{

    if(e.keyCode==46)

        result=!(txt.value.split('.').length>1);

    else

        result=!(txt.value.split('.').length>1 && txt.value.split('.')[1].length>1);

}

if(!result)

{    

    return false;

}

else

{ 
    return true;

}

}
</script>
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
                    <div class="col-md-5 col-sm-6">
                        <div class="form-group">
                            <label for="inputName">产品名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputProductName" name="productName" placeholder="产品名称">
                        </div>
                        <div class="form-group">
                             <label for="inputPicfile" class="control-label">产品图片<i class="required">*</i></label>
                            <input type="file" class="form-control" id="inputmr" name="mr" placeholder="产品图片">
                        </div>
                        <div class="form-group">
                            <label for="inputScale">原价格</label>
                            <input type="text" class="form-control" id="inputOriginalPrice" name="originalPrice" placeholder="原价格" onkeypress="return checkNumber(event,this);">
                        </div>
                        <div class="form-group">
                            <label for="inputContactsMobile">折扣</label>
                            <input type="text" class="form-control" id="inputDiscount" name="discount" placeholder="折扣" onkeypress="return checkNumber(event,this);">
                        </div>
                        <div class="form-group">
                            <label for="inputContacts">优惠后价格</label>
                            <input type="text" class="form-control" id="inputFavorablePrice" name="favorablePrice" placeholder="优惠后价格 " onClick="sum();">
                        </div>
                        <div class="form-group">
                            <label for="inputAccount">产品数量</label>
                            <input type="number" class="form-control" id="inputProductNumber" name="productNumber" placeholder="产品数量">
                        </div>
                    </div>
                    <div class="col-md-7 col-sm-6">
                 <div class="form-group">
                            <label for="inputAppId">产品类别</label>
                            <select id="type" name="type" class="form-control" style="background-color:transparent;border:0;">
                               <option value="1">安全套</option>
                               <option value="2">情趣内衣</option>
                               <option value="3">跳蛋</option>
                               <option value="4">飞机杯</option>
                               <option value="5">精油</option>
                               <option value="6">湿巾</option>
                               <option value="7">喷剂</option>
                               <option value="0">其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="inputAppId">货柜编号</label>
                            <input type="text" class="form-control" id="inputContainerNumber" name="containerNumber" placeholder="货柜编号">
                        </div>
                         <div class="form-group">
                            <label for="inputMchId">产品说明</label>
                            <input type="text" class="form-control" id="inputRemark" name="remark" placeholder="产品说明">
                        </div>
                           <div class="form-group">
                            <label for="inputContent" class="control-label">产品详情<i class="required">*</i></label>
                            <textarea id="editor" name="productDetail" type="text/plain"></textarea>
                        </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
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
            <h4 class="modal-title">编辑产品</h4>
        </div>
        <div class="modal-body">
           <form method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-5 col-sm-6">
                <input type="hidden" name="id" value="{{model.id}}">
                        <div class="form-group">
                            <label for="inputName">产品名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputProductName" name="productName" value="{{model.productName}}" placeholder="产品名称">
                        </div>
                          <div class="form-group">
                            <label for="inputmr" class="control-label">封面<i class="required">*</i></label>
                            <div><img src="{{model.productImg}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div>
                            <input type="file" class="form-control" id="inputmr" name="mr" placeholder="封面" data-value="{{model.productImg}}">
                        </div>
                        <div class="form-group">
                            <label for="inputScale">原价格</label>
                            <input type="text" class="form-control" id="inputOriginalPrice" name="originalPrice" placeholder="原价格" value="{{model.originalPrice}}" onkeypress="return checkNumber(event,this);">
                        </div>
                        <div class="form-group">
                            <label for="inputContactsMobile">折扣</label>
                            <input type="text" class="form-control" id="inputDiscount" name="discount" placeholder="折扣"  value="{{model.discount}}" onkeypress="return checkNumber(event,this);">
                        </div>
                        <div class="form-group">
                            <label for="inputContacts">优惠后价格</label>
                            <input type="text" class="form-control" id="inputFavorablePrice" name="favorablePrice"  value="{{model.favorablePrice}}" placeholder="优惠后价格 " onClick="sum();">
                        </div>
                        <div class="form-group">
                            <label for="inputAccount">产品数量</label>
                            <input type="number" class="form-control" id="inputProductNumber"  value="{{model.productNumber}}" name="productNumber" placeholder="产品数量">
                        </div>
                    </div>
                    <div class="col-md-7 col-sm-6">
                                   <div class="form-group">
                            <label for="inputAppId">产品类别</label>
                            <select id="type" name="type" class="form-control" style="background-color:transparent;border:0;">
                            <option value="{{model.type}}">{{model.typeText}}</option>
                               <option value="1">安全套</option>
                               <option value="2">情趣内衣</option>
                               <option value="3">跳蛋</option>
                               <option value="4">飞机杯</option>
                               <option value="5">精油</option>
                               <option value="6">湿巾</option>
                               <option value="7">喷剂</option>
                               <option value="0">其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="inputAppId">货柜编号</label>
                            <input type="text" class="form-control" id="inputContainerNumber" name="containerNumber"  value="{{model.containerNumber}}" placeholder="货柜编号">
                        </div>
  <div class="form-group">
                            <label for="inputMchId">产品说明</label>
                            <input type="text" class="form-control" id="inputRemark" name="remark" value="{{model.remark}}" placeholder="产品说明">
                        </div>
                           <div class="form-group">
                            <label for="inputContent" class="control-label">产品详情<i class="required">*</i></label>
                            <textarea id="editor" name="productDetail" type="text/plain">{{model.productDetail}}</textarea>
                        </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
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