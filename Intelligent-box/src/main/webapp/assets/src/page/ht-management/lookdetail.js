$(function(){
	//获取合同列表数据
	jQuery.post(
		CONTEXT_PATH +'/api/contract/queryForWeb.do',
		{cid:1,id:id},
		function(data){
	        console.log(data);
	        console.log(id);
	        var lists=data.model.list;	      
	        var str="";	      
	        for(var i=0;i<lists.length;i++){
	        	if(lists[i].id==id){
	        		str+='<p>合同名称:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+lists[i].name+'<p>';
			        str+='<p><span>合同编号:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+lists[i].number+'</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>合同金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+lists[i].money+'</span><p>';
			        str+='<p>对方主体名称&nbsp;&nbsp;&nbsp;'+lists[i].companyName+'<p>';
			        str+='<p>合同承办人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+lists[i].companyCommander+'<p>';
			        str+='<p>当前状态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+switchs(lists[i].status)+'<p>';
			        str+='<p style="width:300px;word-wrap:break-word;">状态说明&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本项目处于合同'+lists[i].statusExplain+'<p>';	
			         $("#divs").append($(str));
	        	}
	        }
	   
	       
	  },"json");		
	 
	function switchs(status){
		switch(status){
			case 1:return '准备状态';
			case 2:return '起草状态';
			case 3:return '审核状态';
			case 4:return '签署状态';
			case 5:return '执行状态';
			case 6:return '结束状态'						
		}
	}
	//取出id
	function getQueryObject(url) {
                url = url == null ? window.location.href : url;
                var search = url.substring(url.lastIndexOf("?") + 1);
                var obj = {};
                var reg = /([^?&=]+)=([^?&=]*)/g;
                search.replace(reg, function(rs, $1, $2) {
                    var name = decodeURIComponent($1);
                    var val = decodeURIComponent($2);
                    val = String(val);
                    obj[name] = val;
                    return rs;
                });
                return obj;
            }
    var id = getQueryObject(window.location.href).id;
    
    //点击返回
    $(".fanhuis").click(function(){
    	window.location.href = CONTEXT_PATH + '/web/system/management.htm'
    })

})
