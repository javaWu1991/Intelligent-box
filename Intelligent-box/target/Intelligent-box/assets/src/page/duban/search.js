$(function(){
	function getCookie(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	}
	var userid=getCookie('userId');
	//var username=getCookie('userName');
	var mobile=getCookie('mobile');
	var cid=getCookie('cid');
	var mobileSystem=getCookie('mobileSystem');
	//点击返回按钮返回督办首页
	$(".fanhui").click(function(){
		//window.location.href="/yiqi/web/supervise/dubanIndex.do";
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
	
	//督办事项切换
	var $div_li=$("div.tab_menu ul li");
	$div_li.click(function(){
		$(this).addClass("selecteds")
			.siblings().removeClass("selecteds");
		var index=$div_li.index(this);
		$("div.tab_box > div").eq(index).show()
				.siblings().hide();
		}).hover(function(){
				$(this).addClass("hover");
		},function(){
				$(this).removeClass("hover");
	})
	
	
	//督办处室显示所有一级部门
	$.ajax({
			type:'get',
			dataType:"json",			
			url:'/yiqi/api/users/'+cid+'',
			success:function(res){				
				console.log(res);
				var model=res.model;
				var comoanyName=model[0].name
				console.log(model);
				var lists=model[0].orgList;//取出所有部门
				var str=""
				for(var i=0;i<lists.length;i++){
					str+="<option value="+lists[i].orgName+" data-last-value="+lists[i].id+">"+lists[i].orgName+"</option>";
				}
				$(".selected").append(str)
			}
	})
	
	
	/*//督办名称模糊搜索
		$.ajax({
			type:"get",
			url:'/yiqi/web/supervise/getSupersive.do?userId='+userid+'&&type='+1+'&&pageNo='+1+'&&pageSize='+20,
			dataType:"json",
			success:function(res){
				console.log(res);
				var lists=res.model.tAppSuperviseVoDaiBan;	
				for(var i=0;i<lists.length;i++){
					var dubanName=[];
					dubanName.push(lists[i].superviseName);
					$("#txtSearch").autocomplete(dubanName);
				}
			}
		})*/
	
	//点击重置搜索条件清空督办名称，其他选项默认全部
	$(".reset").click(function(){
		$(".dbName").val("");
		$(".selected").get(0).selectedIndex=0;
		$(".btn1").addClass("btn").siblings().removeClass("btn")
	})
	
	
	/*//点击确定按钮调用搜索接口筛选搜索结果	
	$(".sure").click(function(){			
		var numArr = []; // 定义一个空数组
		var txt = $('.progress').find('.btn');
		for (var i = 0; i < txt.length; i++) {
		    numArr.push(txt.eq(i).val()); // 将值添加到数组中
		}
		var state;
		if(txt.length==1){
			state=numArr[0];
		}else if(txt.length==2){
			state=numArr[0]+numArr[1];
		}

		//督办层级
		var Arr = [];
		var cengji = $('.cengji').find('.btn');
		for (var j = 0; j < cengji.length; j++) {
		    Arr.push(cengji.eq(j).val()); // 将值添加到数组中
		}
		var grade;
		if(cengji.length==1){
			grade=Arr[0];
		}else if(cengji.length==2){
			grade=Arr[0]+Arr[1];
		}
	
		//督办类型
		var Arrs = [];
		var leix = $('.leix').find('.btn');
		for (var n = 0; n < leix.length; n++) {
		    Arrs.push(leix.eq(n).val()); // 将值添加到数组中
		}
		var typeName;
		if(leix.length==1){
			typeName=Arrs[0];
		}else if(leix.length==2){
			typeName=Arrs[0]+Arrs[1];
		}else if(leix.length==3){
			typeName=Arrs[0]+Arrs[1]+Arrs[2];
		}else if(leix.length==4){
			typeName=Arrs[0]+Arrs[1]+Arrs[2]+Arrs[3];
		}
		
		//督办处室
		var deptId=$(".selected").find("option:selected").val();				
		console.log(deptId)
		
		//督办时间
		var endTime=$("#J-xl-3").val();
		var endTimes=(new Date(endTime)).getTime();
		var startTime=$("#J-xl-2").val();
		var startTimes=(new Date(startTime)).getTime();		
		var superviseName=$("#txtSearch").val();
		
		$.ajax({
				type:"get",
				dataType:"json",
				url:'/yiqi/web/supervise/getSupersive.do?state='+state+'&&type='+1+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&startTime='+startTimes+'&&deptId='+deptId+'&&superviseName='+superviseName+'&&endTime='+endTimes,
				success:function(res){
						console.log(res);	
						$("#pipei").show();
						$("#search").hide();
						var lists=res.model.tAppSuperviseVoDaiBan;									
						if(lists.length==0){
							$("#daiban").html("没有匹配结果");
						}else{
							for(var i=0;i<lists.length;i++){
								var dubanName=lists[i].superviseName;
								var qicaoTime=new Date(lists[i].createTime);
								var jieziTime=new Date(lists[i].endTime);
								var zhixinMan=lists[i].superviseImplementName;
								var dangqianMan=lists[i].nextAssigneeName;
								var nextAssigneeId=lists[i].nextAssigneeId;
								var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
								var jieziTimes=jieziTime.format('yyyy-MM-dd');
								$("#daiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+lists[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;'><span class='dot' data-last-value="+i+"></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
															
								//点击待办事项进入督办审批
								$("#daiban").on("click",".daiban",function(){
									var id=$(this).data('lastValue');								
									window.location.href="/yiqi/web/supervise/dubanshenpi.do?id="+id;
								})
								
							}
						}
						
						var zaibanlist=res.model.tAppSuperviseVoZaiBan;
						if(zaibanlist.length==0){
							$("#zaiban").html("没有匹配结果");
						}
						else{
							for(var i=0;i<zaibanlist.length;i++){
								var dubanName=zaibanlist[i].superviseName;
								var qicaoTime=new Date(zaibanlist[i].createTime);
								var jieziTime=new Date(zaibanlist[i].endTime);
								var zhixinMan=zaibanlist[i].superviseImplementName;
								var nextAssigneeId=zaibanlist[i].nextAssigneeId;
								var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
								var jieziTimes=jieziTime.format('yyyy-MM-dd');
								$("#zaiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+zaibanlist[i].id+"><span class='dot'></span><span style='font-weight:bold;height:0.3rem;line-height:0.3rem'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem'>"+zhixinMan+"</span><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p></div>");	
								
								//点击在办事项进入督办执行
								$("#zaiban").on("click",".daiban",function(){
									var id=$(this).data('lastValue');						
									window.location.href="/yiqi/web/supervise/dubanzhixing.do?id="+id;
								})
							}
							}
						
						var guidanglist=res.model.tAppSuperviseVoGuiDang;
						if(guidanglist.length==0){
							$("#guidang").html("没有匹配结果");
						}
						else{
							for(var i=0;i<guidanglist.length;i++){
								var dubanName=guidanglist[i].superviseName;
								var zhixinMan=guidanglist[i].superviseImplementName;
								var qicaoTime=new Date(guidanglist[i].createTime);
								var jieziTime=new Date(guidanglist[i].endTime);				
								var jieziTimes=jieziTime.format('yyyy-MM-dd');
								$("#guidang").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+guidanglist[i].id+"><h4 style='height:0.3rem;line-height:0.3rem'><span class='dot'></span>"+dubanName+"</h4><span style='height:0.3rem;line-height:0.3rem'>执行人"+zhixinMan+"</span><span style='height:0.3rem;line-height:0.3rem;float:right'>"+jieziTimes+"</span></div>");	
								
								//点击归档事项进入归档详情
								$("#guidang").on("click",".daiban",function(){
									var id=$(this).data('lastValue');								
									window.location.href="/yiqi/web/supervise/dubanguidang.do?id="+id;
									
								})
							}
							}
						
							//搜索结果点击返回按钮返回到搜索页面
							$(".fanhui2").click(function(){
								window.location.href="/yiqi/web/supervise/dubansearch.do";
							})												
				},
				error:function(){
					alert("请求失败");
				}
		})	
		
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
	})*/
					
	//支持多选---执行进度
	$(".btns").click(function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).removeClass("btn");
			n=n-2;
			if(n<=-1){
				$(this).siblings(".btn1").addClass("btn");
			}else{
				$(this).siblings(".btn1").removeClass("btn");				
			}
		}else{			
			$(this).prop({"checked":true});	
			$(this).addClass("btn");
			$(this).siblings(".btn1").removeClass("btn").addClass("btn2");		
		}		
	})			
	//当全部选中的时候全选按钮选中其他选项不可选   
		var n=0;
		//执行进度
		$(".btns").click(function(){			
			if($("input[name='btn']").hasClass("btn")){
				n++;
				if(n>3){n=1}
			}else{n=0}
			if(n==3){
				$(this).siblings(".btn1").addClass("btn");
				$("input[name='btn'").removeClass("btn").prop({"checked":false});
			}		
		})
		
})
//支持多选---督办层级
$(function(){
	var n=0;
	$(".btna").click(function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).removeClass("btn");
			n=n-2;
			if(n<=-1){
				$(this).siblings(".btn1").addClass("btn");
			}else{
				$(this).siblings(".btn1").removeClass("btn");
			}
		}else{			
			$(this).prop({"checked":true});			
			$(this).siblings(".btn1").removeClass("btn").addClass("btn2");			
			$(this).addClass("btn");
		}		
	})
	
	//督办层级
		$(".btna").click(function(){			
			if($("input[name='btn-1']").hasClass("btn")){
				n++;
				if(n>3){n=1}
			}else{n=0}
			if(n==3){
				$(this).siblings(".btn1").addClass("btn");
				$("input[name='btn-1'").removeClass("btn").prop({"checked":false});
			}	
		})
})

//支持多选---督办类型
$(function(){
	var n=0;
	$(".btnb").click(function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).removeClass("btn");
			n=n-2;
			if(n<=-1){
				$(this).siblings(".btn1").addClass("btn");
			}else{
				$(this).siblings(".btn1").removeClass("btn");
			}
		}else{			
			$(this).prop({"checked":true});
			$(this).addClass("btn");
			$(this).siblings(".btn1").removeClass("btn").addClass("btn2");			
		}	
	})	
	//督办类型
		$(".btnb").click(function(){
			if($("input[name='btn-2']").hasClass("btn")){
				n++;
				if(n>5){n=1}
			}else{n=0;}
			if(n==5){
				$(this).siblings(".btn1").addClass("btn");
				$("input[name='btn-2'").removeClass("btn").prop({"checked":false});
			}	
		})
		
		//点击全部的时候
		$(".btn1").click(function(){
			$(this).addClass("btn").siblings("input").removeClass("btn").prop({"checked":false});
		})
})
