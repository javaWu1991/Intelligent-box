var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;
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

function loaded() {
	//动画部分----
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
			}
		},
		onScrollMove: function () {
		
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';				
				pullUpAction();	// Execute custom function (ajax call?)								
			}
		}
	});
	
	loadAction();
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//阻止冒泡
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 0); }, false);

var arr=[];
var arr2=[];
var Arr=[];
var Arr2=[];
//初始状态，加载数据
function loadAction(){
	var $div_li=$("div.tab_menu ul li");
	$div_li.click(function(){
	myScroll.refresh();
})
	//待办事项				
	//点击确定按钮调用搜索接口筛选搜索结果
	var dotnum;
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
		//console.log(state)
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
		    Arrs.push(leix.eq(n).val()); 
		    // 将值添加到数组中
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
		//console.log(deptId);
		
		//督办时间
		var endTime=$("#J-xl-3").val();
		var endTimes=(new Date(endTime)).getTime();
		var startTime=$("#J-xl-2").val();
		var startTimes=(new Date(startTime)).getTime();
		console.log(startTime)
		//督办名称
		var superviseName=$("#txtSearch").val();					

		var URL;
		var params;
		if(superviseName==''&&endTime==''&&startTime==''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&deptId='+deptId
			params={state:state,userId:userid,pageNo:1,pageSize:20,grade:grade,typeName:typeName,deptId:deptId}
		}else if(superviseName!=''&&endTime!=''&&startTime!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&startTime='+startTimes+'&&deptId='+deptId+'&&superviseName='+superviseName+'&&endTime='+endTimes
			params={state:state,userId:userid,pageNo:1,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,superviseName:superviseName,endTime:endTimes,startTime:startTimes}
		}else if(endTime==''&&startTime==''&&superviseName!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&deptId='+deptId+'&&superviseName='+superviseName
			params={state:state,userId:userid,pageNo:1,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,superviseName:superviseName}
		}else if(superviseName==''&&endTime!=''&&startTime!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&startTime='+startTimes+'&&deptId='+deptId+'&&endTime='+endTimes
			params={state:state,userId:userid,pageNo:1,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,endTime:endTimes,startTime:startTimes}
		}
		$.ajax({
				type:"post",
				dataType:"json",
				data:params,
				url:'/yiqi/web/supervise/getSupersive.do',
				success:function(res){
						console.log(res);	
						if(res.success){
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
									if(zhixinMan==null){zhixinMan="暂无"}
									var dangqianMan=lists[i].nextAssigneeName;
									var nextAssigneeId=lists[i].nextAssigneeId;
									var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
									var jieziTimes=jieziTime.format('yyyy-MM-dd');
									$("#daiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+lists[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;'><span class='dot' data-num="+i+"></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
									
									//判断操作人如果为当前用户显示小红点
									//console.log(nextAssigneeId);
									var dataNum=$(".dot").data('num');					
									if(lists[i].nextAssigneeId==userid){
										//dotnum=i;
										dataNum=i;
										//console.log(dataNum);
										if(dataNum==i){
											$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
											arr.push(dataNum);
										}
									}
									/*var Arr = [];
									var redDot = $('.dot').find('.Reddot');
									for (var j = 0; j < redDot.length; j++) {
									    Arr.push(redDot.eq(j).val()); // 将值添加到数组中
									}
									console.log(Arr.length)
													
									if(Arr.length==0){
										$(".num-1").children("span").remove();
									}else if(Arr.length<=99){
										$(".num-1").append("<span class='shuzi'>"+Arr.length+"</span>");
									}else{
										$(".num-1").append("<span class='shuzi'>99+</span>");
									}	*/
									
									if(arr.length==0){
										$(".num-1").children("span").remove();
									}else if(arr.length<=99){
										$(".num-1").append("<span class='shuzi'>"+arr.length+"</span>");
									}else{
										$(".num-1").append("<span class='shuzi'>99+</span>");
									}							
									//点击待办事项进入督办审批
									$("#daiban").on("click",".daiban",function(){
										var id=$(this).data('lastValue');								
										window.location.href="/yiqi/web/supervise/dubanshenpi.do?id="+id;
									})
									
								}
							}
							
							//在办
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
									if(zhixinMan==null){zhixinMan="暂无"}
									var nextAssigneeId=zaibanlist[i].nextAssigneeId;
									var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
									var jieziTimes=jieziTime.format('yyyy-MM-dd');
									$("#zaiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+zaibanlist[i].id+"><span class='dots' data-num="+i+"></span><span style='font-weight:bold;height:0.3rem;line-height:0.3rem'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem'>"+zhixinMan+"</span><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p></div>");	
									
									//判断操作人如果为当前用户显示小红点
									//console.log(nextAssigneeId);
									var dataNum=$(".dots").data('num');					
									if(zaibanlist[i].nextAssigneeId==userid){
										//dotnum=i;
										dataNum=i;
										//console.log(dataNum);
										if(dataNum==i){
											$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
											arr2.push(dataNum);
										}
									}
									/*var Arrs = [];
									var redDot = $('.dots').find('.Reddot');
									for (var j = 0; j < redDot.length; j++) {
									    Arrs.push(redDot.eq(j).val()); // 将值添加到数组中
									}
									console.log(Arrs.length)
													
									if(Arrs.length==0){
										$(".num-2").children("span").remove();
									}else if(Arrs.length<=99){
										$(".num-2").append("<span class='shuzi'>"+Arrs.length+"</span>");
									}else{
										$(".num-2").append("<span class='shuzi'>99+</span>");
									}		*/
									if(arr2.length==0){
										$(".num-2").children("span").remove();
									}else if(arr2.length<=99){
										$(".num-2").append("<span class='shuzi'>"+arr2.length+"</span>");
									}else{
										$(".num-2").append("<span class='shuzi'>99+</span>");
									}
									
									//点击在办事项进入督办执行
									$("#zaiban").on("click",".daiban",function(){
										var id=$(this).data('lastValue');						
										window.location.href="/yiqi/web/supervise/dubanzhixing.do?id="+id;
									})
								}
							}
							
							//归档
							var guidanglist=res.model.tAppSuperviseVoGuiDang;
							if(guidanglist.length==0){
								$("#guidang").html("没有匹配结果");
							}
							else{
								for(var i=0;i<guidanglist.length;i++){
									var dubanName=guidanglist[i].superviseName;
									var zhixinMan=guidanglist[i].superviseImplementName;
									if(zhixinMan==null){zhixinMan="暂无"}
									var qicaoTime=new Date(guidanglist[i].createTime);
									var jieziTime=new Date(guidanglist[i].endTime);				
									var jieziTimes=jieziTime.format('yyyy-MM-dd');
									$("#guidang").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+guidanglist[i].id+"><h4 style='height:0.3rem;line-height:0.3rem'><span class='dotss' data-num="+i+"></span>"+dubanName+"</h4><span style='height:0.3rem;line-height:0.3rem'>执行人"+zhixinMan+"</span><span style='height:0.3rem;line-height:0.3rem;float:right'>"+jieziTimes+"</span></div>");	
									
										//判断操作人如果为当前用户显示小红点
										//console.log(nextAssigneeId);
										var dataNum=$(".dotss").data('num');					
										if(guidanglist[i].nextAssigneeId==userid){
											//dotnum=i;
											dataNum=i;
											console.log(dataNum);
											if(dataNum==i){
												$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
											}
										}
										/*var Arr = [];
										var redDot = $('.dot').find('.Reddot');
										for (var j = 0; j < redDot.length; j++) {
										    Arr.push(redDot.eq(j).val()); // 将值添加到数组中
										}
										console.log(Arr.length)
														
										if(Arr.length==0){
											$(".num-3").children("span").remove();
										}else if(Arr.length<=99){
											$(".num-3").append("<span class='shuzi'>"+Arr.length+"</span>");
										}else{
											$(".num-3").append("<span class='shuzi'>99+</span>");
										}		*/					
									
									
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
						}
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
	})
	myScroll.refresh();
}


//下拉刷新当前数据
function pullDownAction () {
	setTimeout(function () {
		//这里执行刷新操作
		
		myScroll.refresh();	
	}, 400);
}


var p=1;
//上拉加载更多数据
function pullUpAction () {
	setTimeout(function () {
		p++;
		console.log(p);
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
		
		//督办名称
		var dbName=$(".dbName").val();
		
		
		var URL;
		var params;
		if(superviseName==''&&endTime==''&&startTime==''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&deptId='+deptId
			params={state:state,userId:userid,pageNo:p,pageSize:20,grade:grade,typeName:typeName,deptId:deptId}
		}else if(superviseName!=''&&endTime!=''&&startTime!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&startTime='+startTimes+'&&deptId='+deptId+'&&superviseName='+superviseName+'&&endTime='+endTimes
			params={state:state,userId:userid,pageNo:p,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,superviseName:superviseName,endTime:endTimes,startTime:startTimes}
		}else if(endTime==''&&startTime==''&&superviseName!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&deptId='+deptId+'&&superviseName='+superviseName
			params={state:state,userId:userid,pageNo:p,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,superviseName:superviseName}
		}else if(superviseName==''&&endTime!=''&&startTime!=''){
			//URL='/yiqi/web/supervise/getSupersive.do?state='+state+'&&userId='+userid+'&&pageNo='+1+'&&pageSize='+20+'&&grade='+grade+'&&typeName='+typeName+'&&startTime='+startTimes+'&&deptId='+deptId+'&&endTime='+endTimes
			params={state:state,userId:userid,pageNo:p,pageSize:20,grade:grade,typeName:typeName,deptId:deptId,endTime:endTimes,startTime:startTimes}
		}
		
		$.ajax({
			type:"post",
			url:'/yiqi/web/supervise/getSupersive.do',
			dataType:"json",
			data:params,
			success:function(res){
				console.log(res);
				var lists = res.model.tAppSuperviseVoDaiBan;
				var zaiBanlists=res.model.tAppSuperviseVoZaiBan;
				var guidlists=res.model.tAppSuperviseVoGuiDang;
				//待办
				var Len = lists.length;
				var zaiBanLen=zaiBanlists.length;
				var guiDLen=guidlists.length;
				var l=arr.length;				
				var h=arr2.length;
				if(Len==0&&zaiBanLen==0&&guiDLen==0){
					n--;
				}
				if(Len == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(i = 0; i < lists.length; i++) {
						var dubanName = lists[i].superviseName;
						var qicaoTime = new Date(lists[i].createTime);
						var jieziTime = new Date(lists[i].endTime);
						var zhixinMan = lists[i].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var dangqianMan = lists[i].nextAssigneeName;
						var qicaoTimes = qicaoTime.format('yyyy-MM-dd');
						var jieziTimes = jieziTime.format('yyyy-MM-dd');
						var nextAssigneeId = lists[i].nextAssigneeId;
						$("#daiban").append("<div style='background:#ffffff;' class='daiban' data-last-value="+lists[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;'><span class='dot' data-num="+i+"></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNum=$(".dot").data('num');					
						if(lists[i].nextAssigneeId==userid){
							//dotnum=i;
							dataNum=i;
							//console.log(dataNum);
							if(dataNum==i){
								$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
								Arr.push(dataNum);
							}
						}
						var a=Arr.length;
						var total=(a-0)+(l-0);
						if(total==0){
							$(".num-1").children("span").remove();
						}else if(total<=99){
							//$(".num-1>.shuzi").html((a-0)+(l-0));
							$(".num-1").append("<span class='shuzi'>"+(total)+"</span>");
						}else{
							$(".num-1").append("<span class='shuzi'>99+</span>");
						}		
						/*var Arr = [];
						var redDot = $('.dot').find('.Reddot');
						for (var j = 0; j < redDot.length; j++) {
						    Arr.push(redDot.eq(j).val()); // 将值添加到数组中
						}
						console.log(Arr.length)
										
						if(Arr.length==0){
							$(".num-1").children("span").remove();
						}else if(Arr.length<=99){
							$(".num-1").append("<span class='shuzi'>"+Arr.length+"</span>");
						}else{
							$(".num-1").append("<span class='shuzi'>99+</span>");
						}		*/		
					}
				}
				
				//在办
				
				if(zaiBanLen == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(i = 0; i < zaiBanlists.length; i++) {
						var dubanName=zaiBanlists[i].superviseName;
						var qicaoTime=new Date(zaiBanlists[i].createTime);
						var jieziTime=new Date(zaiBanlists[i].endTime);
						var zhixinMan=zaiBanlists[i].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var nextAssigneeId=zaiBanlists[i].nextAssigneeId;
						var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
						var jieziTimes=jieziTime.format('yyyy-MM-dd');
						$("#zaiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+zaiBanlists[i].id+"><span class='dots' data-num="+i+"></span><span style='height:0.3rem;line-height:0.3rem;font-size:0.18rem;display:inline-block;font-weight:bold;color:#333333'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem'>"+zhixinMan+"</span><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p></div>");
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNum=$(".dots").data('num');					
						if(zaiBanlists[i].nextAssigneeId==userid){
							//dotnum=i;
							dataNum=i;
							//console.log(dataNum);
							if(dataNum==i){
								$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
								Arr2.push(dataNum);
							}
						}
						var k=Arr2.length;
						var total2=(k-0)+(h-0)
						if(total2==0){
							$(".num-2").children("span").remove();
						}else if(total2<=99){
//							$(".num-2>.shuzi").html((k-0)+(h-0));
							$(".num-2").append("<span class='shuzi'>"+(total2)+"</span>");
						}else{
							$(".num-2").append("<span class='shuzi'>99+</span>");
						}
						/*var Arrs = [];
						var redDot = $('.dots').find('.Reddot');
						for (var j = 0; j < redDot.length; j++) {
						    Arrs.push(redDot.eq(j).val()); // 将值添加到数组中
						}
						console.log(Arrs.length)
										
						if(Arrs.length==0){
							$(".num-2").children("span").remove();
						}else if(Arrs.length<=99){
							$(".num-2").append("<span class='shuzi'>"+Arrs.length+"</span>");
						}else{
							$(".num-2").append("<span class='shuzi'>99+</span>");
						}		*/		
					}
				}
				
				//归档
				
				if(guiDLen == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(i = 0; i < guidlists.length; i++) {
						var dubanName=guidlists[i].superviseName;
						var zhixinMan=guidlists[i].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var qicaoTime=new Date(guidlists[i].createTime);
						var jieziTime=new Date(guidlists[i].endTime);				
						var jieziTimes=jieziTime.format('yyyy-MM-dd');
						$("#guidang").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+guidlists[i].id+"><h4 style='height:0.3rem;line-height:0.3rem;width:80%;float:left;'><span class='dotss' data-num="+i+"></span>"+dubanName+"</h4><span class='status' style='float:right'></span><span style='height:0.3rem;line-height:0.3rem'>执行人"+zhixinMan+"</span><span style='height:0.3rem;line-height:0.3rem;float:right;margin-right:0.15rem'>"+jieziTimes+"</span></div>");
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNum=$(".dotss").data('num');					
						if(guidlists[i].nextAssigneeId==userid){
							//dotnum=i;
							dataNum=i;
							console.log(dataNum);
							if(dataNum==i){
								$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
							}
						}
						
					}
				}
			}
		});
		myScroll.refresh();
	}, 400);
}

