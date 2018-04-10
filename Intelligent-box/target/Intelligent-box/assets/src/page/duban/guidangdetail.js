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
	var mobile=getCookie('mobile');
	var cid=getCookie('cid');
	var mobileSystem=getCookie('mobileSystem');
	//点击返回按钮返回督办首页
	$(".fanhui").click(function(){
		//window.location.href="/yiqi/web/supervise/dubanIndex.do";
		window.location.href='/yiqi/web/supervise/dubanIndex.do?mobile='+mobile+'&&cid='+cid+'&userId='+userid+'&mobileSystem='+mobileSystem;
	})
	/*var Name=encodeURI(encodeURI(username));
	var names=decodeURI(Name)
	alert(names)*/
	
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
	
	//归档事项
	var guidang=[];
	$.ajax({
		type:"get",
		url:'/yiqi/web/supervise/getDetail.do?superviseId='+id+'&userId='+userid,
		dataType:"json",
		success:function(res){
			console.log(res)
			var lists=res.model;						
			var dubanName=lists.superviseName;			
			var qicaoTime=new Date(lists.createTime);
			var qicaoTimes=qicaoTime.format('yyyy-MM-dd');
			var jieziTime=new Date(lists.endTime);				
			var jieziTimes=jieziTime.format('yyyy-MM-dd');
			var guidTime=new Date(lists.guidangTime);
			var guidTimes=guidTime.format('yyyy-MM-dd');
			var dubanleix=lists.typeName;
			var dubanid=lists.id;
			var grade=lists.grade;
			var dbshix=lists.superviseContent;
			var firstUserName=lists.firstUserName;
			var coreManagerName=lists.coreManagerName;
			var superviseImplementName=lists.superviseImplementName;
			var smallManagerName=lists.smallManagerName;
			var handleManagerName=lists.handleManagerName;
			var administrator=lists.administrator;
			var roleVos=lists.roleVos;
			
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
						$("#mask").hide();
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
			$(".duban").html(dubanName);
			$(".leix").html(dubanleix);
			$(".cengji").html(grade);
			$(".dubanmiaoshu").html(dbshix);
			$("#J-xl-1").html(qicaoTimes);
			$("#J-xl-2").html(jieziTimes);
			$("#J-xl-3").html(guidTimes);
			if(grade=="一类"){					
					$(".closebox2").hide();
					$(".closebox3").hide();
					$(".superviseImplementName").html(superviseImplementName);
			}else if(grade=="二类"){
					$(".closebox2").show();
					$(".closebox1").hide();
					$(".closebox3").hide();		
					$(".superviseImplementName2").html(superviseImplementName);
			}else if(grade=="三类"){
					$(".closebox3").show();
					$(".closebox1").hide();
					$(".closebox2").hide();	
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
					}else{
						$('.closebox3 .box2').eq(2).hide();
					}
			}
			
			//里程碑
			var milestones=lists.milestones;
			console.log(milestones.length)
			for(var j=0;j<milestones.length;j++){								
				if(milestones.length>0){
					$(".closelcb").show();
					var lcbmiaoshu= milestones[j].message;
					//$(".lcbmiaoshu").html(lcbmiaoshu);
					var lcbTime=new Date(milestones[j].endTime);
					var lcbTimes=lcbTime.format('yyyy-MM-dd');
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
					var picUrl=tAppSuperviseChecks[n].url;
					var departmentName=tAppSuperviseChecks[n].departmentName;
					//console.log(title);									
					var checkMessage=tAppSuperviseChecks[n].checkMessage;
					var roleName=tAppSuperviseChecks[n].roleName;	
					//console.log(checkMessage);//null
					//console.log(picUrl);//null
					if(checkMessage==null&&picUrl==null){
						if(title=="自动归档"){
							$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%;'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/xt.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p><div style='clear:both;'></div></div></div>");
						}else{
							$(".process").append("<div class='shenpi-1'><div style='position: absolute;left:-20px;height:100%'><img src='/yiqi/assets/src/css/img/btn_dubanshengpi.png' class='timeZhou'><span class='line'></span></div><div style='overflow: hidden;'><div class='l'><p class='l' style='width:33%'><img src='/yiqi/assets/src/css/img/defaultavatar_1_94_94@3x.png' class='toux'></p><p class='r'style='margin-right:3px;width:65%'><span class='Name' style='color:#333333'>"+assigneeName+"</span><br><span>"+departmentName+"</span><br><span>"+roleName+"</span></p></div><p class='sp r'><span style='float:right' class='Time'>"+createTimes+"</span><br><span style='float:right' class='titles'>"+title+"</span></p></div><p class='spyj' style='color:#bdbdbd;padding-top:0.1rem;background:#FFFFFF;width:90%;margin:0 auto;margin-top:15px;border-top:1px solid #e0e0e0;'>无审批意见</p></div>");
						}								
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
					if(tAppSuperviseChecks[n].title=="审批同意"){
						//console.log(n);
						$(".titles").eq(n).css("color","#7fba83");
					}else if(tAppSuperviseChecks[n].title=="审批拒绝"){
						$(".titles").eq(n).css("color","#e58998");
					}else if(tAppSuperviseChecks[n].title=="验收通过"){
						$(".titles").eq(n).css("color","#7fba83");
					}else if(tAppSuperviseChecks[n].title=="验收拒绝"){
						$(".titles").eq(n).css("color","#e58998");
					}									
				}
							
				$(".two").addClass("agrees");
				var checkUserVos=lists.checkUserVos;
					
				console.log(checkUserVos.length);
				
				for(var c=0;c<=checkUserVos.length;c++){
					if(checkUserVos[c]){
						var assigneeName=checkUserVos[c].assigneeName;	
					}
										
					if(checkUserVos.length==4){
						$(".slectMan").css("display","block");								
						$(".two").removeClass("iblock");
						if(grade=="一类"){
							$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
							$(".firstUserName").html(checkUserVos[0].assigneeName);
							$(".smallManagerName").html(checkUserVos[1].assigneeName);
							$(".coreManagerName").html(checkUserVos[2].assigneeName);
						}
					}
					if(checkUserVos.length==0){													
//						if(grade=="三类"){
////							$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
////							$(".firstUserName3").html(checkUserVos[0].assigneeName)
////							//$(".smallManagerName2").html(checkUserVos[1].assigneeName);
////							//$(".coreManagerName").html(checkUserVos[2].assigneeName);	
//							$('.closebox3').show();
//							$('.closebox2').hide();
//							$('.closebox1').hide();
//							$('.closebox3 .box2').hide();
//							
//						}
					}
					if(checkUserVos.length==3){
						$(".slectMan").css("display","block");								
						$(".two").removeClass("iblock");
						if(grade=="二类"){
							$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
							$(".firstUserName2").html(checkUserVos[0].assigneeName)
							$(".smallManagerName2").html(checkUserVos[1].assigneeName);
							//$(".coreManagerName").html(checkUserVos[2].assigneeName);
											
						}else if(grade=="一类"){
							$(".closebox1 .agrees").eq(checkUserVos.length-1).html(assigneeName);
							$(".firstUserName").html(checkUserVos[0].assigneeName)
							$(".smallManagerName").html(checkUserVos[1].assigneeName);
							//$(".coreManagerName").html(checkUserVos[2].assigneeName);
											
						}else if(grade=="三类"){
//							$('.closebox3').show();
//							$('.closebox2').hide();
//							$('.closebox1').hide();
//							$('.closebox3 .box2').show();
//							$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName);
//							$('.closebox3 .box2').eq(1).find('span').text(checkUserVos[1].assigneeName);
//							$('.closebox3 .box2').eq(2).find('span').text(checkUserVos[2].assigneeName);
											
						}
					}
					if(checkUserVos.length==2){													
						if(grade=="三类"){
//							$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
//							$(".firstUserName3").html(checkUserVos[0].assigneeName)
//							//$(".smallManagerName2").html(checkUserVos[1].assigneeName);
//							//$(".coreManagerName").html(checkUserVos[2].assigneeName);	
//							$('.closebox3').show();
//							$('.closebox2').hide();
//							$('.closebox1').hide();
//							$('.closebox3 .box2').show();
//							$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName);
//							$('.closebox3 .box2').eq(1).find('span').text(checkUserVos[1].assigneeName);
//							$('.closebox3 .box2').eq(2).hide();
//							
						}else if(grade=="二类"){
							$(".closebox2 .agrees").eq(checkUserVos.length-1).html(assigneeName);
							$(".firstUserName2").html(checkUserVos[0].assigneeName)
							//$(".smallManagerName2").html(checkUserVos[1].assigneeName);
							//$(".coreManagerName").html(checkUserVos[2].assigneeName);											
						}
					}
					if(checkUserVos.length==1){													
						if(grade=="三类"){
//							$(".closebox3 .agrees").eq(checkUserVos.length-1).html(assigneeName);
//							$(".firstUserName3").html(checkUserVos[0].assigneeName)
//							//$(".smallManagerName2").html(checkUserVos[1].assigneeName);
//							//$(".coreManagerName").html(checkUserVos[2].assigneeName);	
//							$('.closebox3').show();
//							$('.closebox2').hide();
//							$('.closebox1').hide();
//							$('.closebox3 .box2').show();
//							$('.closebox3 .box2').eq(0).find('span').text(checkUserVos[0].assigneeName);
//							$('.closebox3 .box2').eq(1).hide();
//							$('.closebox3 .box2').eq(2).hide();
							
						}
					}
					
					
				
					
		}
		}
	});		
})
