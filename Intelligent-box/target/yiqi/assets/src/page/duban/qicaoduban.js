$(function(){
	//实时监听三类督办的下拉框的值
	$('#grade').on('change',function(){
		if($(this).val()=='三类'){
			$('.main-4').css({'display':'block'});
		}else{
			$('.main-4').css({'display':'none'});
		}
	})
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
	var mobileSystem=getCookie('mobileSystem') ;
	//点击返回退回到首页
	$(".fanhui").click(function(){
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
	
	
	//添加负责人调用负责人接口
	var num;
	var MembersId;
	var bumenId;
	var headUrl;
	var sex;
	$(".jia").click(function(){		
		$("#qicao").hide();
		$("#selectPersonnel").show();
		$(".bumen").show();
		$(".person").hide();
		$(".members").hide();
		//$(".person>li>p").removeClass("active");
		//$(".person>li>p").children().remove();
		$(".person>li>div").removeClass("active");
		$(".person>li>div").children("span").remove();
		
		$(".members>li>p").removeClass("active");
		$(".members>li>p").children().remove();
		num=$(".jia").index($(this));			
		var personValue="";
		$(".add").click(function(){				
			$("#selectPersonnel").hide();
			$(".renyuan").hide();
			$("#qicao").show();
			personValue=$(".active").text();
			MembersId=$(".active").data('lastValue');
			bumenId=$(".active").data('hidden');
			headUrl=$(".active").data('head');
			sex=$(".active").data('sex');
			var dubanCj=$(".cengJ").find("option:selected").text();
			$(".iblock").eq(num).html(personValue);	
			$(".iblock").eq(num).attr("data-last-value",MembersId);	
			$(".iblock").eq(num).attr("data-hidden",bumenId);
			$(".iblock").eq(num).attr("data-head",headUrl);
			$(".iblock").eq(num).attr("data-sex",sex);	
			//男头像
			if(headUrl==undefined&&sex==0){
				$(".jia").eq(num).attr("src",'/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png');
			}else if(headUrl==undefined&&sex==1){				
				$(".jia").eq(num).attr("src",'/yiqi/assets/src/css/img/defaultavatar_2_94_94@3x.png');
			}else{
				$(".jia").eq(num).attr("src",headUrl);
			}
		})
	})
	
	$.ajax({
			type:'get',
			dataType:"json",			
			url:'/yiqi/api/users/'+cid+'',
			success:function(res){				
				console.log(res);
				var model=res.model;
				var comoanyName=model[0].name
				$(".hy").html(comoanyName)
				console.log(model);
				var lists=model[0].orgList;//取出所有部门
				//console.log(lists);
				//根据部门名字遍历得到该部门下的所有人员
				var str=""
				for(var i=0;i<lists.length;i++){
					str+="<li class='bumenlist'><span class='bmpic'></span><span class='bm'>"+lists[i].orgName+"</span><span class='right'></span></li>";
					$(".bumen").html(str);
					var username=lists[i].users;
					var orgid=lists[i].id;
					//console.log(username.length)
					var html='';
					html+='<li class="manlist">';
					for(var j=0;j<username.length;j++){							
						/*html+='<p data-last-value='+username[j].id+' data-hidden ='+orgid+'  data-head='+username[j].headUrl+' data-sex='+username[j].sex+'>'+username[j].name+'</p>';*/
						if(username[j].headUrl!=null){
							html+='<div data-last-value='+username[j].id+' data-hidden ='+orgid+'  data-head='+username[j].headUrl+' data-sex='+username[j].sex+'>';
							html+='<img src="/yiqi/assets/src/css/img/quan.png" class="check"><img src='+username[j].headUrl+' class="picple">';
							html+=username[j].name;
							html+='</div>';
						}else{
							html+='<div data-last-value='+username[j].id+' data-hidden ='+orgid+'  data-head='+username[j].headUrl+' data-sex='+username[j].sex+'>';
							html+='<img src="/yiqi/assets/src/css/img/quan.png" class="check"><img src="/yiqi/assets/src/css/img/xiaoren.png" class="picple">';
							html+=username[j].name;
							html+='</div>';
						}												
					}
					html+='</li>';
					$(".person").append(html);
					
					var Orgs=lists[i].orgs;
					var strs='';
					if(Orgs!=null){
						for(var n=0;n<Orgs.length;n++){
							//strs+='<p class="group">'+Orgs[n].orgName+'</p>';								
							strs+='<p class="group"><span class="bmpic"></span><span class="bm">'+Orgs[n].orgName+'</span><span class="right"></span></p>';
							var members=Orgs[n].users;
							var htmls='';
							htmls+='<li class="memberslist">';
							for(var m=0;m<members.length;m++){
								//htmls+='<p data-last-value='+members[m].id+' data-hidden ='+Orgs[n].id+' data-head='+members[m].headUrl+' data-sex='+members[m].sex+'>'+members[m].name+'</p>';
								if(members[m].headUrl!=null){
									htmls+='<div data-last-value='+members[m].id+' data-hidden ='+Orgs[n].id+'  data-head='+members[m].headUrl+' data-sex='+members[m].sex+'>';
									htmls+='<img src="/yiqi/assets/src/css/img/quan.png" class="check"><img src='+members[m].headUrl+' class="picple">';
									htmls+=members[m].name;
									htmls+='</div>';
								}else{
									htmls+='<div data-last-value='+members[m].id+' data-hidden ='+Orgs[n].id+'  data-head='+members[m].headUrl+' data-sex='+members[m].sex+'>';
									htmls+='<img src="/yiqi/assets/src/css/img/quan.png" class="check"><img src="/yiqi/assets/src/css/img/xiaoren.png" class="picple">';
									htmls+=members[m].name;
									htmls+='</div>';
								}
								
							}
							htmls+='</li>';
							$(".members").append(htmls);
						}
						$(".manlist").append(strs);																												
					}
				}
							
				
				//点击部门进入部门人员列表
				$(".bumen").on("click","li",function(){
					$(".bumen").hide();						
					$(".person").show();
					$(".members").hide();
					var Index=$(".bumen li").index($(this)); 
					var bumentxt=$(this).text();
					$(".person>li").hide();
					$(".person>li").eq(Index).show();
					$(".renyuan").show();
					$(".renyuan").html(">"+bumentxt);
					//$(".person>li").removeClass("active");
					//$(".person>li>p").children().remove();
					$(".person>li>div").removeClass("active");
					$(".person>li>div").children("span").remove();
					$(".hy").css("color","#1f92ff");
				})	
				//点击组进入组成员列表
				$(".person").on("click",".group",function(){
					$(".members").show();
					$(".person").hide();
					var Index=$(".group").index($(this)); 
					var personTxt=$(this).text();
					$(".zuyuan").show();
					$(".zuyuan").html(">"+personTxt);
					$(".members>li").hide();
					$(".members>li").eq(Index).show();
					//$(".group").children().remove();
					//$(".group").removeClass("active");
					$(".person>li>div").removeClass("active");
					$(".person>li>div").children("span").remove();
					$(".members>li>div").removeClass("active");
					$(".members>li>div").children("span").remove();
				})							
			},
			error:function(res){
				$.malert({  
						 type:'tip',  
						 text: "网络超时请求失败"  
						});  
			}
	})	
	
	
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
    console.log(id)
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


	var pass;
	var dubanId;
	var handlUserId;
	var nextAssigneeId;
	var taskId;
	var superviseImplementDeptId;
	var status;
	var userId;
	var message1;
	var message2;
	var message3;
	var _message=[];
	var _list3=[];
	var lcbendTime1;
	var lcbendTime2;
	var lcbendTime3;
	var _lcbendTime=[];
	var _list4=[];
	var milestones;
	
	if(id!=undefined){
		$.ajax({
			type:'get',
			dataType:"json",			
			url:'/yiqi/web/supervise/getDetail.do?superviseId='+id,
			success:function(res){				
				console.log(res);
				var dbanlists=res.model;
				var dubanName=dbanlists.superviseName;
				$(".dubanName").val(dubanName);
				var dubanleix=dbanlists.typeName;
				$(".leix").val(dubanleix);
				var dubancengji=dbanlists.grade;
				$(".cengJ").val(dubancengji);
				var dubanshix=dbanlists.superviseContent;
				$(".dubanshix").html(dubanshix);
				var jiezTime=new Date(dbanlists.endTime);
				var jiezTimes=jiezTime.format('yyyy-MM-dd');
				$("#J-xl-2").val(jiezTimes);
				var firstUserName=dbanlists.firstUserName;	
				var firstUserId=dbanlists.firstUserId;
				var firstUserIdUrl;
				handlUserId=dbanlists.nextAssigneeId;
				nextAssigneeId=dbanlists.assigneeId;
				status=dbanlists.status;
				//alert(status)
				userId=dbanlists.userId;
				var nextAssigneeName=dbanlists.nextAssigneeName;
				var assigneeName=dbanlists.assigneeName;
				//alert(assigneeName)
				$(".cengJ").attr("disabled","disabled");
				if(firstUserIdUrl==null){
					firstUserIdUrl='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png';
				}else{
					firstUserIdUrl=dbanlists.firstUserIdUrl;
				}
				var coreManagerName=dbanlists.coreManagerName;
				var coreManagerId=dbanlists.coreManagerId;
				var coreManagerIdUrl;
				if(coreManagerIdUrl==null){
					coreManagerIdUrl='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png';
				}else{
					coreManagerIdUrl=dbanlists.coreManagerIdUrl;
				}
				var superviseImplementName=dbanlists.superviseImplementName;
				var superviseImplementId=dbanlists.superviseImplementId;
				var superviseImplementIdUrl;
				if(superviseImplementIdUrl==null){
					superviseImplementIdUrl='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png';
				}else{
					superviseImplementIdUrl=dbanlists.superviseImplementIdUrl;
				}
				var smallManagerName=dbanlists.smallManagerName;
				var smallManagerId=dbanlists.smallManagerId;
				var smallManagerIdUrl;
				if(superviseImplementIdUrl==null){
					smallManagerIdUrl='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png';
				}else{
					smallManagerIdUrl=dbanlists.smallManagerIdUrl;
				}
				var handleManagerName=dbanlists.handleManagerName;
				var handleManagerId=dbanlists.handleManagerId;
				var handleManagerIdUrl;
				if(handleManagerIdUrl==null){
					handleManagerIdUrl='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png';
				}else{
					handleManagerIdUrl=dbanlists.handleManagerIdUrl;
				}
				superviseImplementDeptId=dbanlists.superviseImplementDeptId;
				dubanId=dbanlists.id;
				pass=dbanlists.pass;
				$(".one").html("下一级审批人");
				$(".jia").attr("src",firstUserIdUrl);
				$("#firstUserName").html(assigneeName);
				taskId=dbanlists.taskId;
				//console.log(firstUserIdUrl);
				//$("#firstUserName").html(firstUserName);
				$("#firstUserName").attr("data-last-value",firstUserId);
				$(".firstUserIdUrl").attr("src",firstUserIdUrl);
				var tAppSuperviseChecks=dbanlists.tAppSuperviseChecks;
				for(var n=0;n<tAppSuperviseChecks.length;n++){
					if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].nextAssigneeId==null&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
						tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
					}
				}
				milestones=dbanlists.milestones;
								
				if(milestones.length==3){
					message1=milestones[0].message;
					message2=milestones[1].message;
					message3=milestones[2].message;
					lcbendTime1=milestones[0].endTime;
					lcbendTime2=milestones[1].endTime;
					lcbendTime3=milestones[2].endTime;
					_list3=[message1,message2,message3];
					_list4=[lcbendTime1,lcbendTime2,lcbendTime3];
					for(var t=0;t<3;t++){
						_message[t]=_list3[t];
					}
					for(var e=0;e<3;e++){
						_lcbendTime[e]=_list4[e];
					}
				}else if(milestones.length==2){
					message1=milestones[0].message;
					message2=milestones[1].message;
					lcbendTime1=milestones[0].endTime;
					lcbendTime2=milestones[1].endTime;
					_list3=[message1,message2];
					_list4=[lcbendTime1,lcbendTime2];
					for(var t=0;t<2;t++){
						_message[t]=_list3[t];
					}
					for(var e=0;e<2;e++){
						_lcbendTime[e]=_list4[e];
					}
				}else if(milestones.length==1){
					message1=milestones[0].message;
					lcbendTime1=milestones[0].endTime;
					_list3=[message1];
					_list4=[lcbendTime1];
					for(var t=0;t<1;t++){
						_message[t]=_list3[t];
					}
					for(var e=0;e<1;e++){
						_lcbendTime[e]=_list4[e];
					}
				}
				
				for(var c=0;c<milestones.length;c++){
					var messages=milestones[c].message;
					var lcbendTimes=milestones[c].endTime;
					
					//alert(lcbendTime)
					$(".closelcb").show();
					//$(".lcbmiaoshu").html(lcbmiaoshu);
					var lcbTime=new Date(lcbendTimes);
					var lcbTimes=lcbTime.format('yyyy-MM-dd');
					//var statuss=milestones[c].status;
					//$(".lcbTime").html(lcbTimes);	
					$(".closelcb").append("<p>里程碑"+(c+1)+"<img src='/yiqi/assets/src/css/img/jinxzhong.png' class='jxzpic'></p>");
					$(".closelcb").append("<p class='shixs' data-num="+c+"><span class='dubansx"+c+"'>里程碑描述:</span><textarea class='miaoshu lcbmiaoshu'>"+messages+"</textarea></p>");
					$(".closelcb").append("<p>截止时间:<span class='lcbTime"+c+"' id='lcbTime"+c+"'>"+lcbTimes+"</span></p>");
					$('#lcbTime0').date();
					$('#lcbTime1').date();
					$('#lcbTime2').date();										
				}				
			},
			error:function(res){
				$.malert({  
						type:'tip',  
						text: "网络超时请求失败"  
					});  
			}
		})	
	}
		
	//点击杭州移动研发中心回到部门列表页面
	$(".hy").click(function(){
		$(".person").hide();
		$(".bumen").show();
		$(".renyuan").hide();
		$(".zuyuan").hide();
		$(".members").hide();
		$(".hy").css("color","#C0C0C0");
		
	})
	//点击人员列表
	$(".renyuan").click(function(){
		$(".person").show();
		$(".bumen").hide();
		$(".zuyuan").hide();
		$(".members").hide();
	})
	
	//点击添加人员取消按钮，取消添加
	$(".cancel").click(function(){
		$("#selectPersonnel").hide();
		$("#qicao").show();
	})
	
		
	$(".person").on("click","div",function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).children("span").remove()
			$(".person>li>div").removeClass("active");
		}else{
			$(".person>li>div").children("span").remove();
			$(".person>li>div").removeClass("active");
			$(this).append("<span class='gou'></span>");
			$(this).prop({"checked":true});
			$(this).addClass("active");
		}	
	})	
	$(".members").on("click","div",function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).children("span").remove()
			$(".members>li>div").removeClass("active");
		}else{
			$(".members>li>div").children("span").remove();
			$(".members>li>div").removeClass("active");
			$(this).append("<span class='gou'></span>");
			$(this).prop({"checked":true});
			$(this).addClass("active");
		}	
	})
				
	//点击添加里程碑最多可添加3个	
	$(".licpei").click(function(){	
		//alert(milestones.length);
		var total;
		var oliLen=$(".list-1").length+1;
		if(milestones){
			var bjLength=milestones.length;									
			total=(bjLength-0)+(oliLen-0);				
		}else{
			total=oliLen;
		}
		//alert(total)
		if(total>3){
			$.malert({  
                type:'tip',  
                text: "最多可添加3个里程碑"  
            });  
		}else{
			$(".licpeibox").append("<li class='list-1'><div style='height:1rem;'><span style='float:left;margin-top:0.1rem;'>督办里程碑</span><textarea placeholder='请填写里程碑描述(必填)' style='resize:none;border:none;margin-top:0.1rem;float:right;margin-right:0.15rem;outline:none;font-size:0.16rem;width:65%' class='lcbms"+oliLen+"' required='required'></textarea></div><div style='width:94%;float:left;height:0.45rem;line-height:0.45rem'>截止时间<input type='text' placeholder='请填写截止日期' class='demo"+oliLen+"' id='demo"+oliLen+"' style='border:none;margin-left:0.4rem;outline:none;font-size:0.16rem' required='required'></div><span class='close'>&times;</span></li>");
			
			$('#demo1').date();
			$('#demo2').date();
			$('#demo3').date();
		}				
	})
	
	
	//点击里程碑关闭按钮可以关闭里程碑
	$(".licpeibox").on("click",".close",function(){
		$(this).parent().remove();
	})
	
	//点击提交请求成功后进入到首页的待办事项中
	$(".submit").click(function(){
		//console.log(dubanId);//undefined
		//console.log(pass);//undefined
		var nameLen=$(".dubanName").val().length;
		var shixLen=$(".dubanshix").val().length;
		var dubanName=$(".dubanName").val();
		var dubanLx=$(".leiX").find("option:selected").text();		
		var dubanCj=$(".cengJ").find("option:selected").text();
		var dubanSx=$(".main-2 .dubanshix").val();
		var dubanSx2=$(".main-5 .dubanshix").val();
		var lcbmshu1=$(".lcbms1").val();
		var lcbmshu2=$(".lcbms2").val();
		var lcbmshu3=$(".lcbms3").val();
		var lcbjzTime1=$(".demo1").val();
		var lcbjzTime2=$(".demo2").val();
		var lcbjzTime3=$(".demo3").val();
		
		//console.log(lcbmshu);//''或者undefined
		//console.log(lcbjzTime);//''或者undefined
		if(lcbjzTime1!=undefined&&lcbjzTime1.length==9){
			var a = lcbjzTime1.substring(0,8) ;
			var b = '0'+lcbjzTime1.substring(8,9) ;
			lcbjzTime1 = a+b ;
		}
		if(lcbjzTime2!=undefined&&lcbjzTime2.length==9){
			var a = lcbjzTime2.substring(0,8) ;
			var b = '0'+lcbjzTime2.substring(8,9) ;
			lcbjzTime2 = a+b ;
		}
		if(lcbjzTime3!=undefined&&lcbjzTime3.length==9){
			var a = lcbjzTime3.substring(0,8) ;
			var b = '0'+lcbjzTime3.substring(8,9) ;
			lcbjzTime3 = a+b ;
		}
		var lcbjzTimes1=new Date(lcbjzTime1).getTime();
		var lcbjzTimes2=(new Date(lcbjzTime2)).getTime();
		var lcbjzTimes3=(new Date(lcbjzTime3)).getTime();
		var oliLen=$(".list-1").length;
		
		//var milestoneMessages=[];
		//var milestoneTimes=[];
		/*var milestoneMessages;
		var milestoneTimes;
		if(oliLen==1){			
			milestoneMessages=lcbmshu1;
			milestoneTimes=lcbjzTimes1;
		}else if(oliLen==2){			
			milestoneMessages=lcbmshu1+'&@&'+lcbmshu2;
			milestoneTimes=lcbjzTimes1+"&@&"+lcbjzTimes2;
		}else if(oliLen==3){			
			milestoneMessages=lcbmshu1+"&@&"+lcbmshu2+"&@&"+lcbmshu3;
			milestoneTimes=lcbjzTimes1+"&@&"+lcbjzTimes2+"&@&"+lcbjzTimes3;
		}*/
		var _milestoneMessages=[];
		var _list=[lcbmshu1,lcbmshu2,lcbmshu3];
		//里程碑时间
		var _milestoneTimes=[];
		var _list2=[lcbjzTimes1,lcbjzTimes2,lcbjzTimes3];
		if(oliLen==3){
			for(var l=0;l<3;l++){
				_milestoneMessages[l]=_list[l];
			}
			for(var a=0;a<3;a++){
				_milestoneTimes[a]=_list2[a];
			}
		}else if(oliLen==2){
			for(var l=0;l<2;l++){
				_milestoneMessages[l]=_list[l];
			}
			for(var a=0;a<2;a++){
				_milestoneTimes[a]=_list2[a];
			}
		}else if(oliLen==1){
			for(var l=0;l<1;l++){
				_milestoneMessages[l]=_list[l];
			}
			for(var a=0;a<1;a++){
				_milestoneTimes[a]=_list2[a];
			}
		}
		
		console.log(_milestoneMessages);
		console.log(_milestoneTimes);
		//当pass==false如果详情里有了里程碑但是不足3个又新添加里程碑的情况
		console.log(_lcbendTime)
		console.log(_message)
		
		//console.log($.param(_milestoneMessages,true))
		var beiduban=$("#firstUserName").text();
		var beiduban2=$("#firstUserName2").text();
		var zxldao=$("#coreManagerName").text();
		var dbzhixr=$("#superviseImplementName").text();
		var dbzhixr2=$("#superviseImplementName2").text();
		var dbzhixr3=$("#superviseImplementName3").text();
		var dubanjzTime=$("#J-xl-2").val();
		var fgldaoren=$("#smallManagerName").text();
		var chusjlren=$("#handleManagerName").text();
		
		//console.log(dubanjzTime)
		//console.log(endTime)
		var nowTime=new Date().getTime();
		var endTime;
		if(dubanjzTime==''){
			endTime=nowTime;
		}else if(dubanjzTime!=''){
			if(dubanjzTime.length==9){
				var a = dubanjzTime.substring(0,8) ;
				var b = '0'+dubanjzTime.substring(8,9) ;
				dubanjzTime = a+b ;
			}
			endTime=new Date(dubanjzTime).getTime();	
			
		}
		var firstUserId=$("#firstUserName").data('lastValue');
		var firstUserId2=$("#firstUserName2").data('lastValue');
		var coreManagerId=$("#coreManagerName").data('lastValue');
		var superviseImplementId=$("#superviseImplementName").data('lastValue');
		var superviseImplementId2=$("#superviseImplementName2").data('lastValue');
		var superviseImplementId3=$("#superviseImplementName3").data('lastValue');
		var smallManagerid=$("#smallManagerName").data('lastValue');
		var handleManagerId=$("#handleManagerName").data('lastValue');
		var zhixinrbumenId=$("#superviseImplementName").data('hidden');
		var zhixinrbumenId2=$("#superviseImplementName2").data('hidden');
		var zhixinrbumenId3=$("#superviseImplementName3").data('hidden');	
		//alert(lcbjzTime1)
		//如果添加里程碑就传,milestoneMessage:lcbmshu,milestoneTime:lcbjzTimes
		if(pass==undefined&&dubanId==undefined){
			if(lcbmshu1==''||lcbmshu2==''||lcbmshu3==''){
				$.malert({  
		                type:'tip',  
		                text: "里程碑描述必填"  
		         }); 					
			}else if(lcbmshu1!=undefined&&lcbjzTime1!=undefined){
				//console.log(dubanSx2)
					var params={userId:userid,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,superviseSource:dubanSx2,endTime:endTime,firstUserId:MembersId,firstUserName:beiduban,"milestoneMessage":_milestoneMessages,"milestoneTime":_milestoneTimes,userOrgId:bumenId,mobileSystem:mobileSystem}
			}else if(lcbmshu1==undefined&&lcbjzTime1==undefined){	
					//没有选择里程碑的情况
					var params={userId:userid,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,superviseSource:dubanSx2,endTime:endTime,firstUserId:MembersId,firstUserName:beiduban,userOrgId:bumenId,mobileSystem:mobileSystem}
			}							
			//console.log(params)
			
			if(nameLen>0&&shixLen>0){
				if(endTime>nowTime){
					var URL='/yiqi/web/supervise/createSupervise.do';											
					//alert(MembersId);
					//alert(userid)
					//alert(bumenId)
					if(MembersId!=userid){
						$.ajax({
							type:"post",
							dataType:"json",
							traditional: true,
							data:params,
							url:URL,
							beforeSend: function(){
								 $(".submit").attr("disabled",true);
							},
							success:function(res){								
								$(".submit").attr("disabled",true);
								console.log(res);
								if(res.success){
									window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;									
								}else{
									 $(".submit").attr("disabled",false);
								}
								
							},						 
							error:function(){
								$.malert({  
										type:'tip',  
										 text: "网络超时请求失败"  
										});  
							}
						})		
					
					}else if(MembersId==userid){
						$.malert({  
			                type:'tip',  
			                text: "起草人与审批人相同"
			          }); 	
					}
				}else if(endTime<nowTime){
					$.malert({  
			                type:'tip',  
			                text: "截止时间不能早于当前时间"
			          }); 	
				}
					
			}else{
				$.malert({  
	                type:'tip',  
	                text: "名称和事项都是必填项"  
	            });  
			}	
		}else if(pass==false){	
			//alert(userId)
			//alert(lcbendTime)
			//alert(message)
			//alert(lcbmshu1)
			//alert(milestones.length)详情里面的里程碑个数
			if(lcbmshu1==''||lcbmshu2==''||lcbmshu3==''){
					$.malert({  
		                type:'tip',  
		                text: "里程碑描述必填"  
		           });  					
			}else if(lcbmshu1!=undefined&&lcbjzTime1!=undefined){
					//编辑的时候添加新的里程碑
					//alert(2)
					var _newmessage=[];
					var _newlcbendTime=[];
					_newmessage=_message.concat(_milestoneMessages);
					_newlcbendTime=_lcbendTime.concat(_milestoneTimes);
					//console.log(_newmessage)
					if(milestones.length==0){
						var params={userId:userid,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,endTime:endTime,firstUserId:firstUserId,firstUserName:beiduban,"milestoneMessage":_milestoneMessages,"milestoneTime":_milestoneTimes,userOrgId:bumenId,mobileSystem:mobileSystem}
					}else{
						var params={userId:userId,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,endTime:endTime,firstUserId:firstUserId,firstUserName:beiduban,milestoneMessage:_newmessage,milestoneTime:_newlcbendTime,superviseImplementDeptId:zhixinrbumenId,isFinish:0,id:dubanId,isPass:1,handlUserId:handlUserId,nextAssigneeId:nextAssigneeId,taskId:taskId,status:status,mobileSystem:mobileSystem}
					}					
			}else if(lcbmshu1==undefined&&lcbjzTime1==undefined){
					//没有添加新里程碑的情况如果详情里面没有里程碑
					if(milestones.length==0){
						var params={userId:userId,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,endTime:endTime,firstUserId:firstUserId,firstUserName:beiduban,superviseImplementDeptId:zhixinrbumenId,isFinish:0,id:dubanId,isPass:1,handlUserId:handlUserId,nextAssigneeId:nextAssigneeId,taskId:taskId,status:status,mobileSystem:mobileSystem}
					}else{
						var params={userId:userId,superviseName:dubanName,typeName:dubanLx,grade:dubanCj,superviseContent:dubanSx,endTime:endTime,firstUserId:firstUserId,firstUserName:beiduban,milestoneMessage:_message,milestoneTime:_lcbendTime,superviseImplementDeptId:zhixinrbumenId,isFinish:0,id:dubanId,isPass:1,handlUserId:handlUserId,nextAssigneeId:nextAssigneeId,taskId:taskId,status:status,mobileSystem:mobileSystem}
						//alert(1)
					}
					
			}		
			
			if(nameLen>0&&shixLen>0){
				if(endTime>nowTime){
					console.log(params)
					var URL='/yiqi/web/supervise/editCheck.do';		
					$.ajax({
						type:"post",
						dataType:"json",
						data:params,
						traditional: true,
						url:URL,
						beforeSend: function(){
							$(".submit").attr("disabled",true);
						},
						success:function(res){
							console.log(res);
							if(res.success){
								window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
							}else{
								$(".submit").attr("disabled",false);
							}
							
						},					
						error:function(){
							$.malert({  
									type:'tip',  
									text: "网络超时请求失败"  
									});  
						}
					})
				}else if(endTime<nowTime){
					$.malert({  
			                type:'tip',  
			                text: "截止时间不能早于当前时间"
			          }); 	
				}
			}else{
				$.malert({  
	                type:'tip',  
	                text: "名称和事项都是必填项"  
	            });  
			}	
		}
	})
	
	//点击督办层级---显示对应的层级领导人
	/*$(".cengJ").change(function(){
		if($(this).val()=="一类"){
			$(".main-3").show();
			$(".main-4").hide();
			$(".main-5").hide();
		}else if($(this).val()=="二类"){
			$(".main-4").show();
			$(".main-3").hide();
			$(".main-5").hide();
		}else{
			$(".main-5").show();
			$(".main-3").hide();
			$(".main-4").hide();
		}
	})*/
	
	//督办名称字数限制--20个字符
//	$(".dubanName").bind("input propertychange",function(){
//		var Len=$(".dubanName").val().length;
//		var Val=$(".dubanName").val();	
//		/*var emty=Val.replace(/^\s+/g, "");//不能以空格开头
//		$(this).val(emty);*/
//		if(Len>20){
//			$(this).val($(this).val().substring(0,20));
//		}		
//	})
	/*$(".dubanName").keyup(function(){
		var Len=$(".dubanName").val().length;
		var Val=$(".dubanName").val();
		var emty=Val.replace(/^\s+/g, "");//不能以空格开头
		$(this).val(emty);
		if(Len>20){
			$(this).val($(this).val().substring(0,20));
		}			
	})*/
	/*$(".dubanName").on("input",function(){
	   setTimeout(function(){
	     	var Len=$(".dubanName").val().length;
			var Val=$(".dubanName").val();
			var emty=Val.replace(/^\s+/g, "");//不能以空格开头
			$(this).val(emty);
			if(Len>20){
				$(this).val($(this).val().substring(0,20));
			}	
	   },300);
	});*/
	
	//督办事项字数限制--1000个字符
//	$(".main-2 .dubanshix").bind("input propertychange",function(){
//		var Len=$(".main-2 .dubanshix").val().length;
//		var shiVal=$(".main-2 .dubanshix").val();
//		/*var emtys=shiVal.replace(/^\s+/g, "");//不能以空格开头
//		$(this).val(emtys);*/
//		if(Len>1000){
//			$(this).val($(this).val().substring(0,999));
//		}		
//	})
//	$(".main-5 .dubanshix").bind("input propertychange",function(){
//		var Len=$(".main-5 .dubanshix").val().length;
//		var shiVal=$(".main-5 .dubanshix").val();
//		/*var emtys=shiVal.replace(/^\s+/g, "");//不能以空格开头
//		$(this).val(emtys);*/
//		if(Len>30){
//			$(this).val($(this).val().substring(0,30));
//		}		
//	})	
	/*$(".dubanshix").keyup(function(){
		var Len=$(".dubanshix").val().length;
		var shiVal=$(".dubanshix").val();
		var emtys=shiVal.replace(/^\s+/g, "");//不能以空格开头
		$(this).val(emtys);
		if(Len>1000){
			$(this).val($(this).val().substring(0,999));
		}			
	})*/
	
})

