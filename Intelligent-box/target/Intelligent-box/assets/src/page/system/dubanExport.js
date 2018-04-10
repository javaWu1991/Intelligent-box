$(function(){
	//调用时间插件输入起草时间和截止时间
	laydate({
	    elem: '#startTime',	
	});
	laydate({
	    elem: '#endTime',	
	});
	
	 //时间戳转时间
Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
}
	
 
	/*//调用督办详情接口
	$.ajax({
			type:"post",
			dataType:"json",
			data:{pageSize:'20',pageNum:'1'},
			url: CONTEXT_PATH + '/web/supervise/getSuperviseCount.do',
			success:function(res){
				//console.log(res.model.list);
				var listss=res.model.list;
				console.log(listss);				
				if(listss.length==0){
					$("#detail").append("暂无数据");
				}
				var statusText='';
				var str='';
				for(var i=0;i<listss.length;i++){
					var jiezTime=new Date(listss[i].endTime);
					var jiezTimes=jiezTime.format('yyyy-MM-dd');
					var qicaoTime=new Date(listss[i].createTime);
					var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
					if(listss[i].status==1){statusText="进行中"}
					else if(listss[i].status==2){statusText="已完成"}
					else if(listss[i].status==3){statusText="已到期"}
					str+="<tr>";
					str+="<td>"+(i+1)+"</td>";
					str+="<td>"+listss[i].superviseName+"</td>";
					str+="<td>"+jiezTimes+"</td>";
					str+="<td>"+listss[i].superviseContent+"</td>";
					str+="<td>"+listss[i].superviseOrgName+"</td>";
					str+="<td>"+listss[i].userOrgName+"</td>";
					str+="<td>"+qicaoTimes+"</td>";
					str+="<td>"+statusText+"</td>";							
                }   
                str+="</tr>";
               	$("#detail").html(str);
			}
	})	*/
	
	//分页显示
	function tt(dd){
        //alert(dd);
    }
    var GG = {
        "kk":function(mm){
           $.ajax({
				type:"post",
				dataType:"json",
				data:{pageSize:'20',pageNum:mm},
				url: CONTEXT_PATH + '/web/supervise/getSuperviseCount.do',
				success:function(res){
					//console.log(res.model.list);
					var listss=res.model.list;
					console.log(listss);				
					if(listss.length==0){
						$("#detail").append("暂无数据");
					}
					var statusText='';
					var str='';
					for(var i=0;i<listss.length;i++){
						var jiezTime=new Date(listss[i].endTime);
						var jiezTimes=jiezTime.format('yyyy-MM-dd');
						var qicaoTime=new Date(listss[i].createTime);
						var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
						if(listss[i].status==1){statusText="已完成"}
						else if(listss[i].status==2){statusText="审核中"}
						else if(listss[i].status==0){statusText="已到期"}
						else if(listss[i].status==0){statusText="已到期"}
						else if(listss[i].status==3){statusText="执行中"}
						str+="<tr>";
						str+="<td>"+(i+1)+"</td>";
						str+="<td>"+listss[i].superviseContent+"</td>";
						str+="<td>"+jiezTimes+"</td>";
						str+="<td>"+listss[i].superviseName+"</td>";
						str+="<td>"+listss[i].superviseOrgName+"</td>";
						str+="<td>"+listss[i].userOrgName+"</td>";
						str+="<td>"+qicaoTimes+"</td>";
						str+="<td>"+statusText+"</td>";							
	                }   
	                str+="</tr>";
	               	$("#detail").html(str);
				}
			})
        }
    }

    $("#page").initPage(71,1,GG.kk);	
	
	//点击搜素
	$(".sousuo").click(function(){
		var startTime=$("#startTime").val();
		var endTime=$("#endTime").val();
		var status=$("#status").val();
		//alert(status)
		var params;
		var startTimes=(new Date(startTime)).getTime();
		var endTimes=(new Date(endTime)).getTime();
		if(startTime!=''){
			params={startTime:startTimes,pageSize:'20',pageNum:'1'}
		}else if(endTime!=''){
			params={endTime:endTimes,pageSize:'20',pageNum:'1'}
		}else if(startTime!=''&&endTime!=''){
			params={startTime:startTimes,endTime:endTimes,pageSize:'20',pageNum:'1'}
		}else if(status!=''){
			params={type:status,pageSize:'20',pageNum:'1'}
		}else if(startTime!=''&&endTime!=''&&status!=''){
			params={startTime:startTimes,endTime:endTimes,type:status,pageSize:'20',pageNum:'1'}
		}else if(startTime==''&&endTime==''&&status==''){
			params={pageSize:'20',pageNum:'1'}
		}
		$.ajax({
				type:"post",
				dataType:"json",
				data:params,
				url: CONTEXT_PATH + '/web/supervise/getSuperviseCount.do',
				success:function(res){
					//console.log(res.model.list);
					var listss=res.model.list;
					console.log(listss.length);				
					if(listss.length==0){
						$("#detail").html("暂无数据");
						alert("没有匹配结果")
					}
					var statusText='';
					var str='';
					for(var i=0;i<listss.length;i++){
						var jiezTime=new Date(listss[i].endTime);
						var jiezTimes=jiezTime.format('yyyy-MM-dd');
						var qicaoTime=new Date(listss[i].createTime);
						var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
						if(listss[i].status==1){statusText="已完成"}
						else if(listss[i].status==2){statusText="审核中"}
						else if(listss[i].status==0){statusText="已到期"}
						else if(listss[i].status==3){statusText="执行中"}
						str+="<tr>";
						str+="<td>"+(i+1)+"</td>";
						str+="<td>"+listss[i].superviseName+"</td>";
						str+="<td>"+jiezTimes+"</td>";
						str+="<td>"+listss[i].superviseContent+"</td>";
						str+="<td>"+listss[i].superviseOrgName+"</td>";
						str+="<td>"+listss[i].userOrgName+"</td>";
						str+="<td>"+qicaoTimes+"</td>";
						str+="<td>"+statusText+"</td>";							
	                }   
	                str+="</tr>";
	               	$("#detail").html(str);
				}
			})
	})
	
	//点击导出
	$(".export").click(function(){
		var startTime=$("#startTime").val();
		var endTime=$("#endTime").val();
		var status=$("#status").val();
		//alert(status)
		//var params;
		var startTimes=(new Date(startTime)).getTime();
		var endTimes=(new Date(endTime)).getTime();
		if(startTime!=''){
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?startTime="+startTimes+"&&pageSize=20&&pageNum=1");
		}else if(endTime!=''){
			//params={endTime:endTimes,pageSize:'20',pageNum:'1'}
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?endTime="+endTimes+"&&pageSize=20&&pageNum=1");
		}else if(startTime!=''&&endTime!=''){
			//params={startTime:startTimes,endTime:endTimes,pageSize:'20',pageNum:'1'}
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?endTime="+endTimes+"&&pageSize=20&&pageNum=1&&startTime="+startTimes+"");
		}else if(status!=''){
			//params={type:status,pageSize:'20',pageNum:'1'}
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?type="+status+"&&pageSize=20&&pageNum=1");
		}else if(startTime!=''&&endTime!=''&&status!=''){
			//params={startTime:startTimes,endTime:endTimes,type:status,pageSize:'20',pageNum:'1'}
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?endTime="+endTimes+"&&pageSize=20&&pageNum=1&&startTime="+startTimes+"&&type="+status+"");
		}else if(startTime==''&&endTime==''&&status==''){
			//params={pageSize:'20',pageNum:'1'}
			$(".export").attr("href","/yiqi/web/supervise/exportSupervise.do?pageSize=20&&pageNum=1");
		}
		
		/*$.ajax({
				type:"post",
				dataType:"json",
				data:params,
				url: CONTEXT_PATH + '/web/supervise/exportSupervise.do',
				success:function(res){
					
				}
			})*/
		
	})
})
