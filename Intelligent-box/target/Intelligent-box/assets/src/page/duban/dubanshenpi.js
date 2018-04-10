$(function(){
	$(".btn").hide();
	$(".btnsub").hide();
	$(".qu").hide();
	$(".qxby").hide();
	$('.aplays').hide();
	$(".qx").hide();
	$(".bj").hide();
	$(".btnbohui").hide();
	var pmheight=$(window).outerHeight();
	$("#wraper").css({"height":pmheight,"overflow":"scroll","width":"100%"})
	
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
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
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
//	console.log(id);
	
	
	$.ajax({
			type:'get',
			dataType:"json",			
			url:'/yiqi/api/users/'+cid+'',
			success:function(res){				
				//console.log(res);
				var model=res.model;
				if(model){
					var comoanyName=model[0].name
				}
				
				$(".hy").html(comoanyName)
				//console.log(model);
				if(model){
					var lists=model[0].orgList;//取出所有部门
				}
			
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
					$(".person>li>div").removeClass("Active");
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
					$(".members>li>div").removeClass("Active");
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
	$(".cancel2").click(function(){
		$("#selectPersonnel").hide();
		$("#wrap").show();
	})
	
	
	//选择人员	
	$(".person").on("click","div",function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).children("span").remove()
			$(".person>li>div").removeClass("Active");
		}else{
			$(".person>li>div").children("span").remove();
			$(".person>li>div").removeClass("active");
			$(this).append("<span class='gou'></span>");
			$(this).prop({"checked":true});
			$(this).addClass("Active");
		}	
	})	
	$(".members").on("click","div",function(){
		if($(this).prop("checked")){
			$(this).prop({"checked":false});
			$(this).children("span").remove()
			$(".members>li>div").removeClass("Active");
		}else{
			$(".members>li>div").children("span").remove();
			$(".members>li>div").removeClass("active");
			$(this).append("<span class='gou'></span>");
			$(this).prop({"checked":true});
			$(this).addClass("Active");
		}	
	})
	//调用详情接口	
	var Arrs=[];
	var jiaoban=[];
	//var bohui=[];
	var bianji=[];
	var assigneeNames;
	$.ajax({
				type:"get",
				dataType:"json",
				//cache:false,
				url:'/yiqi/web/supervise/getDetail.do?superviseId='+id+'&userId='+userid,
				beforeSend: function(request) {
                    request.setRequestHeader("Cache-Control", "no-store");
                    request.setRequestHeader("Pragrma", "no-cache");
                    request.setRequestHeader("Expires", 0);
                 },
				success:function(res){
					console.log(res);
					var lists=res.model;
					if(lists){
						if(lists.superviseName){
							var dubanName=lists.superviseName;
							$(".duban").html(dubanName);
						}
						var dubanleix=lists.typeName;
						$(".leix").html(dubanleix);
							var grade=lists.grade;
					$(".cengji").html(grade);
					var dubanshix=lists.superviseContent;
					var dubanshix2=lists.superviseSource;
					$(".Box1 .dubanmiaoshu").html(dubanshix);
					$(".Box2 .dubanmiaoshu").html(dubanshix2);
					var jiezTime=new Date(lists.endTime);
					var jiezTimes=jiezTime.format('yyyy-MM-dd');
					$("#J-xl-2").html(jiezTimes);
					var nextAssigneeId=lists.nextAssigneeId;
					var nextAssigneeName=lists.nextAssigneeName;
					var firstUserName=lists.firstUserName;	
					var firstUserId=lists.firstUserId;
					var firstUserIdUrl=lists.firstUserIdUrl;	
					var coreManagerName=lists.coreManagerName;	
					var smallManagerName=lists.smallManagerName;
					var smallManagerUrl=lists.smallManagerUrl;
					var superviseImplementName=lists.superviseImplementName;		
					var handleManagerName=lists.handleManagerName;
					var superviseCheckId=lists.superviseCheckId;
					var userId=lists.userId;															
					var isPass=lists.pass;
					var dubanid=lists.id;
					var superviseImplementId=lists.superviseImplementId;
					var taskId=lists.taskId;
					var procInstId=lists.procInstId;
					var shenpiId=lists.superviseCheckId;
					var checkTypeName=lists.checkTypeName;
					var administrator=lists.administrator;
					var roleVos=lists.roleVos;
					//roleVos.reverse();

 
			
					if(administrator==true){
						$('.header_delete').css({'display':'block'});
					}else{
						$('.header_delete').css({'display':'none'});
					}
					//是管理员头部出现删除按钮，有删除的权限
					$('.header_delete').on('click',function(){
						$("#mask").show();
						$("#deletebox").show();
					})
					$('#deletebox .quxiao').on('click',function(){
						$("#deletebox").hide();
					})
					$('#deletebox .quedin').on('click',function(){
						$.ajax({
							type:'get',
							dataType:"json",			
							url:'/yiqi/web/supervise/deleteSupervise.do?superviseId='+dubanid+'&userId='+userid,
							success:function(res){
									window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;		
							}
						})
					})

					}	
					//点击编辑审批回到起草页面
						$(".editsp").click(function(){
							window.location.href="/yiqi/web/supervise/compose.do?id="+dubanid;
						})		
					//截止时间与当前时间比较判断超时
					if(lists){
						var endTimes=new Date(lists.endTime).getTime();
					var nowTime=new Date().getTime();		
					}
								
					if(grade=="一类"){
						$(".firstUserName").html(firstUserName);												
						$(".closebox2").hide();
						$(".closebox3").hide();
					}else if(grade=="二类"){
						$(".closebox2").show();
						$(".closebox1").hide();
						$(".closebox3").hide();
						$(".firstUserName2").html(firstUserName);
						/*$(".smallManagerName").html(smallManagerName);
						$(".superviseImplementName2").html(superviseImplementName);*/
					}else if(grade=="三类"){
						$(".closebox3").show();
						$(".closebox1").hide();
						$(".closebox2").hide();						
					}
					if(lists){
						var endTime=lists.endTime;
						var milestones=lists.milestones;
					}
					//console.log(milestones.length)
					for(var j=0;j<milestones.length;j++){								
						if(milestones.length>0){
							$(".closelcb").show();
							var lcbmiaoshu= milestones[j].message;
							//$(".lcbmiaoshu").html(lcbmiaoshu);
							var lcbTime=new Date(milestones[j].endTime);
							var lcbTimes=lcbTime.format('yyyy-MM-dd');
							var status=milestones[j].status;
							//$(".lcbTime").html(lcbTimes);	
							$(".closelcb").append("<p>里程碑"+(j+1)+"<img src='/yiqi/assets/src/css/img/jinxzhong.png' class='jxzpic'></p>");
							$(".closelcb").append("<p class='shix'><span class='dubansx'>里程碑描述:</span><span class='miaoshu lcbmiaoshu'>"+lcbmiaoshu+"</span></p>");
							$(".closelcb").append("<p>截止时间:<span class='lcbTime'>"+lcbTimes+"</span></p>");
						}
					}	
					var tAppSuperviseChecks=lists.tAppSuperviseChecks;
					for(var n=0;n<tAppSuperviseChecks.length;n++){
						var createTime=new Date(tAppSuperviseChecks[n].createTime);
						var createTimes=createTime.format('yyyy-MM-dd hh:mm');									
						//var nextAssigneeName=tAppSuperviseChecks[n].nextAssigneeName;	
						var assigneeName=tAppSuperviseChecks[n].assigneeName;
						var title=tAppSuperviseChecks[n].title;	
						if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title==null){
							tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
						}
						if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].nextAssigneeId==null&&tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="审批拒绝"){
							tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
						}
						if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
							tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
						}
						if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批驳回"){
							tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
							
						}
						
						/*if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
							tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";
						}*/
						console.log(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title);
						
						var picUrl=tAppSuperviseChecks[n].url;
						var departmentName=tAppSuperviseChecks[n].departmentName;
						var roleName = tAppSuperviseChecks[n].roleName ;
						//console.log(title);									
						var checkMessage=tAppSuperviseChecks[n].checkMessage;	
						//console.log(picUrl);
						assigneeNames=tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName;					
						
						if(checkMessage==null&&picUrl==null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div style='overflow: hidden;'><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
						}else if(checkMessage==null&&picUrl!=null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div style='overflow: hidden;'><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
						}else if(checkMessage!=null&&picUrl!=null){
							if(checkMessage==''){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div><p style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
							}else if(checkMessage!=''){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
							}								
						}else if(checkMessage==''&&picUrl==null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
						}else if(checkMessage==''&&picUrl!=null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
						}else if(checkMessage!=''&&picUrl==null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
						}else if(checkMessage!=''&&picUrl!=null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r p5'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
						}
						
						
						//发起审批的审批意见去掉
						$(".shenpi-1").eq(0).children().remove("p");
						//根据tAppSuperviseChecks.length去掉最后一个class为line的span
						$(".line").eq(tAppSuperviseChecks.length-1).removeClass("line");
						
						if(tAppSuperviseChecks[n].title=="审批同意"){
							console.log(n);
							$(".titles").eq(n).css("color","#7fba83");
						}else if(tAppSuperviseChecks[n].title=="审批拒绝"){
							$(".titles").eq(n).css("color","#e58998");
						}else if(tAppSuperviseChecks[n].title=="验收通过"){
						$(".titles").eq(n).css("color","#7fba83");
						}else if(tAppSuperviseChecks[n].title=="验收拒绝"){
							$(".titles").eq(n).css("color","#e58998");
						}
										
					}
					var shenpiLength=$('.shenpi-1').length;
					if(shenpiLength>=3){
						if($('.display_more')){
							$('.display_more').remove();
							$('.display_none').remove();
						}
						$('.process .shenpi-1').eq(0).after("<a class='display_more'>展开查看更多</a>");
						$('.shenpi-1').hide();
						$('.shenpi-1').eq(0).show();
						$('.shenpi-1').eq(shenpiLength-1).show();
						$('.process .shenpi-1').eq(shenpiLength-1).after("<a class='display_none' style='display:none;'>收起</a>");
					}else{
						if($('.display_more')){
							$('.display_more').remove();
							$('.display_none').remove();
						}
					}
					$('.display_more').on('click',function(){
						$('.shenpi-1').show();
						$('.display_more').css({'display':'none'});
						$('.display_none').css({'display':'block'});
						
					})
					$('.display_none').on('click',function(){
							console.log(1);
							if(shenpiLength>=3){
								$('.shenpi-1').hide();
								$('.shenpi-1').eq(0).show();
								$('.shenpi-1').eq(shenpiLength-1).show();
							}
						$('.display_more').css({'display':'block'});
						$('.display_none').css({'display':'none'});
							
						})
					
					var checkUserVos=lists.checkUserVos;
					
					//判断当前操作人是否为当前用户如果是可以审批不是显示详情firstUserName!="刘鼎（博）"
					//console.log(superviseCheckId);
					console.log(nextAssigneeId);
					console.log(userid);
					console.log(userId);
							if(checkTypeName==3&&nextAssigneeId==userid&&isPass==true){
								
								$(".btn").hide();
								$(".btnsub").hide();
								$(".qu").hide();
								$(".qxby").hide();
								$(".aplays").show();
								$(".qx").hide();
								$(".btnbohui").hide();
								$(".bj").hide();
								$('.process').addClass('active');
								var tAppSuperviseChecks=lists.tAppSuperviseChecks;	
								var checkUserVos=lists.checkUserVos;
								$(".two").addClass("agrees");
								for(var c=0;c<checkUserVos.length;c++){
									var assigneeName=checkUserVos[c].assigneeName;							
									if(checkUserVos.length==3){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".superviseImplementName").html(nextAssigneeName);
										}
									}
									if(checkUserVos.length==2){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											$(".superviseImplementName2").html(nextAssigneeName);
										}
									}
									if(checkUserVos.length==1){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="三类"){
											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											
											$(".superviseImplementName3").html(nextAssigneeName);
										}
									}
								}

								
								
								//点击里程碑进入里程碑详情
								$(".closelcb").click(function(){
									$("#wrap").hide();
									$("#lcbdetail").show();
								})
								//点击back返回执行页
								$(".back").click(function(){
									$("#wrap").show();
									$("#lcbdetail").hide();
									window.location.reload();
								})
								//申请验收
								$(".submit").click(function(){
									var title=$("#agreebox .title").text();										
									$(".quedin").click(function(){																
										var opinion=$(".txtbox").val();
										var params;
										if(opinion.length!=0){
											params={isPass:'1',handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
										}else{
											params={isPass:'1',handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
										}											
										$.ajax({
											type:"post",
											dataType:"json",
											data:params,
											url:'/yiqi/web/supervise/toCheck.do',
											beforeSend: function(){
												//$("#wrap").append("<div class='jiangli'><img src='/yiqi/assets/src/css/img/biaoyang.gif' class='biaoyang'/></div>");
													//var imgs = $(".biaoyang");
													//setTimeout(function() {
														//imgs.hide();																			
													//},2000);
											},
											success:function(res){
												console.log(res);
												if(res.success){
													window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;			
													
												}
											},
											error:function(){
												$.malert({  
													  type:'tip',  
													   text: "网络超时请求失败"  
												});  
											}
										})
									})		
								})																
							}else if(checkTypeName==3&&nextAssigneeId==userid&&isPass==false){
								$(".btn").hide();
								$(".btnsub").hide();
								$(".qu").hide();
								$(".qxby").hide();
								$('.aplays').hide();
								$(".qx").hide();
								$(".btnbohui").hide();
								$(".bj").show();
								$('.process').addClass('active');
								$(".two").addClass("agrees");
								var checkUserVos=lists.checkUserVos;
								for(var c=0;c<checkUserVos.length;c++){
									var assigneeName=checkUserVos[c].assigneeName;							
									if(checkUserVos.length==4){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".coreManagerName").html(checkUserVos[2].assigneeName);
										}
									}
									if(checkUserVos.length==2){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="三类"){
											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName3").html(checkUserVos[0].assigneeName);
											$(".superviseImplementName3").html(checkUserVos[1].assigneeName);
										}
									}
									if(checkUserVos.length==3){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".coreManagerName").html(checkUserVos[2].assigneeName);
										}else if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											//$(".coreManagerName").html(checkUserVos[2].assigneeName);
										}
									}
								}
								
								
								//点击编辑审批回到起草页面
								$(".edits").click(function(){
									window.location.href="/yiqi/web/supervise/compose.do?id="+dubanid;
								})	
								//驳回验收
								$(".bohui").click(function(){
									var title=$("#agreebox .title").text();										
									$(".quedin").click(function(){																
										var opinion=$(".txtbox").val();
										var params;
										if(opinion.length!=0){
											params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
										}else{
											params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
										}											
										$.ajax({
											type:"post",
											dataType:"json",
											data:params,
											url:'/yiqi/web/supervise/toCheck.do',
											beforeSend: function(){												
											},
											success:function(res){
												console.log(res);
												if(res.success){
													window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;			
													
												}
											},
											error:function(){
												$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
											});  
											}
										})
									})		
								})		
							}else if(nextAssigneeId!=userid){
								if(checkUserVos.length==0){								
									$('.closebox1').hide();
									$('.closebox2').hide();
									$('.closebox3').hide();
									
								}
							if(checkUserVos.length==1){
								
								if(grade=="一类"){									
									$('.closebox1 .box2').eq(0).show();
									$('.closebox1 .box2').eq(1).hide();
									$('.closebox1 .box2').eq(2).hide();
									$('.closebox1 .box2').eq(3).hide();
									$('.closebox1 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									
								}else if(grade=="二类"){
									$('.closebox2 .box2').eq(0).show();
									$('.closebox2 .box2').eq(1).hide();
									$('.closebox2 .box2').eq(2).hide();
									$('.closebox2 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
								}
//								else if(grade=="三类"){
//									$('.closebox3 .box2').eq(0).show();
//									$('.closebox3 .box2').eq(1).hide();
//									$('.closebox3 .box2').eq(2).hide();
//									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
//									
//								}
							}
							if(checkUserVos.length==2){
								
								if(grade=="一类"){									
									$('.closebox1 .box2').eq(0).show();
									$('.closebox1 .box2').eq(1).show();
									$('.closebox1 .box2').eq(2).hide();
									$('.closebox1 .box2').eq(3).hide();
									$('.closebox1 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox1 .box2').eq(1).html("<p class='one'>分管领导:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
									
								}else if(grade=="二类"){
									$('.closebox2 .box2').eq(0).show();
									$('.closebox2 .box2').eq(1).show();
									$('.closebox2 .box2').eq(2).hide();
									$('.closebox2 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox2 .box2').eq(1).html("<p class='one'>分管领导:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
								}
//								else if(grade=="三类"){
//									$('.closebox3 .box2').eq(0).show();
//									$('.closebox3 .box2').eq(1).show();
//									$('.closebox3 .box2').eq(2).hide();
//									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
//									$('.closebox3 .box2').eq(1).html("<p class='one'>主办负责人2:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
//								}
								
//								
							}
							if(checkUserVos.length==3){
								$(".box13").css("display","block");
								if(grade=="一类"){
									$('.closebox1 .box2').show();
									$('.closebox1 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox1 .box2').eq(3).hide();
									$('.closebox1 .box2').eq(1).html("<p class='one'>分管领导:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
									$('.closebox1 .box2').eq(2).html("<p class='one'>中心领导:</p><span class='two'>"+checkUserVos[2].assigneeName+"</span>")
									
								}
//								if(grade=="三类"){
//									$('.closebox3 .box2').show();
//									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
//									$('.closebox3 .box2').eq(1).html("<p class='one'>主办负责人2:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>");
//									$('.closebox3 .box2').eq(2).html("<p class='one'>督办执行人:</p><span class='two'>"+checkUserVos[2].assigneeName+"</span>");
//								}
								if(grade=="二类"){
									$('.closebox2 .box2').show();
									$('.closebox2 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox2 .box2').eq(1).html("<p class='one'>分管领导:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
									$('.closebox2 .box2').eq(2).html("<p class='one'>督办执行人:</p><span class='two'>"+checkUserVos[2].assigneeName+"</span>")
								}

							}
							if(checkUserVos.length==4){
								if(grade=="一类"){
									$('.closebox1 .box2').show();
									$('.closebox1 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox1 .box2').eq(1).html("<p class='one'>分管领导:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
									$('.closebox1 .box2').eq(2).html("<p class='one'>中心领导:</p><span class='two'>"+checkUserVos[2].assigneeName+"</span>")
									$('.closebox1 .box2').eq(3).html("<p class='one'>督办执行人:</p><span class='two'>"+checkUserVos[3].assigneeName+"</span>")
								}
								
							}
							if(grade=="三类"){
								$('.closebox3 .box2').find('span').removeClass('tj');
								if(roleVos[0]){
									$('.closebox3 .box2').eq(0).find('.one').text(roleVos[0].roleName);
									$('.closebox3 .box2').eq(0).find('span').text(roleVos[0].roleUserName);
								}
								if(roleVos[1]){
									$('.closebox3 .box2').eq(1).show();
									$('.closebox3 .box2').eq(1).find('.one').text(roleVos[1].roleName);
									$('.closebox3 .box2').eq(1).find('img').remove();
									$('.closebox3 .box2').eq(1).find('span').text(roleVos[1].roleUserName);
								}else{
									$('.closebox3 .box2').eq(1).hide();
									$('.closebox3 .box2').eq(2).hide();
								}
								if(roleVos[2]){
									$('.closebox3 .box2').eq(2).find('.one').text(roleVos[2].roleName);
									$('.closebox3 .box2').eq(2).find('span').text(roleVos[2].roleUserName);
									$('.closebox3 .box2').eq(2).find('span').addClass('two');
								}else{
									$('.closebox3 .box2').eq(2).hide();
								}
							}
						}else if(isPass==0&&nextAssigneeId==userid&&nextAssigneeId==userId&&checkTypeName==null){
						$('.process').addClass('active');
						$(".qxby").show();			
						$(".btn").hide();
						$(".btnsub").hide();
						$(".qu").hide();
						$('.aplays').hide();
						$(".qx").hide();
						$(".btnbohui").hide();
//						$(".bj").show();
						$(".smallManagerUrl").remove();
						$(".box22").eq(0).removeClass("box22").addClass("charu");
						$(".two2").eq(0).remove();
						$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");						
						//中心领导人
						$(".coreManagerIdUrl").remove();
						$(".box22").eq(0).removeClass("box22");
						$(".two2").eq(0).remove();
						$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");						
						
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;
							if(checkUserVos.length==2){								
								$(".box12").css("display","block");
								if(grade=="一类"){									
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".slectMan").css("display","none");
									/*if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".slectMan").css("display","block");
										$(".closebox1 .coreManagerName").html(nextAssigneeName);										
									}*/
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".closebox2 .smallManagerName").html(checkUserVos[1].assigneeName);
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".slectMan").css("display","block");
										$(".superviseImplementName2").html(nextAssigneeName);
										//alert(1)										
									}
									if(tAppSuperviseChecks[0].assigneeName==tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName){
										$(".box23").removeClass("box22");
										$(".box23 .two2").remove();
										$(".box23 span").remove();
										$(".box23").append("<span class='iblock two agrees smallManagerName2'>"+checkUserVos[1].assigneeName+"</span>");
									}
								}else if(grade=="三类"){
									$('.box4').show();
									$('.box12').hide();
									$(".closebox3 .two3").html("<span class='iblock two agrees'>"+checkUserVos[1].assigneeName+"</span>");
									$(".closebox3 .firstUserName3").html(checkUserVos[0].assigneeName);
								}
							}
							if(checkUserVos.length==1){
								$(".box12").css("display","block");
								if(grade=="一类"){									
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box12").css("display","none");
									if(checkUserVos[c].assigneeName!=nextAssigneeName&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批同意"){
										$(".box12").css("display","block");
										$(".closebox1 .smallManagerName").html(nextAssigneeName);
									}
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box23").css("display","none");
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box23").css("display","block");
										$(".closebox2 .smallManagerName").html(nextAssigneeName);
									}
									if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
										$(".box23").css("display","none");
									}
								}else if(grade=="三类"){
									$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName3").html(checkUserVos[0].assigneeName);
									
								}
							}
							if(checkUserVos.length==3){
								$(".box13").css("display","block");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);	
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
								}
								
							}																					
						}
						/*if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"){
							$(".slectMan").append("<span class='iblock two agrees coreManagerName'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");
							
						}
						
						for(var z=0;z<tAppSuperviseChecks.length;z++){
							if(tAppSuperviseChecks[z].title=="审批同意"){
								bianji.push(z);
								//alert(arrs.length)
								$(".agrees").eq(bianji.length-1).html(tAppSuperviseChecks[z].assigneeName);
								
							}	
						}
						
						//console.log(arrs.length)
						if(bianji.length==3){
							$("#slectMan").css("display","block");							
						}else if(bianji.length==2){
							$("#slectMan").css("display","block");
							if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批驳回"&&tAppSuperviseChecks[tAppSuperviseChecks.length-4].title=="审批拒绝"){
								$(".coreManagerName").html(tAppSuperviseChecks[tAppSuperviseChecks.length-4].assigneeName);
							}
						}else if(bianji.length==0){
							$(".box12").css("display","none");
						}*/
													
						//点击取消审批弹出确认窗口
						if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName==tAppSuperviseChecks[0].assigneeName){
							//$(".box12").css("display","none");
							$(".qxby").show();
							$(".cancelsp").on('click',function(){
								
								$(".quedin").off('click').on('click',function(){	
								var param={isFinish:1,id:dubanid};
									$.ajax({
										type:"post",
										dataType:"json",
										data:param,
										url:'/yiqi/web/supervise/editCheck.do',
										success:function(res){
											console.log(res)
											if(res.success){														
												window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;  
											}else if(nowTime>endTimes){
												$.malert({  
													type:'tip',  
													text: "该督办已经超时"  
										 		});  													
											}
										},
										error:function(){
											$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
											});  
										}
									})
								})				
							})
						}						
					}else if(checkTypeName==4&&nextAssigneeId==userid&&isPass==true){
								
								$('.process').addClass('active');
								$(".btnbohui").show();		
								$(".btn").hide();
								$(".btnsub").hide();
								$(".qu").hide();
								$('.aplays').hide();
								$(".qx").hide();
								$(".bj").show();
								$(".two").addClass("agrees");
								var checkUserVos=lists.checkUserVos;
								for(var c=0;c<checkUserVos.length;c++){
									var assigneeName=checkUserVos[c].assigneeName;							
									if(checkUserVos.length==4){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".coreManagerName").html(checkUserVos[2].assigneeName);
										}
									}
									if(checkUserVos.length==3){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											//$(".coreManagerName").html(checkUserVos[2].assigneeName);
											
										}
									}
									if(checkUserVos.length==2){
										$(".slectMan").css("display","block");																		
										if(grade=="三类"){
											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);																						
										}
									}
								}
								
								//点击同意验收
//								$('.rankRight ul li').off( 'click' ).on('click',function(){
								$(".agree").click(function(){	
										var Name=$('.closebox3 #smallManagerName').text();
										var title=$("#agreebox .title").text();
										$(".quedin").click(function(){
											var opinion=$(".txtbox").val();
											
											var params;
											if(opinion.length!=0){
												params={isPass:'1',handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
											}else{
												params={isPass:'1',handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
											}
											
											$.ajax({
												type:"post",
												dataType:"json",
												data:params,
												url:'/yiqi/web/supervise/toCheck.do',
												success:function(res){
													console.log(res);
													if(res.success){
														window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
													}
												},
												error:function(){
													$.malert({  
														  type:'tip',  
														   text: "网络超时请求失败"  
													});  
												}
											})
										})																												
									})
									//点击拒绝验收
									$(".cancel").click(function(){
										var title=$("#agreebox .title").text();
										
										$(".quedin").off('click').on('click',function(){
											var opinion=$(".txtbox").val();
											
											var params;
											if(opinion.length!=0){
												params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
											}else{
												params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
											}
											
											$.ajax({
												type:"post",
												dataType:"json",
												data:params,
												url:'/yiqi/web/supervise/toCheck.do',
												success:function(res){
													console.log(res);
													window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
												},
												error:function(){
													$.malert({  
														  type:'tip',  
														   text: "网络超时请求失败"  
													});  
												}
											})
										})																												
									})																									
							}else if(checkTypeName==4&&nextAssigneeId==userid&&isPass==false){
								$('.process').addClass('active');
								$(".qx").show();
								$(".qxby").show();			
								$(".btn").hide();
								$(".btnsub").hide();
								$(".qu").hide();
								$('.aplays').hide();
								$(".btnbohui").hide();
								$(".two").addClass("agrees");
								
								var checkUserVos=lists.checkUserVos;
								for(var c=0;c<checkUserVos.length;c++){
									var assigneeName=checkUserVos[c].assigneeName;							
									if(checkUserVos.length==4){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".coreManagerName").html(checkUserVos[2].assigneeName);
										}
									}
									if(checkUserVos.length==3){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											//$(".coreManagerName").html(checkUserVos[2].assigneeName);											
										}
									}
									if(checkUserVos.length==2){
										$(".slectMan").css("display","block");																		
										if(grade=="三类"){
											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);																						
										}
									}
								}
								//点击编辑审批回到起草页面
								$(".editsp").click(function(){
									window.location.href="/yiqi/web/supervise/compose.do?id="+dubanid;
								})	
								//驳回验收
								$(".bohui").click(function(){
									var title=$("#agreebox .title").text();										
									$(".quedin").click(function(){																
										var opinion=$(".txtbox").val();
										var params;
										if(opinion.length!=0){
											params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
										}else{
											params={isPass:0,handlUserId:userid,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
										}											
										$.ajax({
											type:"post",
											dataType:"json",
											data:params,
											url:'/yiqi/web/supervise/toCheck.do',
											beforeSend: function(){												
											},
											success:function(res){
												console.log(res);
												if(res.success){
													window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;																
												}
											},
											error:function(){
												$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
												});  
											}
										})
									})		
								})		
							}else if(nextAssigneeId!=userid){
								$('.process').removeClass('active');
								$(".btn").hide();
								$(".btnsub").hide();
								$(".qu").hide();
								$(".qxby").hide();
								$('.aplays').hide();
								$(".qx").hide();
								$(".bj").hide();
								$(".btnbohui").hide();
						if(grade=="一类"){
							$(".closebox1 .smallManagerUrl").remove();
							$(".closebox1 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox1 .two2").eq(0).remove();
							$(".closebox1 .box12").hide();
//							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="二类"){
							$(".closebox2 .smallManagerUrl").remove();
							$(".closebox2 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox2 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="三类"){
							$(".closebox3 .smallManagerUrl").remove();
							$(".closebox3 .box22").eq(0).removeClass("box22").addClass("charu");
							
							$(".closebox3 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}
								var checkUserVos=lists.checkUserVos;
							if(checkUserVos.length==1){								
								
								if(grade=="一类"){
//									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box12").children().remove();
									$(".box12").addClass("box22").removeClass("charu");
									$(".box12").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box12 span").remove();
										$(".smallManagerUrl").remove();
										$(".box12").removeClass("box22");
										$(".box12 .two2").eq(0).remove();
										$(".box12").append("<span class='iblock two agrees smallManagerName'>"+nextAssigneeName+"</span>");
										$(".slectMan").css("display","block");
									}
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box23").children().remove();
									$(".box23").addClass("box22").removeClass("charu");
									$(".box23").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box23 span").remove();
										$(".smallManagerUrl").remove();
										$(".box23").removeClass("box22");
										$(".box23 .two2").eq(0).remove();
										$(".box23").append("<span class='iblock two agrees smallManagerName'>"+nextAssigneeName+"</span>");
									}
								}else if(grade=="三类"){
									$(".box12").css({"display":"none"});
//									$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
									$(".closebox3 .two21").append("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl smallManagerUrl1'/>");
									$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName3").html(checkUserVos[0].assigneeName);
									$(".zhixin3").css("display","block");
									$(".zhixin3").addClass("box22").removeClass("charu");
									$(".zhixin3").html("<p class='one'>主办负责人2:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");										
								}
							}
											
						//分管领导人
						/*$(".smallManagerUrl").remove();
						$(".box22").eq(0).removeClass("box22");
						$(".two2").eq(0).remove();
						$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");*/	
						
						//中心领导人
						$(".coreManagerIdUrl").remove();
						$(".box22").eq(0).removeClass("box22");
						$(".two2").eq(0).remove();
						$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");						
						
						/*if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"){
							$(".slectMan").append("<span class='iblock two agrees coreManagerName'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");							
						}
						
						for(var d=0;d<tAppSuperviseChecks.length;d++){
							if(tAppSuperviseChecks[d].title=="审批同意"){
								arrs.push(d);
								//alert(arrs.length)
								$(".agrees").eq(arrs.length-1).html(tAppSuperviseChecks[d].assigneeName);								
							}	
						}*/
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;
							if(checkUserVos.length==2){								
								$(".box12").css("display","block");
								if(grade=="一类"){
									
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
									$(".slectMan").css("display","none");
									/*if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".slectMan").css("display","block");
										$(".closebox1 .coreManagerName").html(nextAssigneeName);										
									}*/
									if(checkUserVos[c].assigneeName!=nextAssigneeName&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批同意"){
										$(".slectMan").css("display","block");
										$(".closebox1 .coreManagerName").html(nextAssigneeName);
									}
									
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".closebox2 .smallManagerName").html(checkUserVos[1].assigneeName);
									$(".closebox2 .firstUserName2").html(checkUserVos[0].assigneeName);
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".slectMan").css("display","block");
										$(".superviseImplementName2").html(nextAssigneeName);
										//alert(1)
										
									}
								}
							}
							if(checkUserVos.length==1){
								if(grade=="一类"){									
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box12").css("display","none");
									if(checkUserVos[c].assigneeName!=nextAssigneeName&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批同意"){
										$(".box12").css("display","block");
										$(".closebox1 .smallManagerName").html(nextAssigneeName);
									}
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box23").css("display","none");
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box23").css("display","block");
										$(".closebox2 .smallManagerName").html(nextAssigneeName);
									}
									if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
										$(".box23").css("display","none");
									}
								}else if(grade=="三类"){
									$(".box12").css({"display":"none"});
//									$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
									$(".closebox3 .two21").append("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl smallManagerUrl1'/>");
									$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName3").html(checkUserVos[0].assigneeName);
									$(".zhixin3").css("display","block");
									$(".zhixin3").addClass("box22").removeClass("charu");
									$(".zhixin3").html("<p class='one'>主办负责人2:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");
								}
							}
							if(checkUserVos.length==3){
								$(".box13").css("display","block");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);	
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
								}
								
							}	
							if(checkUserVos.length==4){
								$(".box13").css("display","block");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);	
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
								}								
							}	
						}
						if(checkUserVos.length==0){	
							if(grade=="一类"){
								$(".firstUserName").html(nextAssigneeName);
								$(".box12").css("display","none");
							}else if(grade=="二类"){
								$(".firstUserName2").html(nextAssigneeName);
								$(".box23").css("display","none");									
							}else if(grade=="三类"){
								$(".firstUserName3").html(nextAssigneeName);
								$(".zhixin3").css("display","none");
								$(".closebox3 .box12").css({'display':'none'});
							}
						}
						
						
						
					}else if(isPass==1&&nextAssigneeId==userid&&checkTypeName==5){
						$('.process').addClass('active');
						$(".btn").hide();
						$(".btnsub").show();
						$(".qu").hide();
						$(".qxby").hide();
						$('.aplays').hide();
						$(".qx").hide();
						$(".bj").hide();
						$(".btnbohui").hide();
						
						/*$(".smallManagerUrl").remove();
						$(".box22").eq(0).removeClass("box22").addClass("charu");
						$(".two2").eq(0).remove();
						$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");*/
						//中心领导人
						$(".coreManagerIdUrl").remove();
						$(".box22").eq(0).removeClass("box22");
						$(".two2").eq(0).remove();
						$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");
						if(grade=="一类"){
							$(".closebox1 .smallManagerUrl").remove();
							$(".closebox1 .box12").removeClass("box22").addClass("charu");
							$(".closebox1 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
							$(".zhixin").css("display","block");
							$(".zhixin").html("<p class='one'>督办执行人:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia superviseImplementIdUrl'/><span class='tj iblock' id='superviseImplementName'>添加</span></p>");
						}else if(grade=="二类"){
							$(".closebox2 .smallManagerUrl").remove();
							$(".closebox2 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox2 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
							$(".zhixin2").css("display","block");
							$(".zhixin2").html("<p class='one'>督办执行人:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia superviseImplementIdUrl'/><span class='tj iblock' id='superviseImplementName'>添加</span></p>");
						}else if(grade=="三类"){
							$(".closebox3 .smallManagerUrl").remove();
							$(".closebox3 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox3 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}
					
						
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;							
							if(checkUserVos.length==3){
								$(".slectMan").css("display","block");								
								$(".two").removeClass("iblock");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
								}
							}
							if(checkUserVos.length==2){
								$(".box12").css("display","block");
								$(".two").removeClass("iblock");
								$(".two2 span").removeClass("iblock");
								$(".zhixin2 span").addClass("iblock");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
								}else if(grade=="二类"){
									$(".zhixin p").remove();
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".firstUserName2").html(checkUserVos[0].assigneeName);
									$(".closebox2 .smallManagerName").html(checkUserVos[1].assigneeName);									
								}
							}
							
						}
						
						//点击交办
						$(".btnsub").click(function(){
							var title=$("#agreebox .title").text();	
							if(grade=="一类"){
								if($(".closebox1 .two2>span").hasClass("tj")){
									if($(".zhixin").is(":visible")){
										nextAssigneeIds=$(".zhixin .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}else if($(".slectMan").is(":visible")){
										if($(".slectMan span").hasClass("tj")){
											nextAssigneeIds=$(".slectMan .tj").attr("data-last-value");
											//alert(nextAssigneeIds)
										}
										
									}else{
										nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
										//alert(nextAssigneeIds)
									}
								}
							}
							
							if(grade=="二类"){
								if($(".closebox2 .two2>span").hasClass("tj")){
									if($(".zhixin2").is(":visible")){
										nextAssigneeIds=$(".zhixin2 .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}else if($(".box23").is(":visible")){
										if($(".box23 span").hasClass("tj")){
											nextAssigneeIds=$(".box23 .tj").attr("data-last-value");
											//alert(nextAssigneeIds)
										}else{
											nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
											//alert(nextAssigneeIds)
										}
										
									}else{
										nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
										//alert(nextAssigneeIds)
									}
								}
							}
							if(grade=="三类"){
								nextAssigneeIds=$(".closebox3 .tj").attr("data-last-value");
							}
							$(".quedin").click(function(){
//								if($('.members').find('Active')){
//									var Name=$('.members').find('.Active').data('lastValue');
//								}else if($('.person').find('Active')){
//									var Name=$('.person').find('.Active').data('lastValue');
//								}
//								var Name=$('.closebox3 .box4').find('span').text();
								//console.log(Name);
								var opinion=$(".txtbox").val();
								console.log(opinion);
								var params;
								if(opinion.length!=0){
									params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,checkMessage:opinion,departmentId:bumenId,mobileSystem:mobileSystem}							
								}else{
									params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,departmentId:bumenId,mobileSystem:mobileSystem}
								}											
								$.ajax({
									type:"post",
									dataType:"json",
									data:params,
									url:'/yiqi/web/supervise/toCheck.do',
									success:function(res){
										console.log(res);
										if(res.success){
											window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
											$(".agree").attr("disabled",true);
											
										}else if(nowTime>endTimes){
											$.malert({  
												  type:'tip',  
												   text: "该督办已经超时"  
											});  														
										}
										else if(nextAssigneeIds==null){
											$.malert({  
												  type:'tip',  
												   text: "请选择下一级审批人"  
											});  														
										}
									},
									error:function(){
										$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
											});  
									}
								})
							})	
						})
					}else if(isPass==0&&nextAssigneeId==userid&&checkTypeName==2){
						$('.process').addClass('active');
						//isPass==0&&checkTypeName==2表示审批不通过后继续进行审批
						var nextAssigneeIdsa;
						$(".btn").hide();
						$(".btnsub").hide();
						$(".qu").hide();
						$(".qxby").hide();
						$('.aplays').hide();
						$(".qx").show();
						$(".bj").hide();
						if(grade=="一类"){
							$(".closebox1 .smallManagerUrl").remove();
							$(".closebox1 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox1 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="二类"){
							$(".closebox2 .smallManagerUrl").remove();
							$(".closebox2 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox2 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="三类"){
							$(".closebox3 .smallManagerUrl").remove();
							$(".closebox3 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox3 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}
						
						//中心领导
						$(".coreManagerIdUrl").remove();
						$(".box22").eq(0).removeClass("box22");
						$(".two2").eq(0).remove();
						$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;
							if(checkUserVos.length==2){
								$(".box12").css("display","block");
								if(grade=="一类"){									
									$(".closebox1 .agrees").eq(arrs.length-1).html(assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(arrs.length-1).html(assigneeName);
									$(".smallManagerName2").html(checkUserVos[1].assigneeName);
								}else if(grade=="三类"){
									$('.box4').show();
									$(".closebox3 .two21").html("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia coreManagerIdUrl'/><span class='tj iblock' id='smallManagerName'>添加</span>");
									$(".closebox3 .smallManagerName").html(checkUserVos[1].assigneeName);
									$(".closebox3 .firstUserName3").html(checkUserVos[0].assigneeName);
								}
							}
							if(checkUserVos.length==3){
								$(".box13").css("display","block");
								
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(arrs.length-1).html(assigneeName);
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
								}
							}
							
						}
						
						/*$(".smallManagerUrl1").remove();
						$(".box12").removeClass("box22");
						$(".two2").remove();
						$(".box12").append("<span class='iblock two agrees smallManagerName'></span>");*/
						
						/*for(var p=0;p<tAppSuperviseChecks.length;p++){
							if(tAppSuperviseChecks[p].title=="审批同意"){
								bohui.push(p);
								$(".agrees").eq(bohui.length-1).html(tAppSuperviseChecks[p].assigneeName);
								//alert(1)
							}							
						}
						if(bohui.length==2&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
							$("#slectMan").css("display","block");
							$(".box12 span").remove();
							$(".box12").append("<span class='iblock two smallManagerName agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");
							$(".coreManagerIdUrl").remove();
							$(".box13").removeClass("box22");
							$(".two2").remove();
							$(".box13").append("<span class='iblock two agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName+"</span>");
							
						}else if(bohui.length==1&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批拒绝"){
							if(grade=="一类"){
								$(".closebox1 .smallManagerUrl").remove();
								$(".closebox1 .box22").eq(0).removeClass("box22").addClass("charu");
								$(".closebox1 .two2").eq(0).remove();
								$(".charu").append("<span class='iblock two smallManagerName agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName+"</span>");	
								$(".smallManagerName").html(tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName);
							}else if(grade=="二类"){
								$(".closebox2 .smallManagerUrl").remove();
								$(".closebox2 .box22").eq(0).removeClass("box22").addClass("charu");
								$(".closebox2 .two2").eq(0).remove();
								$(".charu").append("<span class='iblock two smallManagerName agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName+"</span>");	
							}else if(grade=="三类"){
								$(".closebox3 .smallManagerUrl").remove();
								$(".closebox3 .box22").eq(0).removeClass("box22").addClass("charu");
								$(".closebox3 .two2").eq(0).remove();
								$(".charu").append("<span class='iblock two smallManagerName agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName+"</span>");	
							}
						}else if(bohui.length==2&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="审批驳回"){
								$(".slectMan").css("display","block");		
								$(".box13").append("<span class='iblock two agrees'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-3].assigneeName+"</span>");
						}*/
						//点击编辑审批回到起草页面
						$(".editsp").click(function(){
							window.location.href="/yiqi/web/supervise/compose.do?id="+dubanid;
						})	
						
						//点击驳回审批
						$(".bohui").click(function(){

							var title=$("#agreebox .title").text();	
							//alert(1)
							//var nextAssigneeIds=$(".tj").attr("data-last-value");
							$(".quedin").click(function(){											
								var opinion=$(".txtbox").val();
								console.log(opinion);
								var params;
								if(opinion.length!=0){
									params={isPass:0,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
								}else{
									params={isPass:0,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
								}											
								$.ajax({
									type:"post",
									dataType:"json",
									data:params,
									url:'/yiqi/web/supervise/toCheck.do',
									success:function(res){
										console.log(res)
										if(res.success){
											$(".qxby").show();
											$(".tongyi").hide();
											window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
											$(".agree").attr("disabled",true);
										}
									},
									error:function(){
										$.malert({  
												 type:'tip',  
												  text: "网络超时请求失败"  
										});  
									}
								})
							})																												
						})		
					}else if(isPass==1&&nextAssigneeId==userid&&checkTypeName==2){
						$('.process').addClass('active');
						$(".btn").show();
						$(".btnsub").hide();
						$(".qu").hide();
						$(".qxby").hide();
						$('.aplays').hide();
						$(".qx").hide();
						$(".bj").hide();
						$(".btnbohui").hide();
						$(".smallManagerName").addClass("agrees");
						
						if(grade=="一类"){
							$(".closebox1 .smallManagerUrl").remove();
							$(".closebox1 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox1 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="二类"){
							$(".closebox2 .smallManagerUrl").remove();
							$(".closebox2 .box22").eq(0).removeClass("box22").addClass("charu");
							$(".closebox2 .two2").eq(0).remove();
							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}else if(grade=="三类"){
							$(".closebox3 .smallManagerUrl").remove();
//							$(".closebox3 .box22").eq(0).removeClass("box22").addClass("charu");
//							$(".closebox3 .two2").eq(0).remove();
//							$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
						}
					
						
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;
							if(checkUserVos.length==2){
								$(".box12").css("display","block");
								$(".slectMan").css("display","block");
								$(".slectMan").children().remove();
								$(".slectMan").addClass("box22").removeClass("charu");
								$(".slectMan").html("<p class='one'>中心领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia coreManagerIdUrl'/><span class='tj iblock' id='coreManagerName'>添加</span></p>");	
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box13 span").remove();
										$(".coreManagerIdUrl").remove();
										$(".box22").eq(0).removeClass("box22");
										$(".two2").eq(0).remove();
										$(".slectMan").append("<span class='iblock two agrees coreManagerName'>"+nextAssigneeName+"</span>");
									}
									if(tAppSuperviseChecks[tAppSuperviseChecks.length-3].title=="审批驳回"&&tAppSuperviseChecks[tAppSuperviseChecks.length-4].title=="审批拒绝"){
										$(".slectMan").css("display","none");
									}
									if(tAppSuperviseChecks[1].assigneeName&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName){
										$(".firstUserName").html(checkUserVos[0].assigneeName);
									}
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".closebox2 .smallManagerName").html(checkUserVos[1].assigneeName);
									$(".closebox2 .firstUserName2").html(checkUserVos[0].assigneeName);
								}else if(grade=="三类"){
//									if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=='正在审批'&&checkUserVos[0].assigneeId==userid){
//										$('.closebox3 .box12').hide();
//									}else{
//										$('.closebox3 .box12').show();
//									}
//									$('.box4').show();
//									$(".closebox3 .two21").html("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia coreManagerIdUrl'/><span class='tj iblock' id='smallManagerName'>添加</span>");
//									$(".closebox3 .smallManagerName").html(checkUserVos[1].assigneeName);
//									$(".closebox3 .firstUserName3").html(checkUserVos[0].assigneeName);
								}
							}
							if(checkUserVos.length==1){								
								$(".box12").css("display","block");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box12").children().remove();
									$(".box12").addClass("box22").removeClass("charu");
									$(".box12").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box12 span").remove();
										$(".smallManagerUrl").remove();
										$(".box12").removeClass("box22");
										$(".box12 .two2").eq(0).remove();
										$(".box12").append("<span class='iblock two agrees smallManagerName'>"+nextAssigneeName+"</span>");
										$(".slectMan").css("display","block");
									}
								}else if(grade=="二类"){
									$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".box23").children().remove();
									$(".box23").addClass("box22").removeClass("charu");
									$(".box23").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
									if(checkUserVos[c].assigneeName!=nextAssigneeName){
										$(".box23 span").remove();
										$(".smallManagerUrl").remove();
										$(".box23").removeClass("box22");
										$(".box23 .two2").eq(0).remove();
										$(".box23").append("<span class='iblock two agrees smallManagerName'>"+nextAssigneeName+"</span>");
									}
								}else if(grade=="三类"){
//									$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
//									$(".closebox3 .two21").append("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl smallManagerUrl1'/>");
//									$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
//									$(".firstUserName3").html(checkUserVos[0].assigneeName);
//									$(".zhixin3").css("display","block");
//									$(".zhixin3").children().remove();
//									$(".zhixin3").addClass("box22").removeClass("charu");
//									$(".zhixin3").html("<p class='one'>主办负责人2:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");
//									$(".firstUserName3").html(checkUserVos[0].assigneeName);
								}
							}
							if(checkUserVos.length==3){
								$(".slectMan").css("display","block");
								$(".coreManagerIdUrl").remove();
								$(".box22").eq(0).removeClass("box22");
								$(".two2").eq(0).remove();
								$(".slectMan").append("<span class='iblock two agrees coreManagerName'></span>");
								$(".zhixin").html("<p class='one'>督办执行人:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia superviseImplementIdUrl'/><span class='tj iblock' id='superviseImplementName'>添加</span></p>");
								if(grade=="一类"){
									$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
									$(".smallManagerName").html(checkUserVos[1].assigneeName);
									$(".firstUserName").html(checkUserVos[0].assigneeName);
								}
							}							
						}
						if(checkUserVos.length==0){
							if(grade=="二类"){
								//alert(1)
								$(".box23").children().remove();
								$(".box23").addClass("box22").removeClass("charu");
								$(".box23").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
							}
//							else if(grade=="三类"){
								//alert(1)
//								$('.box12').show();
//								$('.two21').prepend("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/>");
//								$(".zhixin3").css("display","block");
//								$(".zhixin3").children().remove();
//								$(".zhixin3").addClass("box22").removeClass("charu");
//								$(".zhixin3").html("<p class='one'>主办负责人2:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia superviseImplementIdUrl'/><span class='tj iblock' id='superviseImplementName'>添加</span></p>");	
//								$(".firstUserName3").html(nextAssigneeName)
//							}
						else if(grade=="一类"){
								//alert(1)
								$(".box12").children().remove();
								$(".box12").addClass("box22").removeClass("charu");
								$(".box12").html("<p class='one'>分管领导:</p><p class='two2'><img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='tj iblock' id='smallManagerName'>添加</span></p>");	
								$(".firstUserName").html(nextAssigneeName)
							}
								
						}
						$(".two").removeClass("iblock");
						
					
						//点击同意审批
						var nextAssigneeIds;
						$(".agree").click(function(){
							var title=$("#agreebox .title").text();
							/*var shenpiId;
							if(grade=="二类"){
								shenpiId=$(".closebox2 .tj").data('lastValue');
							}else if(grade=="一类"){
								shenpiId=$(".closebox1 .tj").data('lastValue');
							}else if(grade=="三类"){
								shenpiId=$(".closebox3 .tj").data('lastValue');
							}
							
							alert(shenpiId)*/
							/*if(shenpiId==undefined){
								$("#agreebox").hide();
								$("#mask").hide();
								$.malert({  
									type:'tip',  
									text: "请选择审批人"  
								});
							}else{	*/	
							if(grade=="一类"){								
								if($(".closebox1 .two2>span").hasClass("tj")){									
									if($(".zhixin").is(":visible")){
										nextAssigneeIds=$(".zhixin .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}else if($(".box13").is(":visible")){	
										//alert(1)
										if($(".box13 span").hasClass("tj")){
											nextAssigneeIds=$(".box13 .tj").attr("data-last-value");
											//alert(nextAssigneeIds)											
										}else{													
											/*if(tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"&&tAppSuperviseChecks[tAppSuperviseChecks.length-4].title=="审批拒绝"){
												nextAssigneeIds=tAppSuperviseChecks[tAppSuperviseChecks.length-4].assigneeId;
												///alert(nextAssigneeIds)
											}
											else */if(tAppSuperviseChecks[0].assigneeName==tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName){
												nextAssigneeIds=checkUserVos[1].assigneeId;
												//alert(nextAssigneeIds)
											}else if(tAppSuperviseChecks[1].assigneeName==tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName){
												nextAssigneeIds=checkUserVos[2].assigneeId;
												//alert(nextAssigneeIds)
											}else{
												nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
												//alert(nextAssigneeIds)
											}
											
											/*if(Arrs.length==2&&tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"&&tAppSuperviseChecks[tAppSuperviseChecks.length-4].title=="审批拒绝"){												
												if(tAppSuperviseChecks[2].title=="审批拒绝"){
													nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
													//alert(nextAssigneeIds)
												}else{
													nextAssigneeIds=tAppSuperviseChecks[tAppSuperviseChecks.length-4].assigneeId;
													//alert(nextAssigneeIds)
												}
											}else if(Arrs.length==2&&tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"&&tAppSuperviseChecks.length>=5&&tAppSuperviseChecks[tAppSuperviseChecks.length-5].title=="审批拒绝"){
												nextAssigneeIds=tAppSuperviseChecks[tAppSuperviseChecks.length-6].assigneeId;
												//alert(nextAssigneeIds)
											}else if(Arrs.length==3&&tAppSuperviseChecks[tAppSuperviseChecks.length-1].title=="正在审批"&&tAppSuperviseChecks.length>=6&&tAppSuperviseChecks[tAppSuperviseChecks.length-6].title=="审批拒绝"){
												nextAssigneeIds=tAppSuperviseChecks[tAppSuperviseChecks.length-6].assigneeId;
												//alert(nextAssigneeIds)
											}
											else{
												nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
												//alert(nextAssigneeIds)		
											}*/
																														
										}										
									}else if($(".box12 .two2>span").hasClass("tj")){
										nextAssigneeIds=$(".box12 .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}
									/*else if(tAppSuperviseChecks.length>=6&&tAppSuperviseChecks[1].pass==true&&tAppSuperviseChecks[tAppSuperviseChecks.length-3].pass==false&&tAppSuperviseChecks[tAppSuperviseChecks.length-2].pass==true){
										nextAssigneeIds=tAppSuperviseChecks[1].nextAssigneeId;
										//alert(nextAssigneeIds)
									}*/
									else if(tAppSuperviseChecks[tAppSuperviseChecks.length-3].pass==false&&tAppSuperviseChecks[tAppSuperviseChecks.length-4].pass==false){
										nextAssigneeIds=tAppSuperviseChecks[tAppSuperviseChecks.length-4].assigneeId;
										//alert(nextAssigneeIds)
									}else{
										nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
										//alert(nextAssigneeIds)
									}
								}
							}							
							if(grade=="二类"){
								if($(".closebox2 .two2>span").hasClass("tj")){
									if($(".zhixin2").is(":visible")){
										nextAssigneeIds=$(".zhixin2 .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}else if($(".box23").is(":visible")){
										if($(".box23 span").hasClass("tj")){
											nextAssigneeIds=$(".box23 .tj").attr("data-last-value");
											//alert(nextAssigneeIds)
										}else{
											if(tAppSuperviseChecks[1].assigneeName==tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName){
												nextAssigneeIds=checkUserVos[1].assigneeId;
												//alert(nextAssigneeIds)
											}else{
												nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
												//alert(nextAssigneeIds)
											}											
										}										
									}else{
										nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
									}
								}
							}
							if(grade=="三类"){
								if($(".closebox3 .two2>span").hasClass("tj")){
									if($(".zhixin3").is(":visible")){
										nextAssigneeIds=$(".zhixin3 .tj").attr("data-last-value");
										//alert(nextAssigneeIds)
									}else{
										nextAssigneeIds=tAppSuperviseChecks[0].nextAssigneeId;
										//alert(nextAssigneeIds)
									}
								}
							}
							
							$(".quedin").click(function(){
								console.log(MembersId);
								var opinion=$(".txtbox").val();
//								MembersId=$(".Active").data('lastValue');
								var Name=$('.closebox3 .tj').data('lastValue');
								console.log(Name);
								console.log(opinion);
								var params;
								if(opinion.length!=0){
									params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}							
									if(grade=="三类"){
										if($(".closebox3 .two2>span").hasClass("tj")){
											if($(".zhixin3").is(":visible")){
												//alert(bumenId)
												params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,checkMessage:opinion,departmentId:bumenId,mobileSystem:mobileSystem,selectType:selectType}							
											}
										}else{
											params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,checkMessage:opinion,mobileSystem:mobileSystem,selectType:selectType}							
										}
									}
								}else{
									params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,mobileSystem:mobileSystem}
									if(grade=="三类"){
										
								
										if($(".closebox3 .two2>span").hasClass("tj")){
											if($(".zhixin3").is(":visible")){
												//alert(bumenId)
												params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,departmentId:bumenId,mobileSystem:mobileSystem,selectType:selectType}							
											}
										}else{
											params={isPass:1,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,nextAssigneeId:MembersId,title:title,mobileSystem:mobileSystem,selectType:selectType}							
										}
									}
								}
								
									$.ajax({
										type:"post",
										dataType:"json",
										data:params,
										url:'/yiqi/web/supervise/toCheck.do',
										success:function(res){
											console.log(res);
											if(res.success){
												window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
												$(".agree").attr("disabled",true);
												
											}else if(nowTime>endTimes){
												$.malert({  
													  type:'tip',  
													   text: "该督办已经超时"  
												});  														
											}
										},
										error:function(){
											$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
											});  
										}
									})
								
								
							})																												
						})
						//点击拒绝审批
						$(".cancel").click(function(){
							var title=$("#agreebox .title").text();	
							//var nextAssigneeIds=$(".tj").attr("data-last-value");
							$(".quedin").click(function(){											
								var opinion=$(".txtbox").val();
								console.log(opinion);
								var params;
								if(opinion.length!=0){
									params={isPass:0,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,checkMessage:opinion,mobileSystem:mobileSystem}
								}else{
									params={isPass:0,handlUserId:nextAssigneeId,handlUserName:nextAssigneeName,id:shenpiId,superviseId:id,endTime:endTime,grade:grade,initiator:userId,taskId:taskId,title:title,mobileSystem:mobileSystem}
								}											
								$.ajax({
									type:"post",
									dataType:"json",
									data:params,
									url:'/yiqi/web/supervise/toCheck.do',
									success:function(res){
										console.log(res)
										if(res.success){
											$(".qxby").show();
											$(".tongyi").hide();
											window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
											$(".agree").attr("disabled",true);
										}
									},
									error:function(){
										$.malert({  
												  type:'tip',  
												   text: "网络超时请求失败"  
											});  
									}
								})
							})																												
						})																		
								//}																															
						}else{
							$('.process').removeClass('active');
						}
						
						if(nextAssigneeId==userid){
							if(grade=="三类"){
								$('.closebox3 .box2').find('span').removeClass('tj');
								if(roleVos[0]){
									$('.closebox3 .box2').eq(0).find('.one').text(roleVos[0].roleName);
									$('.closebox3 .box2').eq(0).find('span').addClass('iblock');
									$('.closebox3 .box2').eq(0).find('span').text(roleVos[0].roleUserName);
								}
								if(roleVos[1]){
									if(roleVos[1].roleName=='主办处室负责人2:'){
										$('.closebox3 .box2').eq(2).show();
										$('.closebox3 .box2').eq(2).find('p').eq(1).html("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='iblock tj' id='smallManagerName'>添加</span>");
										$('.closebox3 .box2').eq(1).show();
										$('.closebox3 .box2').eq(1).find('.one').text(roleVos[1].roleName);
										$('.closebox3 .box2').eq(1).find('img').remove();
										$('.closebox3 .box2').eq(1).find('span').text(roleVos[1].roleUserName);
									}
									
								}else{
									$('.closebox3 .box2').eq(1).find('span').addClass('tj');
									$('.closebox3 .box2').eq(2).find('span').addClass('tj');
									$('.closebox3 .box2').eq(1).show();
									$('.closebox3 .box2').eq(2).show();
									$('.closebox3 .box2').eq(2).find('p').eq(1).html("<img src='/yiqi/assets/src/css/img/icon_qicao_add@2x.png' class='jia smallManagerUrl'/><span class='iblock tj' id='smallManagerName'>添加</span>");
								}
								if(roleVos[2]){
									$('.closebox3 .box2').eq(2).find('.one').text(roleVos[2].roleName);
									$('.closebox3 .box2').eq(2).find('span').text(roleVos[2].roleUserName);
									$('.closebox3 .box2').eq(2).find('span').addClass('two');
								}else{
//									$('.closebox3 .box2').eq(2).hide();
								}
							}
//							if(grade=="一类"){
//								if(roleVos[2]){
//									$('.closebox1 .box2').eq(3).show();
//									
//								}
//							}
						}
						
					//添加负责人调用负责人接口
	var num;
	var MembersId;
	var bumenId;
	var headUrl;
	var sex;
	var selectType;
	var arrs=[];
	//$(".jia").click(function(){
	$(".box2").on("click",".jia",function(){
		var curThis=$(this);
		if($(this).parent().parent().siblings().find('span').eq(1).text()=="添加"||(roleVos.length==2&&grade=='三类')){
			$("#wrap").hide();
			$("#selectPersonnel").show();
		}
		$(".bumen").show();
		$(".person").hide();
		$(".members").hide();
		//$(".person>li>p").removeClass("active");
		//$(".person>li>p").children().remove();
		$(".person>li>div").removeClass("Active");
		$(".person>li>div").children("span").remove();
		
		$(".members>li>p").removeClass("Active");
		$(".members>li>p").children().remove();
		num=$(".jia").index($(this));
		//alert(num)
		var personValue="";
		$(".add").off('click').on('click',function(){				
			$("#selectPersonnel").hide();
			$(".renyuan").hide();
			$("#wrap").show();
			console.log($(".Active"));
			personValue=$(".Active").text();
			console.log(personValue);
			MembersId=$(".Active").data('lastValue');
			bumenId=$(".Active").data('hidden');
			headUrl=$(".Active").data('head');
			sex=$(".Active").data('sex');
			var dubanCj=$(".cengJ").find("option:selected").text();
			if(grade!='三类'){
				$(".iblock").eq(num).html(personValue);		
			}
			
			curThis.parent().find('span').text(personValue);
			if(curThis.parent().parent().find('.one').text()=="主办负责人2:"){
				selectType=2;
			}else if(curThis.parent().parent().find('.one').text()=="督办执行人:"){
				selectType=3;
			}
			$(".iblock").eq(num).attr("data-last-value",MembersId);	
			$(".iblock").eq(num).attr("data-hidden",bumenId);
			$(".iblock").eq(num).attr("data-head",headUrl);
			$(".iblock").eq(num).attr("data-sex",sex);	
			var cengji=$(".cengji").text();
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
	
				},
				error:function(){
					$.malert({  
							type:'tip',  
							text: "网络超时请求失败"  
						});  
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



