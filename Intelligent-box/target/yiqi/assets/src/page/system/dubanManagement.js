$(function(){
	/*//调用详情借口
function getMsg(num){
	$.ajax({
			type:"post",
			dataType:"json",
			data:{pageSize:'20',pageNum:'1'},
			url: CONTEXT_PATH + '/web/supervise/getAuthority.do',
			success:function(res){
				//console.log(res.model.list);
				var lists=res.model.list;
				console.log(lists);
				var showNum=num;
                var dataL=lists.length;
                var pageNum=Math.ceil(dataL/showNum);
               // alert(pageNum) 1
				if(lists.length==0){
					$("#detail").append("暂无数据");
				}
				
				$('#Pagination').pagination(pageNum,{
					 num_edge_entries: 1, //边缘页数
                     num_display_entries: 4, //主体页数
                     items_per_page: 1, //每页显示1项
                     prev_text: "上一页",
                     next_text: "下一页",
                     callback:function(index){
                     	var statusText='';
						var str="<tr>";
                     	for(var i=showNum*index;i<showNum*index+showNum;i++){
                     		if(i<dataL){           
                     			console.log(i)
                     			console.log(lists[i].name);
								if(lists[i].status==1){statusText="停用"}
								else if(lists[i].status==0){statusText="启用"}
								
								str+="<td>"+(i+1)+"</td>";
								str+="<td>"+lists[i].account+"</td>";
								str+="<td>"+lists[i].name+"</td>";
								str+="<td>"+lists[i].mobile+"</td>";
								str+="<td data-num="+lists[i].id+">"+lists[i].status+"</td>";
								str+="<td><a href='javascript:void(0);' class='zhtai'  data-id="+lists[i].id+" data-status="+lists[i].status+" data-toggle='modal' data-target='#myModal'>"+statusText+"</a><a href='javascript:void(0);' style='margin-left:20px;' class='delete' data-toggle='modal' data-target='#myModal' data-id="+lists[i].id+">删除</a></td>";																
                     		}
						}
						str+="</tr>";
                     	$("#detail").html(str);
					}
             })				
			}
	})
}
 getMsg(20);*/
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
				url: CONTEXT_PATH + '/web/supervise/getAuthority.do',
				success:function(res){
					//console.log(res.model.list);
					var lists=res.model.list;
					console.log(lists);				
					if(lists.length==0){
						$("#detail").append("暂无数据");
					}
					var statusText='';
					var statusMap='';
					var str='';
					str='<tr>';
					for(var i=0;i<lists.length;i++){
							console.log(i)
	                     	console.log(lists[i].name);
							if(lists[i].status==1){statusText="停用";statusMap="启用"}
							else if(lists[i].status==0){statusText="启用";statusMap="停用"}								
							str+="<td>"+(i+1)+"</td>";
							str+="<td>"+lists[i].account+"</td>";
							str+="<td>"+lists[i].name+"</td>";
							str+="<td>"+lists[i].mobile+"</td>";
							str+="<td data-num="+lists[i].id+">"+statusMap+"</td>";
							str+="<td><a href='javascript:void(0);' class='zhtai'  data-id="+lists[i].id+" data-status="+lists[i].status+" data-toggle='modal' data-target='#myModal'>"+statusText+"</a><a href='javascript:void(0);' style='margin-left:20px;' class='delete' data-toggle='modal' data-target='#myModal' data-id="+lists[i].id+">删除</a></td>";	
							 str+="</tr>";
		               }                  
	               	$("#detail").html(str);
					
				}
			})
        }
    }

    $("#page").initPage(71,1,GG.kk);	

	 //点击停用启用
    $("#detail").on("click",".zhtai",function(){
     	 var status = $(this).data('status');
		 var id = $(this).data("id");
		if (status == 0) {
             status = 1;
        } else if (status == 1) {
             status = 0;
        }
	   var confirmText = status == 0 ? '确认停用？' : '确认启用？';
       $(".modal-title").html(confirmText); 
       //停用启用接口	
	  $(".quedin").click(function(){	  	
			$.ajax({
				type:"post",
				data:{status:status,id:id},
				dataType:"json",
				url: CONTEXT_PATH + '/web/supervise/updateAuthority.do',
				success:function(res){
					console.log(res);
					window.location.reload();									
				}
			})		 		
		})
     })
    
    //点击删除
    $("#detail").on("click",".delete",function(){
    	var id = $(this).data("id");
    	$(".modal-title").html("确定删除?");
    	
    	 $(".quedin").click(function(){	  	
			$.ajax({
				type:"post",
				data:{id:id},
				dataType:"json",
				url: CONTEXT_PATH + '/web/supervise/deleteAuthority.do',
				success:function(res){
					console.log(res);
					window.location.reload();
					
				}
			})		 		
		})
    })
    
    //点击搜素查询
    $(".sousuo").click(function(){
    	var Name=$(".inputName").val();
    	var Mobile=$(".inputMobile").val();
    	var params;
    	if(Name!=''){
    		params={pageSize:'20',pageNum:'1',name:Name};
    	}else if(Mobile!=''){
    		params={pageSize:'20',pageNum:'1',mobile:Mobile};
    	}else if(Name!=''&&Mobile!=''){
    		params={pageSize:'20',pageNum:'1',mobile:Mobile,name:Name};
    	}else{
    		params={pageSize:'20',pageNum:'1'};
    	}
    	
    	$.ajax({
			type:"post",
			dataType:"json",
			data:params,
			url: CONTEXT_PATH + '/web/supervise/getAuthority.do',
			beforeSend: function(){
				$("#detail").html("");
			},
			success:function(res){
				//console.log(res.model.list);				
				var listss=res.model.list;
				if(listss.length==0){
					$("#detail").html("暂无数据");
				}
				var statusText='';
				var str='';
				if(res.success){
					for(var n=0;n<listss.length;n++){
						console.log(listss[n].name);					
						if(listss[n].status==1){statusText="停用"}
						else if(listss[n].status==0){statusText="启用"}
						str+="<tr>";
						str+="<td>"+(n+1)+"</td>";
						str+="<td>"+listss[n].account+"</td>";
						str+="<td>"+listss[n].name+"</td>";
						str+="<td>"+listss[n].mobile+"</td>";
						str+="<td data-num="+listss[n].id+">"+listss[n].status+"</td>";
						str+="<td><a href='javascript:void(0);' class='zhtai'  data-id="+listss[n].id+" data-status="+listss[n].status+" data-toggle='modal' data-target='#myModal'>"+statusText+"</a><a href='javascript:void(0);' style='margin-left:20px;' class='delete' data-toggle='modal' data-target='#myModal' data-id="+listss[n].id+">删除</a></td>";
						str+="</tr>";
						$("#detail").append($(str));
					}	
				}else{
					alert("没有匹配的结果")
				}
											
			}
	})
    })
     
     //点击重置按钮
     $(".reset").click(function(){
     	window.location.reload();
     })
     
     //文本框失去焦点后
        $('form :input').blur(function(){
             var $parent = $(this).parent();
             $parent.find(".formtips").remove();
             //验证用户名
             if( $(this).is('#name') ){
                    if( this.value=="" || (/^\s+/g).test(this.value)){
                        var errorMsg = '请输入用户名.';
                        $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
                    }else{
                        var okMsg = '输入正确.';
                        $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
                    }
             }
             //验证手机号码
             if( $(this).is('#mobile') ){
                if( this.value=="" || ( this.value!="" && !(/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i).test(this.value) ) ){
                      var errorMsg = '请输入正确的手机号码.';
                      $parent.append('<span class="formtips onError">'+errorMsg+'</span>');
                }else{
                      var okMsg = '输入正确.';
                      $parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
                }
             }
        }).keyup(function(){
           $(this).triggerHandler("blur");
        }).focus(function(){
             $(this).triggerHandler("blur");
        });//end blur
   
    //点击新建管理员
    $(".save").click(function(){ 
    	$("form :input").trigger('blur');
    	var name=$("#name").val();
    	var mobile=$("#mobile").val();
    	var numError = $('form .onError').length;
         if(numError){
              return false;
         }else{
         	//新增接口
	    	$.ajax({
				type:"post",
				dataType:"json",
				data:{name:name,mobile:mobile},
				url: CONTEXT_PATH + '/web/supervise/addAuthority.do',
				success:function(res){
					console.log(res);
					if(res.success){
						window.location.reload();
					}else{
						alert("没有匹配的人员请重新输入")
					}
					
				}
			})
         }           	
    })

})
