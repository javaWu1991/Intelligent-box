define(function(require, exports) {
    var $ = require('jquery');
    require('jqueryui');
    require('jquery-util');
    require('jquery-form');
    require('jquery-validate');
    require('metisMenu');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var confirm = require('component/Confirm');
    var alert = require('component/Alert');
    var Model = require('component/Model');
    var FormModal = require('component/FormModal');
    var SearchForm = require('component/SearchForm');
    var template = require('template');
    var moment = require('moment');
    var Pager = require('component/Pager');
    Backbone.emulateHTTP = true;

    
    function run(){
    	$.ajax({
            type: "GET",
            url: CONTEXT_PATH + '/web/company/selectCompany.do',
            dataType: "json",
            context: this,
            data: {},        
            success: function(data) {
                var checknode = data.model;
                _.each(checknode, function(item) {
                	var arr = checknode.list ;
                	var markup = [];
                  	var markup = [];
                	if(CID!=null){
                	markup.push('<option value="'+CID+'">'+COMPANY_NAME+'</option>'); 
                	}else{
                	markup.push('<option value="">超级管理员</option>')	
                	}         
                	for(var i = 0; i < arr.length; i++){
                    if(arr[i].id!=CID){
                	markup.push('<option value="' + arr[i].id + '">' + arr[i].name + '</option>');
                    }
                	}
                	$('#company').html(markup.join(''));
                }, this);
            }
        });
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + '/web/boxWeb/getProductStatus.do',
        dataType: "json",
        context: this,
        data: {},        
        success: function(data) {
            var checknode = data.model;
            _.each(checknode, function(item) {
            	var arr = checknode ;
            	var markup = [];
            	for(var i = 0; i < arr.length; i++){
            	markup.push('<li style="list-style-type:none"><a href="../boxWeb/productList.htm?status=0">'+arr[i].roomCode+'房间'+arr[i].containerNumber+'号货柜缺货请及时补货（点击查看缺货详情）</a></li>');
            	}
            	$('#con1').html(markup.join(''));
            }, this);
        }
    });
}
    
    exports.run = run;
});