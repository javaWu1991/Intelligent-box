$(function(){
	var pmheight=$(window).outerHeight();
	$("#wraper").css({"height":pmheight,"overflow":"scroll","position":"fixed","width":"100%"})
	//点击返回按钮返回督办首页
	$(".fanhui").click(function(){
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
	$(".process").removeClass('active');
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
	
	//调用督办审批接口	
	var Arrs=[];
	var arrs=[];
	var yanshou=[];
	$.ajax({
				type:"get",
				dataType:"json",		
				url:'/yiqi/web/supervise/getDetail.do?superviseId='+id+'&userId='+userid,
				success:function(res){
					console.log(res);
					var lists=res.model;
					var dubanName=lists.superviseName;
					$(".duban").html(dubanName);
					var dubanleix=lists.typeName;
					$(".leix").html(dubanleix);
					var dubancengji=lists.grade;
					$(".cengji").html(dubancengji);
					var dubanshix=lists.superviseContent;
					$(".dubanmiaoshu").html(dubanshix);
				    var jiezTime=new Date(lists.endTime);
					var jiezTimes=jiezTime.format('yyyy-MM-dd');
					$("#J-xl-2").html(jiezTimes);
					var nextAssigneeId=lists.nextAssigneeId;
					var nextAssigneeName=lists.nextAssigneeName;
					var firstUserName=lists.firstUserName;	
					var dubanid=lists.id;
					var assigneeNames=lists.assigneeName;
					var coreManagerName=lists.coreManagerName;	
					var smallManagerName=lists.smallManagerName;
					var superviseImplementName=lists.superviseImplementName;		
					var handleManagerName=lists.handleManagerName;
					var superviseCheckId=lists.superviseCheckId;
					var superviseImplementId=lists.superviseImplementId;
					var userId=lists.userId;
					var grade=lists.grade;
					var taskId=lists.taskId;
					var shenpiId=lists.superviseCheckId;
					var checkTypeName=lists.checkTypeName;
					var isPass=lists.pass;
					var tAppSuperviseChecks=lists.tAppSuperviseChecks;
					var checkUserVos=lists.checkUserVos;
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
						for(var c=0;c<checkUserVos.length;c++){
							var assigneeName=checkUserVos[c].assigneeName;
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
								}else if(grade=="三类"){
									$('.closebox3 .box2').eq(0).show();
									$('.closebox3 .box2').eq(1).hide();
									$('.closebox3 .box2').eq(2).hide();
									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									
								}
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
								}else if(grade=="三类"){
									$('.closebox3 .box2').eq(0).show();
									$('.closebox3 .box2').eq(1).show();
									$('.closebox3 .box2').eq(2).hide();
									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox3 .box2').eq(1).html("<p class='one'>主办负责人2:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>")
								}
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
								if(grade=="三类"){
									$('.closebox3 .box2').show();
									$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName)
									$('.closebox3 .box2').eq(1).html("<p class='one'>主办负责人2:</p><span class='two'>"+checkUserVos[1].assigneeName+"</span>");
									$('.closebox3 .box2').eq(2).html("<p class='one'>督办执行人:</p><span class='two'>"+checkUserVos[2].assigneeName+"</span>");
								}
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
							if(checkUserVos.length==2){
								$(".box12").css("display","block");
								if(grade=="三类"){
//									$(".charu").append("<span class='iblock two smallManagerName agrees'></span>");
									$(".closebox3").show();
									$(".closebox1").hide();
									$(".closebox2").hide();
									$(".zhixin3").css("display","block");
									$(".zhixin3").children().remove();
									$(".zhixin3").addClass("box22").removeClass("charu");
									console.log(tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName);
									$(".closebox3 .box2").eq(0).html("<p class='one'>主办负责人1:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-3].assigneeName+"</span>");
									$(".closebox3 .zhixin3").html("<p class='one'>主办负责人2:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName+"</span>");	
									$(".closebox3 .box12").html("<p class='one'>督办执行人:</p><span class='two firstUserName3'>"+tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName+"</span>");
								}
							}
							
							
						}
					var endTime=lists.endTime;
					var milestones=lists.milestones;
					console.log(milestones.length);
					var ids;
					for(var j=0;j<milestones.length;j++){								
						if(milestones.length>0){
							$(".closelcb").show();
							var lcbmiaoshu= milestones[j].message;
							var status=milestones[j].status;
							//$(".lcbmiaoshu").html(lcbmiaoshu);
							var lcbTime=new Date(milestones[j].endTime);
							var lcbTimes=lcbTime.format('yyyy-MM-dd');
							ids=milestones[j].id;
							//$(".lcbTime").html(lcbTimes);	
							$(".closelcb").append("<p>里程碑"+(j+1)+"<img src='/yiqi/assets/src/css/img/jinxzhong.png' class='jxzpic'></p>");
							$(".closelcb").append("<p class='shix'><span class='dubansx'>里程碑描述:</span><span class='miaoshu lcbmiaoshu'>"+lcbmiaoshu+"</span></p>");
							$(".closelcb").append("<p>截止时间:<span class='lcbTime'>"+lcbTimes+"</span></p>");
							
							$(".detaillcb").append("<p>里程碑"+(j+1)+"</p>");
							$(".detaillcb").append("<p class='shix'><span class='dubansx'>里程碑描述:</span><span class='miaoshu lcbmiaoshu'>"+lcbmiaoshu+"</span></p>");
							$(".detaillcb").append("<p>截止时间:<span class='lcbTime'>"+lcbTimes+"</span></p>");
							if(status==0){
								$(".status").html("进行中");
							}else if(status==1){
								$(".status").html("已完成");
								$(".jxzpic").attr("src","/yiqi/assets/src/css/img/yiwcheng.png");
							}else if(status==2){
								$(".status").html("已超时");
								$(".jxzpic").attr("src","/yiqi/assets/src/css/img/yicshi.png");
							}
						}
					}
					//更改里程碑状态
					$(".biaozhu").click(function(){
						$.ajax({
							type:"get",
							dataType:"json",		
							url:'/yiqi/web/pm/updatePmMilestone.do?id='+ids+'&&status='+1,
							success:function(res){
								console.log(res);
								$(".status").html("已完成");							
							}
						})
					})
					
					
					for(var n=0;n<tAppSuperviseChecks.length;n++){
							var createTime=new Date(tAppSuperviseChecks[n].createTime);
							var createTimes=createTime.format('yyyy-MM-dd hh:mm');																		
							var assigneeName=tAppSuperviseChecks[n].assigneeName;
							var title=tAppSuperviseChecks[n].title;
							var checkMessage=tAppSuperviseChecks[n].checkMessage;
							var picUrl=tAppSuperviseChecks[n].url;
							var departmentName=tAppSuperviseChecks[n].departmentName;
							var roleName=tAppSuperviseChecks[n].roleName;	
							if(grade=="一类"){
								$(".firstUserName").html(tAppSuperviseChecks[0].nextAssigneeName);								
								$(".closebox2").hide();
								$(".closebox3").hide();
							}else if(grade=="二类"){
								$(".closebox2").show();
								$(".closebox1").hide();
								$(".closebox3").hide();
								$(".firstUserName2").html(tAppSuperviseChecks[0].nextAssigneeName);								
							}else if(grade=="三类"){
								$(".closebox3").show();
								$(".closebox1").hide();
								$(".closebox2").hide();
//								$(".firstUserName3").html(tAppSuperviseChecks[0].nextAssigneeName);								
							}
							if(tAppSuperviseChecks[tAppSuperviseChecks.length-2].title=="验收驳回"){
								tAppSuperviseChecks[tAppSuperviseChecks.length-1].title="正在修改";								
							}
							if(checkMessage==null&&picUrl==null){
								$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div style='overflow: hidden;'><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
							}else if(checkMessage==null&&picUrl!=null){
									$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div style='overflow: hidden;'><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
							}else if(checkMessage!=null&&picUrl!=null){
									if(checkMessage==''){
										$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div><p style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
									}else if(checkMessage!=''){
												$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
									}								
							}else if(checkMessage==''&&picUrl==null){
									$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
							}else if(checkMessage==''&&picUrl!=null){
									$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
							}else if(checkMessage!=''&&picUrl==null){
									$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
							}else if(checkMessage!=''&&picUrl!=null){
									$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src="+picUrl+" class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div><p class='spyj' style='color:#333333;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>"+checkMessage+"</p></div>");
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
							
							//判断当前操作人是否为当前用户如果是可以审批不是显示详情firstUserName!="刘鼎（博）"
							//console.log(superviseCheckId);
							
							//if(nextAssigneeId==userid && nextAssigneeId==superviseImplementId){
							if(checkTypeName==3&&nextAssigneeId==userid&&isPass==true){
								//alert(1)
								$(".btn").hide();
								$(".bj").hide();
								$(".qx").hide();
								$(".btnsub").show();
								$(".process").addClass('active');
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
									var title=$(".title").text();										
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
								$(".qx").hide();
								$(".bj").show();																
								$(".process").addClass('active');
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
									var title=$(".title").text();										
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
							}else if(checkTypeName==4&&nextAssigneeId==userid&&isPass==true){
								$(".btn").show();
								$(".btnsub").hide();	
								$(".qx").hide();
								$(".bj").hide();
								$(".process").addClass('active');
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
								$(".agree").click(function(){										
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
										var title=$(".title").text();										
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
								$(".btn").hide();
								$(".btnsub").hide();
								$(".bj").hide();
								$(".qx").show();
								$(".process").addClass('active');
								
								
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
									var title=$(".title").text();										
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
								$(".btn").hide();
								$(".btnsub").hide();
								$(".bj").hide();
								$(".qx").hide();
								$(".process").removeClass('active');
								var checkUserVos=lists.checkUserVos;
								$(".two").addClass("agrees");
								for(var c=0;c<checkUserVos.length;c++){
									var assigneeName=checkUserVos[c].assigneeName;		
									if(checkUserVos.length==1){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
//										if(grade=="三类"){
//											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
//											$(".smallManagerName3").html(checkUserVos[0].assigneeName);
//											$(".superviseImplementName3").html(nextAssigneeName);
//										}
									}
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
										if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											$(".superviseImplementName2").html(nextAssigneeName);
										}
//										else if(grade=="三类"){
//											$(".closebox3 .agrees").eq(checkUserVos.length-2).html(tAppSuperviseChecks[tAppSuperviseChecks.length-3].assigneeName);
//											$(".closebox3 .agrees").eq(checkUserVos.length-1).html(tAppSuperviseChecks[tAppSuperviseChecks.length-2].assigneeName);
//											$(".closebox3 .agrees").eq(checkUserVos.length).html(tAppSuperviseChecks[tAppSuperviseChecks.length-1].assigneeName);
//											
//										}
									}
									if(checkUserVos.length==3){
										$(".slectMan").css("display","block");								
										$(".two").removeClass("iblock");
										if(grade=="二类"){
											$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName2").html(checkUserVos[1].assigneeName);
											//$(".coreManagerName").html(checkUserVos[2].assigneeName);
											
										}else if(grade=="一类"){
											$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
											$(".smallManagerName").html(checkUserVos[1].assigneeName);
											$(".superviseImplementName").html(nextAssigneeName);											
										}
									}
									
								}
							
								
							}
							console.log(roleVos);
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
										$('.closebox3 .box2').eq(2).find('span').parent().find('img').remove();
										
										
									}else{
										$('.closebox3 .box2').eq(2).hide();
									}
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
