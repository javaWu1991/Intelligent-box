$(function() {
	$(".zbox").hide();
		$(".dbox").hide();
		$(".curbox").hide();
	//督办事项切换
	var $div_li = $("div.tab_menu ul li");
	$div_li.click(function() {
		$(this).addClass("selected")
			.siblings().removeClass("selected");				
		var index = $div_li.index(this);
		$("div.tab_box > div").eq(index).show()
			.siblings().hide();
			
	}).hover(function() {
		$(this).addClass("hover");
	}, function() {
		$(this).removeClass("hover");
	})

	//点击加号进入起草督办页面-----
	$(".jia").click(function() {
			window.location.href = "/yiqi/web/supervise/compose.do";
		})
		//点击搜索跳转到搜索页面
	$(".sousuo").click(function() {
		window.location.href = "/yiqi/web/supervise/dubansearch.do";
	})
	
	//我的待办点击返回到首页
	$(".dd").click(function(){
		$("#dBan").hide();
		//$("#zBan").hide();
		//$("#Index").show();
		$(".huanying").show();
		$("#wrapper").css("top","108px");
		$(".header-bar").show();
		$(".header-1").hide();
		$(".tab_box").show();
		$(".tab_menu").show();
		$(".zbox").hide();
		$(".dbox").hide();
	})
	$(".zz").click(function(){
		$("#zBan").hide();
		//$("#zBan").hide();
		//$("#Index").show();
		$(".huanying").show();
		$("#wrapper").css("top","108px");
		$(".header-bar").show();
		$(".header-1").hide();
		$(".tab_box").show();
		$(".tab_menu").show();	
		$(".zbox").hide();
		$(".dbox").hide();
	})

})