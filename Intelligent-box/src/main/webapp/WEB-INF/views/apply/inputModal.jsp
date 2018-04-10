<%@ page language="java" pageEncoding="utf-8"%>
<script type="text/template" id="tmpl-androidInputModal">
<# var modalTitle = '新建应用'; if(!model._isNew) modalTitle = '编辑应用'; #>
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{modalTitle}}</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="type" value="1">
                <input type="hidden" name="isInside" value="{{model.isInside}}">
                <# if(!model._isNew) { #><input type="hidden" name="id" value="{{model.id}}"><# } #>
                <div class="form-group">
                    <label class="control-label">应用平台</label>
                    <p class="form-control-static">Android应用</p>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="form-group">
                            <label for="inputName" class="control-label">应用名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="不多于6个字符">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="inputVersion" class="control-label">版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputVersion" name="version" value="{{model.version}}" placeholder="不多于20个字符">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputIntro" class="control-label">应用简介<i class="required">*</i></label>
                    <textarea class="form-control" id="inputIntro" name="intro" placeholder="关于该应用的描述">{{model.intro}}</textarea>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputApkFile" class="control-label">安装包</label>
                            <input type="file" class="form-control" id="inputApkFile" name="apkFile">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputIcoFile" class="control-label">图标<i class="required">*</i></label>
							<# if(model.ico) { #><div><img src="{{model.ico}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div><# } #>
                            <input type="file" class="form-control" id="inputIcoFile" name="icoFile" data-value="{{model.ico}}">
                        </div>
                    </div>
                </div>
                <%-- <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile1" class="control-label">宣传图片1</label>
                            <input type="file" class="form-control" id="inputImageFile1" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile2" class="control-label">宣传图片2</label>
                            <input type="file" class="form-control" id="inputImageFile2" name="imgFiles">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile3" class="control-label">宣传图片3</label>
                            <input type="file" class="form-control" id="inputImageFile3" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile4" class="control-label">宣传图片4</label>
                            <input type="file" class="form-control" id="inputImageFile4" name="imgFiles">
                        </div>
                    </div>
                </div> 
                <div class="form-group">
                    <label class="control-label">免登录</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="needlogin" value="1"<# if(model.needlogin == 1) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="needlogin" value="0"<# if(model.needlogin == 0) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">免登录方案</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="tokentype" value="0"<# if(model.tokentype == 0) { #> checked="checked"<# } #>> 方案一（动态令牌）
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="tokentype" value="1"<# if(model.tokentype == 1) { #> checked="checked"<# } #>> 方案二（固定令牌）
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputToken" class="control-label">令牌值</label>
                    <input type="text" class="form-control" id="inputToken" name="token" value="{{model.token}}" placeholder="">
                </div>
                <div class="form-group">
                    <label class="control-label">传送参数</label>
                    <div class="checkbox">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginMobile" value="1"<# if(model.loginMobile == 1) { #> checked="checked"<# } #>> 手机号
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginUserid" value="1"<# if(model.loginUserid == 1) { #> checked="checked"<# } #>> 用户ID
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginChannel" value="1"<# if(model.loginChannel == 1) { #> checked="checked"<# } #>> 渠道号
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">隐藏</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="0"<# if(model.hide == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="1"<# if(model.hide == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">预置</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="0"<# if(model.preset == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="1"<# if(model.preset == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">开放范围</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="1"<# if(model.isopen == 1) { #> checked="checked"<# } #>> 全部开放
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="0" disabled="disabled"<# if(model.isopen == 0) { #> checked="checked"<# } #>> 指定人员
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputUserIds" class="control-label">选择开放人员</label>
                    <textarea class="form-control" id="inputUserIds" name="userIds" placeholder="点击选择人员"></textarea>
                </div>--%>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script type="text/template" id="tmpl-iOSInputModal">
<# var modalTitle = '新建应用'; if(!model._isNew) modalTitle = '编辑应用'; #>
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{modalTitle}}</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="type" value="2">
                <input type="hidden" name="isInside" value="{{model.isInside}}">
                <# if(!model._isNew) { #><input type="hidden" name="id" value="{{model.id}}"><# } #>
                <div class="form-group">
                    <label class="control-label">应用平台</label>
                    <p class="form-control-static">iOS</p>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="form-group">
                            <label for="inputName" class="control-label">应用名称<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="不多于6个字符">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="inputVersion" class="control-label">版本号<i class="required">*</i></label>
                            <input type="text" class="form-control" id="inputVersion" name="version" value="{{model.version}}" placeholder="不多于20个字符">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputIntro" class="control-label">应用简介<i class="required">*</i></label>
                    <textarea class="form-control" id="inputIntro" name="intro" placeholder="关于该应用的描述">{{model.intro}}</textarea>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputApplyProcedure" class="control-label">链接</label>
                            <input type="text" class="form-control" id="inputApplyProcedure" name="applyprocedure" value="{{model.applyprocedure}}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputIcoFile" class="control-label">图标<i class="required">*</i></label>
                            <# if(model.ico) { #><div><img src="{{model.ico}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div><# } #>
                            <input type="file" class="form-control" id="inputIcoFile" name="icoFile" data-value="{{model.ico}}">
                        </div>
                    </div>
                </div>
                <%--<div class="form-group">
                    <label for="inputStartupParameter" class="control-label">启动参数</label>
                    <input type="text" class="form-control" id="inputStartupParameter" name="startupparameter" value="{{model.startupparameter}}">
                </div>
                 <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile1" class="control-label">宣传图片1</label>
                            <input type="file" class="form-control" id="inputImageFile1" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile2" class="control-label">宣传图片2</label>
                            <input type="file" class="form-control" id="inputImageFile2" name="imgFiles">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile3" class="control-label">宣传图片3</label>
                            <input type="file" class="form-control" id="inputImageFile3" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile4" class="control-label">宣传图片4</label>
                            <input type="file" class="form-control" id="inputImageFile4" name="imgFiles">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">隐藏</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="0"<# if(model.hide == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="1"<# if(model.hide == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">预置</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="0"<# if(model.preset == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="1"<# if(model.preset == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">开放范围</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="1"<# if(model.isopen == 1) { #> checked="checked"<# } #>> 全部开放
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="0" disabled="disabled"<# if(model.isopen == 0) { #> checked="checked"<# } #>> 指定人员
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputUserIds" class="control-label">选择开放人员</label>
                    <textarea class="form-control" id="inputUserIds" name="userIds" placeholder="点击选择人员"></textarea>
                </div>--%>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script type="text/template" id="tmpl-h5InputModal">
<# var modalTitle = '新建应用'; if(!model._isNew) modalTitle = '编辑应用'; #>
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{modalTitle}}</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="type" value="3">
                <input type="hidden" name="isInside" value="{{model.isInside}}">
                <# if(!model._isNew) { #><input type="hidden" name="id" value="{{model.id}}"><# } #>
                <div class="form-group">
                    <label for="inputAppType" class="control-label">应用平台</label>
                    <p class="form-control-static">HTML5</p>
                </div>
                <div class="form-group">
                    <label for="inputName" class="control-label">应用名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="不多于6个字符">
                </div>
                <div class="form-group">
                    <label for="inputIntro" class="control-label">应用简介<i class="required">*</i></label>
                    <textarea class="form-control" id="inputIntro" name="intro" placeholder="关于该应用的描述">{{model.intro}}</textarea>
                </div>
                <div class="form-group">
                    <label for="inputToken" class="control-label">链接<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputAppProcedure" name="applyprocedure" value="{{model.applyprocedure}}" placeholder="">
                </div>
                <div class="form-group">
                    <label for="inputStartupParameter" class="control-label">启动参数</label>
                    <input type="text" class="form-control" id="inputStartupParameter" name="startupparameter" value="{{model.startupparameter}}">
                </div>
                <div class="form-group">
                    <label for="inputIcoFile" class="control-label">图标<i class="required">*</i></label>
					<# if(model.ico) { #><div><img src="{{model.ico}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div><# } #>
                    <input type="file" class="form-control" id="inputIcoFile" name="icoFile" data-value="{{model.ico}}">
                </div>
                <%-- <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile1" class="control-label">宣传图片1</label>
                            <input type="file" class="form-control" id="inputImageFile1" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile2" class="control-label">宣传图片2</label>
                            <input type="file" class="form-control" id="inputImageFile2" name="imgFiles">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile3" class="control-label">宣传图片3</label>
                            <input type="file" class="form-control" id="inputImageFile3" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile4" class="control-label">宣传图片4</label>
                            <input type="file" class="form-control" id="inputImageFile4" name="imgFiles">
                        </div>
                    </div>
                </div> 
                <div class="form-group">
                    <label class="control-label">免登录</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="needlogin" value="1"<# if(model.needlogin == 1) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="needlogin" value="0"<# if(model.needlogin == 0) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputToken" class="control-label">URL</label>
                    <input type="text" class="form-control" id="inputAppProcedure" name="applyprocedure" value="{{model.applyprocedure}}" placeholder="">
                </div>
                <div class="form-group">
                    <label class="control-label">隐藏</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="0"<# if(model.hide == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="1"<# if(model.hide == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">预置</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="0"<# if(model.preset == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="1"<# if(model.preset == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">开放范围</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="1"<# if(model.isopen == 1) { #> checked="checked"<# } #>> 全部开放
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="0" disabled="disabled"<# if(model.isopen == 0) { #> checked="checked"<# } #>> 指定人员
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputUserIds" class="control-label">选择开放人员</label>
                    <textarea class="form-control" id="inputUserIds" name="userIds" placeholder="点击选择人员"></textarea>
                </div>--%>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>

<script type="text/template" id="tmpl-fwInputModal">
<# var modalTitle = '新建应用'; if(!model._isNew) modalTitle = '编辑应用'; #>
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{modalTitle}}</h4>
        </div>
        <div class="modal-body">
            <form method="post" enctype="multipart/form-data">
                <input type="hidden" name="type" value="4">
                <input type="hidden" name="isInside" value="{{model.isInside}}">
                <# if(!model._isNew) { #><input type="hidden" name="id" value="{{model.id}}"><# } #>
                <div class="form-group">
                    <label for="inputAppType" class="control-label">应用平台</label>
                    <p class="form-control-static">服务号</p>
                </div>
                <div class="form-group">
                    <label for="inputServiceId" class="control-label">ID</label>
                    <input type="text" class="form-control" id="inputServiceId" name="serviceId" value="{{model.serviceId}}" placeholder="服务号ID">
                </div>
                <div class="form-group">
                    <label for="inputName" class="control-label">名称<i class="required">*</i></label>
                    <input type="text" class="form-control" id="inputName" name="name" value="{{model.name}}" placeholder="不多于6个字符">
                </div>
                <div class="form-group">
                    <label for="inputIntro" class="control-label">描述<i class="required">*</i></label>
                    <textarea class="form-control" id="inputIntro" name="intro" placeholder="关于该应用的描述">{{model.intro}}</textarea>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputSafetyKey" class="control-label">安全秘钥</label>
                            <input type="text" class="form-control" id="inputSafetyKey" name="safetyKey" value="{{model.safetykey}}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputSafetyId" class="control-label">安全身份ID</label>
                            <input type="text" class="form-control" id="inputSafetyId" name="safetyId" value="{{model.safetyid}}">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputIcoFile" class="control-label">图标<i class="required">*</i></label>
 					<# if(model.ico) { #><div><img src="{{model.ico}}" onerror="this.parentNode.removeChild(this);" width="100" height="100" /></div><# } #>
                    <input type="file" class="form-control" id="inputIcoFile" name="icoFile" data-value="{{model.ico}}">
                </div>
                <%-- <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile1" class="control-label">宣传图片1</label>
                            <input type="file" class="form-control" id="inputImageFile1" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile2" class="control-label">宣传图片2</label>
                            <input type="file" class="form-control" id="inputImageFile2" name="imgFiles">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile3" class="control-label">宣传图片3</label>
                            <input type="file" class="form-control" id="inputImageFile3" name="imgFiles">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputImageFile4" class="control-label">宣传图片4</label>
                            <input type="file" class="form-control" id="inputImageFile4" name="imgFiles">
                        </div>
                    </div>
                </div> --%>
                <div class="form-group">
                    <label class="control-label">隐藏</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="0"<# if(model.hide == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="hide" value="1"<# if(model.hide == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">预置</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="0"<# if(model.preset == 0) { #> checked="checked"<# } #>> 是
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="preset" value="1"<# if(model.preset == 1) { #> checked="checked"<# } #>> 否
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">菜单模式</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="tokentype" value="0"<# if(model.tokentype == 0) { #> checked="checked"<# } #>> 普通模式
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="tokentype" value="1"<# if(model.tokentype == 1) { #> checked="checked"<# } #>> 回调模式
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="inputCallbackUrl" class="control-label">回调地址</label>
                    <input type="text" class="form-control" id="inputCallbackUrl" name="callbackUrl" value="{{model.callbackurl}}" placeholder="">
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputToken" class="control-label">Token</label>
              			  <div class="row">
                   			 <div class="col-md-9">
                          		  <input type="text" class="form-control" id="inputToken" name="token" value="{{model.token}}" placeholder="">
                           	 </div>
							<div class="col-md-3">
								<button type="button" class="TokenBotton"  data-do="TokenBotton">生成</button>
							</div>
						 </div>
						</div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="inputAESkey" class="control-label">EncodingAESkey</label>
              			  <div class="row">
                   			 <div class="col-md-9">
                            <input type="text" class="form-control" id="inputAESkey" name="AESkey" value="{{model.asskey}}" placeholder="">
                           	 </div>
							<div class="col-md-3">
								<button type="button" class="EncodingAESkey"  data-do="EncodingAESkey">生成</button>
							</div>
						 </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">回调参数</label>
                    <div class="checkbox">
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginMobile" value="1"<# if(model.loginMobile == 1) { #> checked="checked"<# } #>> 手机号
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginUserid" value="1"<# if(model.loginUserid == 1) { #> checked="checked"<# } #>> 用户ID
                        </label>
                        <label class="checkbox-inline">
                            <input type="checkbox" name="loginChannel" value="1"<# if(model.loginChannel == 1) { #> checked="checked"<# } #>> 渠道号
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label">开放范围</label>
                    <div class="radio">
                        <label class="radio-inline">
                            <input type="radio" name="isopen" value="1"<# if(model.isopen == 1) { #> checked="checked"<# } #>> 全部开放
                        </label>
                        <%-- <label class="radio-inline">
                            <input type="radio" name="isopen" value="0" disabled="disabled"<# if(model.isopen == 0) { #> checked="checked"<# } #>> 指定人员
                        </label> --%>
                    </div>
                </div>
                <%--<div class="form-group">
                    <label for="inputUserIds" class="control-label">选择开放人员</label>
                    <textarea class="form-control" id="inputUserIds" name="userIds" placeholder="点击选择人员"></textarea>
                </div>--%>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" data-do="submit">保存</button>
        </div>
    </div>
</div>
</script>