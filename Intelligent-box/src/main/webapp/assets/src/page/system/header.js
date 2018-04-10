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
                	markup.push('<option value="'+CID+'">'+COMPANY_NAME+'</option>');
                	for(var i = 0; i < arr.length; i++){
                    if(arr[i].id!=CID){
                	markup.push('<option value="' + arr[i].id + '">' + arr[i].name + '</option>');
                    }
                	}
                	$('#company').html(markup.join(''));
                }, this);
            }
        });
    }

    
    exports.run = run;
});