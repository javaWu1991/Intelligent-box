//监听屏幕变化----
$(function(){
				function setFontSize(){
						  // 设计稿 750px
					var width = document.documentElement.clientWidth;
					var fontSize = (width / 750) * 100*2;
						document.getElementsByTagName("html")[0].style.fontSize = fontSize + "px";
					
					}
					             
					$(window).on("resize",setFontSize);//监听屏幕变化，变化时触发。
					setFontSize();
})