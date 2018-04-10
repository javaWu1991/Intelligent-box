

var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;

	//存入当前用户id进入cookie
	//取出userId
	var _url=window.location.href;
	var getRemind=getQueryObjects(_url);
	function getQueryObjects(url) {
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
                  return obj
						            
	}

								
	function getCookie(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	}
	var userid=getCookie('userId');
	var mobile=getCookie('mobile');
	var cid=getCookie('cid');
	var mobileSystem=getCookie('mobileSystem') ;
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
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
			}
		},
		onScrollMove: function (){		
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				this.maxScrollY = pullUpOffset;
			}
			//下拉刷新无法回弹
			 if((this.y < this.maxScrollY) && (this.pointY < 1)){
			  	this.scrollTo(0, this.maxScrollY, 400);
			  	return;
			 } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
			  	this.scrollTo(0, 0, 400);
			  	return;
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
				pullUpAction();	
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
var gdangTime=[];
var shuzu=[];
var cha1='';
var cha2='';
var max;
var gif;


//初始状态，加载数据
function loadAction(){		
	//待办事项
	var dotnum;
	$.ajax({
		type:"post",
//		url:'/yiqi/web/supervise/getSupersive.do?userId='+userid+'&&type='+0+'&&pageNo='+1+'&&pageSize='+20,
		url:'/yiqi/web/supervise/getSupersive.do',
		dataType:"json",
		data:{userId:userid,type:0,pageNo:1,pageSize:20,cid:cid},
		success:function(res){
			console.log(res);
			var lists=res.model.tAppSuperviseVoDaiBan;	
			var zaiBanlists=res.model.tAppSuperviseVoZaiBan;
			var guidlists=res.model.tAppSuperviseVoGuiDang;
			var num=lists.length;
				var datas;
				if(getRemind.remind){
					
				
					$('.curbox').show();
					$('.zbox').hide();
					$('.dbox').hide();
					
					$('#cartoonDetail').css({'display':'block'});

					$('#wrapper').css({'top':'0.42rem'});
						$("#zBan").hide();	
						$(".tab_box").hide();
						$(".header-bar").hide();
						$(".header-1").show();
						$(".tab_menu").hide();
						$("#mask").hide();
						$(".tixing").hide();
						$(".txbox").hide();
						$(".fanhui").click(function(){
							window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
						})
					if(getRemind.remind=='1'){
						$(".header-1 span").text('我的到期');
						datas=res.model.tAppSuperviseVoDaoQi;
					}else if(getRemind.remind=='2'){
						datas=res.model.tAppSuperviseVoZhiHou;
						$(".header-1 span").text('我的滞后');
					}
					console.log(datas);	
					for(var i=0;i<datas.length;i++){
					
					var zhixinMan=datas[i].superviseImplementName;
					if(zhixinMan==null){zhixinMan="暂无"}
					var dubanName=datas[i].superviseName;
					var qicaoTime=new Date(datas[i].createTime);
					var jieziTime=new Date(datas[i].endTime);
					var zhixinMan=datas[i].superviseImplementName;
					if(zhixinMan==null){zhixinMan="暂无"}
					var dangqianMan=datas[i].nextAssigneeName;
					if(dangqianMan==null){dangqianMan="暂无"}
					var nextAssigneeId=datas[i].nextAssigneeId;
					var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
					var jieziTimes=jieziTime.format('yyyy-MM-dd');
//						if(datas[i].nextAssigneeId==userid){
							$(".curbox").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+datas[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;font-size:0.18rem'><span class='dotdb'></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
//						}
					}
					$(".curbox .daiban").on("click",function(){
						var id=$(this).data('lastValue');								
						window.location.href="/yiqi/web/supervise/dubanshenpi.do?id="+id;
					})
				
				}
//				function cartoonAvatar(arr){
//					console.log( arr )
//					 if( arr[ 0 ] ){
//					  $("#daiban .biaoqing").eq( 0 ).css( 'display', 'block' );
//					 }
//					 if( arr[ 1 ] ){
//					  setTimeout( function(){ $("#daiban .biaoqing").css( 'display', 'none' ).eq( 1 ).css( 'display', 'block' ) }, 5000 );
//					 }else{
//					 	setTimeout( function(){ $("#daiban .biaoqing").css( 'display', 'none' ) }, 5000 );
//					 }
//					 if( arr[ 2 ] ){
//					  setTimeout( function(){ $("#daiban .biaoqing").css( 'display', 'none' ).eq( 2 ).css( 'display', 'block' )}, 10000 );
//					  setTimeout( function(){ $("#daiban .biaoqing").css( 'display', 'none' ) }, 15000 );
//					  console.log('hah');
//					 }else{
//					 	setTimeout( function(){ $("#daiban .biaoqing").css( 'display', 'none' ) }, 10000 );
//					 }
//					 
//					
//				}
//				cartoonAvatar(Arr);
			if(lists.length==0){
				
				$("#daiban").append("<span>暂无数据</span>");
				$(".dban").html("有待办(0)");
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
					$("#daiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+lists[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;'><span class='dot' data-num="+i+"></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
					
					//判断操作人如果为当前用户显示小红点
					//console.log(nextAssigneeId);
					var dataNum=$(".dot").data('num');
					//console.log(dataNum)
					
					if(lists[i].nextAssigneeId==userid){
						$(".dbox").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+lists[i].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;font-size:0.18rem'><span class='dotdb'></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
						$(".dotdb").html("<span class='Reddot'></span>");
						if(dataNum==i){
							$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");							
							arr.push(dataNum);
							//console.log(arr);						
							var imgs = $(".tixing");
							var nowTime=new Date().getTime();
							var dubanjzTime=lists[i].endTime;
							cha1=parseInt(Math.abs(dubanjzTime-nowTime)  /  1000  /  60  /  60  /24)+1;
							
							if(cha1<=3){	
								$(".huanying").css("display","none");							
								$(".tixing").css("display","block");
								//alert(1)
							}else{
								$(".tixing").css("display","none");
								$(".huanying").css("display","block");
							}
							$(".dban").html("有待办("+arr.length+")");
						}					
					}else{
						$("[data-num="+i+"]").remove();						
					}
					//alert(arr.length)
					if(arr.length==0){
						$(".dban").html("有待办(0)");
					}
					$(".dban").click(function(){
						$(".header-1 span").text('我的待办');
						$('.dbox').show();
						$("#zBan").hide();
						$('.zbox').hide();
					$('.curbox').hide();
						sort=$(this).data('sort');
					$('#cartoonDetail').css({'display':'block'});

					$('#wrapper').css({'top':'0.42rem'});
						$("#zBan").hide();	
						$(".tab_box").hide();
						$(".header-bar").hide();
						$(".header-1").show();
						$(".tab_menu").hide();
						$("#mask").hide();
						$(".tixing").hide();
						$(".txbox").hide();
						$(".fanhui").click(function(){
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
					})					
					
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
					});
					$(".dbox").on("click",".daiban",function(){
						var id=$(this).data('lastValue');								
						window.location.href="/yiqi/web/supervise/dubanshenpi.do?id="+id;
					})
				}
			}
			
			
			//在办
			if(zaiBanlists.length==0){
				$("#zaiban").html("暂无数据");
				$(".zban").html("有在办(0)");
				$(".num-2").children("span").remove();
			}else{
					for(var i=0;i<zaiBanlists.length;i++){
					var dubanName=zaiBanlists[i].superviseName;
					var qicaoTime=new Date(zaiBanlists[i].createTime);
					var jieziTime=new Date(zaiBanlists[i].endTime);
					var zhixinMan=zaiBanlists[i].superviseImplementName;
					if(zhixinMan==null){zhixinMan="暂无"}
					var nextAssigneeId=zaiBanlists[i].nextAssigneeId;
					var nextAssigneeName=zaiBanlists[i].nextAssigneeName;
					var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
					var jieziTimes=jieziTime.format('yyyy-MM-dd');
					$("#zaiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+zaiBanlists[i].id+"><span class='dots' data-num="+i+"></span><span style='height:0.3rem;line-height:0.3rem;font-size:0.18rem;display:inline-block;font-weight:bold;color:#333333'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem'>"+nextAssigneeName+"</span><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p></div>");
										
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNum=$(".dots").data('num');					
						if(zaiBanlists[i].nextAssigneeId==userid){
							$(".zbox").append("<div style='background:#ffffff;' class='daiban' data-last-value="+zaiBanlists[i].id+"><p class='dotszb' style='width:10px;height:10px;float:left;margin-top:0.06rem;margin-right:0.1rem;'></p><span style='height:0.3rem;line-height:0.3rem;font-size:0.18rem;display:inline-block;font-weight:bold;color:#333333;float:left'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem;font-size:0.16rem'>"+nextAssigneeName+"</span><p style='height:0.3rem;line-height:0.3rem;margin-top:0.35rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p></div>");
							$(".dotszb").html("<span class='Reddot'></span>");
							if(dataNum==i){
								$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
								arr2.push(dataNum);								
								
								var imgs = $(".tixing");
								var nowTime=new Date().getTime();
								var dubanjzTime=zaiBanlists[i].endTime;
								cha2=parseInt(Math.abs(dubanjzTime-nowTime)  /  1000  /  60  /  60  /24)+1;
								//alert(cha1)
								if(cha2<=3){	
									if(cha1>3||cha1==''){
										$(".huanying").css("display","none");									
										$(".tixing").css("display","block");
									}								
								}else{
									if(cha1>3||cha1==''){
										$(".tixing").css("display","none");
										$(".huanying").css("display","block");
									}									
								}
								//imgs.show();								
								$(".zban").html("有在办("+arr2.length+")");															
							}
						}
						if(arr2.length==0){
							$(".zban").html("有在办(0)");
						}
						$(".zban").click(function(){
							$(".header-1 span").text('我的在办');
							$('.zbox').show();
							$('.dbox').hide();
							$('.curbox').hide();
							
					$('#cartoonDetail').css({'display':'block'});

					$('#wrapper').css({'top':'0.42rem'});
						$("#zBan").hide();	
						$(".tab_box").hide();
						$(".header-bar").hide();
						$(".header-1").show();
						$(".tab_menu").hide();
						$("#mask").hide();
						$(".tixing").hide();
						$(".txbox").hide();
						$(".fanhui").click(function(){
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
						})
						
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
					});
					$(".zbox").on("click",".daiban",function(){
						var id=$(this).data('lastValue');						
						window.location.href="/yiqi/web/supervise/dubanzhixing.do?id="+id;
					})
					
				}	
			}
			
			//归档
			var zhnum;
			if(guidlists.length==0){
				$("#guidang").html("暂无数据")
			}else{
				for(var i=0;i<guidlists.length;i++){				
					var dubanName=guidlists[i].superviseName;
					var zhixinMan=guidlists[i].superviseImplementName;
					if(zhixinMan==null){zhixinMan="暂无"}
					var qicaoTime=new Date(guidlists[i].createTime);
					var guidTime=new Date(guidlists[i].guidangTime);
					var guidangTime=guidlists[i].guidangTime;
					
					var guidTimes=guidTime.format('yyyy-MM-dd');
					$("#guidang").prepend("<div style='background:#ffffff;float:left;width:100%' class='daiban' data-last-value="+guidlists[i].id+"><h4 style='height:0.3rem;line-height:0.3rem;width:80%;float:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'><span class='dotss' data-num="+i+"></span>"+dubanName+"</h4><span class='status' data-zhih="+guidlists[i].status+" style='float:right'></span><p style='height:0.3rem;line-height:0.3rem'>执行人"+zhixinMan+"</p><span style='height:0.3rem;line-height:0.3rem;float:right;margin-right:0.15rem' data-max="+guidangTime+" class='gdang' data-bj="+guidlists[i].status+">"+guidTimes+"</span></div>");
					//滞后
					var datazhih=$(".status").data('zhih');
					//console.log(datazhih)
					
					//根据归档时间显示惩罚和奖励的卡通形象
					var guidmax=$(".gdang").data('max');
					gdangTime.push(guidangTime);
					//console.log(gdangTime);
					max=Math.max.apply(null, gdangTime);
					//console.log(max);
										
					
					if(datazhih==0){
						$("[data-zhih="+datazhih+"]").html("<span class='zhihou'>滞后</span>");						
						
					}
					//判断操作人如果为当前用户显示小红点
					//console.log(nextAssigneeId);
					var dataNum=$(".dotss").data('num');					
					if(guidlists[i].nextAssigneeId==userid){
						dataNum=i;
						//console.log(dataNum);
						if(dataNum==i){
							$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
						}
					}
					
					//点击归档事项进入归档详情
					$("#guidang").on("click",".daiban",function(){
						var id=$(this).data('lastValue');								
						window.location.href="/yiqi/web/supervise/dubanguidang.do?id="+id;						
					})
				}	
			}
			shuzu.push(max);
			//alert(shuzu);
			console.log(max)
			if($("[data-max="+max+"]").data("bj")==0){
				//$("#Index").append("<div class='chenfagif'><img src='/yiqi/assets/src/css/img/chenfa.gif' class='chenfa'/></div>");
//				$(".num-3").click(function(){
//					$("#guidang .chenfagif").remove();
//					$("#guidang").append("<div class='chenfagif'><img src='/yiqi/assets/src/css/img/chenfa.gif' class='chenfa'/></div>");
//					var img = $(".chenfa");						
//					setTimeout(function() {img.hide();},2000);
//				})
				
			}else if($("[data-max="+max+"]").data("bj")!=0&&guidlists.length!=0){	
//				$(".num-3").click(function(){
//					$("#guidang .jiangli").remove();
//					$("#guidang").append("<div class='jiangli'><img src='/yiqi/assets/src/css/img/biaoyang.gif' class='biaoyang'/></div>");
//					var img = $(".biaoyang");						
//					setTimeout(function() {img.hide();},2000);
//				})
				
				//存入cookie
				function setcookie(name,value,expires,path,domain,secure)
				{
					var curcookie = name + "=" + encodeURI(value) + ((expires)? "; expires="+ expires.toGMTString():"")+((path)? "; path=" + path:"")+((domain) ? "; domain=" +domain:"")+((secure)?"; secure":"")
					document.cookie=curcookie;
				}
					var now =new Date();
					now.setTime(now.getTime() + 365*24*60*60*1000);
					setcookie("gif",'yes',now);		
				//取出cookie
				function getCookie(name)
				{
					var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
					if(arr=document.cookie.match(reg))
					return unescape(arr[2]);
					else
					return null;
				}
				gif=getCookie('gif');
				
			}
						
			
			//点击提醒图片显示菜单
			$(".tixing").click(function(){
				$(".daicaozuo .txbox").show();
				$("#mask").show();
			})
			//点击菜单显示欢迎图片
			$(".txbox").click(function(){
				$("#mask").hide();
			})
			//点击欢迎图片显示菜单
			$(".huanying").click(function(){
				$(".welcome>.txbox").show();
				$("#mask").show();
			})
			$("#mask").click(function(){
				$("#mask").hide();
				$(".txbox").hide();
			})
			//如果有滞后
			
//			if($(".chenfa").is(":visible")){
//				setTimeout(function() {
//					$(".chenfa").hide();
//					//$(".tixing").show();
//				},2000);
//			}
		}							
	});	
	//督办事项切换
	var $div_li = $("div.tab_menu ul li");
	$div_li.click(function() {
		$('#cartoonDetail').css({'display':'none'});
		myScroll.refresh();		
	})	
	myScroll.refresh();
	
}

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


//下拉刷新当前数据
function pullDownAction () {
	setTimeout(function () {
		//这里执行刷新操作
		
		myScroll.refresh();	
	}, 400);
}




var n=1;
//上拉加载更多数据
function pullUpAction () {
	setTimeout(function () {
		//待办
		n++;
		console.log(n)
		$.ajax({
			type:"post",
			//url:'/yiqi/web/supervise/getSupersive.do?userId='+userid+'&&type='+0+'&&pageNo='+n+'&&pageSize='+20,
			url:'/yiqi/web/supervise/getSupersive.do',
			dataType:"json",
			data:{userId:userid,type:0,pageNo:n,pageSize:20,cid:cid},
			success:function(res){
				console.log(res);
				var listss = res.model.tAppSuperviseVoDaiBan;
				var zaiBanlistss=res.model.tAppSuperviseVoZaiBan;
				var guidlistss=res.model.tAppSuperviseVoGuiDang;
				//待办
				var Lens = listss.length;
				var zaiBanLens=zaiBanlistss.length;
				var guiDLens=guidlistss.length;
				//var l=$(".num-1>span").eq(19).text();
				var l=arr.length;
				//console.log(arr.length)
				//var h=$(".num-2>span").eq(19).text();
				var h=arr2.length;
				if(Lens==0&&zaiBanLens==0&&guiDLens==0){
					n--;
				}
				if(Lens == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(y = 0; y < listss.length; y++) {
						var dubanName = listss[y].superviseName;
						var qicaoTime = new Date(listss[y].createTime);
						var jieziTime = new Date(listss[y].endTime);
						var zhixinMan = listss[y].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var dangqianMan = listss[y].nextAssigneeName;
						var qicaoTimes = qicaoTime.format('yyyy-MM-dd');
						var jieziTimes = jieziTime.format('yyyy-MM-dd');
						var nextAssigneeId = listss[y].nextAssigneeId;
						$("#daiban").append("<div style='background:#ffffff;' class='daiban' data-last-value="+listss[y].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;'><span class='dotaa' data-nums="+y+"></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
						

						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNums=$(".dotaa").eq(y).data('nums');
						if(listss[y].nextAssigneeId==userid){	
							$(".dbox").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+listss[y].id+"><h3 class='dubanName' style='height:0.3rem;line-height:0.3rem;color:#333333;font-size:0.18rem'><span class='dotdb'></span>"+dubanName+"</h3><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p><p>督办执行人&nbsp;"+zhixinMan+"</p><p style='height:0.3rem;line-height:0.3rem'>当前操作人&nbsp;"+dangqianMan+"</p></div>");
							$(".dotdb").html("<span class='Reddot'></span>");
							if(dataNums==y){
								$("[data-nums="+dataNums+"]").html("<span class='Reddot'></span>");
								Arr.push(dataNum);								
								$(".dban").html("有待办("+(arr.length+Arr.length)+")");								
							}
						}
						/*var Arra = [];
						var redDot = $('.dotaa').find('.Reddot');
						for (var j = 0; j < redDot.length; j++) {
						    Arra.push(redDot.eq(j).val()); // 将值添加到数组中
						}
						//console.log(Arra.length)
						
						var a=Arra.length;		
						if(Arra.length==0){
							//$(".num-1").children("span").remove();
							//$(".num-1").children("span").hide();
						}else if(Arra.length<=99){
							//$(".num-1>.shuzi").html((a-0)+(l-0));
							$(".num-1").append("<span class='shuzi'>"+((a-0)+(l-0))+"</span>");
						}else{
							$(".num-1").append("<span class='shuzi'>99+</span>");
						}		*/
						
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
					}
				}
				
				//在办
				
				if(zaiBanLens == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(i = 0; i < zaiBanlistss.length; i++) {
						var dubanName=zaiBanlistss[i].superviseName;
						var qicaoTime=new Date(zaiBanlistss[i].createTime);
						var jieziTime=new Date(zaiBanlistss[i].endTime);
						var zhixinMan=zaiBanlistss[i].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var nextAssigneeId=zaiBanlistss[i].nextAssigneeId;
						var nextAssigneeName=zaiBanlistss[i].nextAssigneeName;
						var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
						var jieziTimes=jieziTime.format('yyyy-MM-dd');
						$("#zaiban").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+zaiBanlistss[i].id+"><span class='dotsy' data-num="+i+"></span><span style='height:0.3rem;line-height:0.3rem;font-size:0.18rem;display:inline-block;font-weight:bold;color:#333333'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem'>"+nextAssigneeName+"</span><p style='height:0.3rem;line-height:0.3rem'>起止时间&nbsp;"+qicaoTimes+"&nbsp;至&nbsp;"+jieziTimes+"</p></div>");
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						//var dataNum=$(".dotsy").eq(i).data('num');
						var dataNum=$(".dotsy").data('num');
						console.log(dataNum)
						if(zaiBanlistss[i].nextAssigneeId==userid){
							$(".zbox").append("<div style='background:#ffffff;' class='daiban' data-last-value="+zaiBanlistss[i].id+"><p class='dotszb' style='width:10px;height:10px;float:left;margin-top:0.06rem;margin-right:0.1rem;'></p><span style='height:0.3rem;line-height:0.3rem;font-size:0.18rem;display:inline-block;font-weight:bold;color:#333333;float:left'>"+dubanName+"</span><span style='float:right;height:0.3rem;line-height:0.3rem;font-size:0.16rem'>"+nextAssigneeName+"</span><p style='height:0.3rem;line-height:0.3rem;margin-top:0.35rem'>起止时间&nbsp;"+qicaoTimes+"至"+jieziTimes+"</p></div>");
							$(".dotszb").html("<span class='Reddot'></span>");
							if(dataNum==i){
								$("[data-num="+dataNum+"]").html("<span class='Reddot'></span>");
								Arr2.push(dataNum);
								$(".zban").html("有在办("+(arr2.length+Arr2.length)+")");
							}
						}
						/*var Arrs = [];
						var redDot = $('.dotsy').find('.Reddot');
						for (var j = 0; j < redDot.length; j++) {
						    Arrs.push(redDot.eq(j).val()); // 将值添加到数组中
						}
						console.log(Arrs.length)
						
						var k=Arrs.length;
						if(Arrs.length==0){
							$(".num-2").children("span").remove();
						}else if(Arr.length<=99){
//							$(".num-2>.shuzi").html((k-0)+(h-0));
							$(".num-2").append("<span class='shuzi'>"+((k-0)+(h-0))+"</span>");
						}else{
							$(".num-2").append("<span class='shuzi'>99+</span>");
						}		*/
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
					}
				}
				
				//归档
				
				if(guiDLens == 0) {
					$(".pullUpLabel").text("没有更多了");
				}else{
					for(i = 0; i < guidlistss.length; i++) {
						var dubanName=guidlistss[i].superviseName;
						var zhixinMan=guidlistss[i].superviseImplementName;
						if(zhixinMan==null){zhixinMan="暂无"}
						var qicaoTime=new Date(guidlistss[i].createTime);
						var jieziTime=new Date(guidlistss[i].endTime);				
						var jieziTimes=jieziTime.format('yyyy-MM-dd');
						$("#guidang").prepend("<div style='background:#ffffff;' class='daiban' data-last-value="+guidlistss[i].id+"><h4 style='height:0.3rem;line-height:0.3rem;width:80%;float:left;'><span class='dotss' data-num="+i+"></span>"+dubanName+"</h4><span class='status' data-zhih="+guidlistss[i].status+" style='float:right'></span><span style='height:0.3rem;line-height:0.3rem'>执行人"+zhixinMan+"</span><span style='height:0.3rem;line-height:0.3rem;float:right;margin-right:0.15rem'>"+jieziTimes+"</span></div>");
						//滞后
						var datazhih=$(".status").data('zhih');
						//console.log(datazhih)
						if(datazhih==0){
							$("[data-zhih="+datazhih+"]").html("<span class='zhihou'>滞后</span>");						
							/*$("body").append("<div class='chenfagif'><img src='/yiqi/assets/src/css/img/chenfa.gif' class='chenfa'/></div>");
							var img = $(".chenfa");
							setTimeout(function() {img.hide();},2000);*/
						}
						
						//判断操作人如果为当前用户显示小红点
						//console.log(nextAssigneeId);
						var dataNum=$(".dotss").data('num');					
						if(guidlistss[i].nextAssigneeId==userid){
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
	