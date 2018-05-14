<%@ page language="java" pageEncoding="utf-8"%>
<%@ include file="../common/head-public.jsp"%>
<%@ include file="../common/ie.jsp"%>
<script type="text/javascript" src="${contextPath}/assets/dep/echarts/echarts.js"></script>  
<!--  <script type="text/javascript" src="${contextPath}/assets/dep/echarts/echarts.simple.min.js"></script>-->  
</head>
<body>
<div id="wrapper">
    <%@ include file="../common/primary-nav.jsp"%>
    <!-- page content -->
    <div id="page-wrapper" class="page-wrapper">
        <%@ include file="../common/header.jsp"%>
   
        <c:set var="screenTitle" value="欢迎" />
        <div class="page-heading">
            <h2>${screenTitle}</h2>
        </div><!-- end screen title -->
        <!-- page main -->
<div id="title" class="left" style="width:500px;height:10px;font-size:16px;">各产品销量排行柱状图 (<a onclick="getOrder(0)" >全部</a>/<a onclick="getOrder(7)" >周</a>/<a onclick="getOrder(30)" >月</a>/<a value="" onclick="getOrder(365)">年</a>)</div>
<div id="title1" class="right" style="width:500px;height:10px;font-size:16px;">各产品类目销量排行柱状图(<a onclick="getOrder1(0)">全部</a>/<a onclick="getOrder1(7)">周</a>/<a onclick="getOrder1(30)">月</a>/<a onclick="getOrder1(365)">年</a>)</div>
<div id="main" class="left" style="width:500px;height:300px;"></div>  

<div id="main1" class="right" style="width:500px;height:300px;"></div>  
<div id="title2" class="title">用户购买行为时间段分析折线图(<a onclick="getOrder2(0)">全部</a>/<a onclick="getOrder2(1)">天</a>/<a onclick="getOrder2(7)">周</a>/<a onclick="getOrder2(30)">月</a>)</div> 

<div id="main2" class="center" style="width:100%;height:300px;"></div> 
    </div><!-- end page content -->
</div>
<script>seajs.use('page/company/echart', function(page){ page.run(); });</script>
<style>
.left {
    float: left;
    height: 50px;
    width: 19%;
}

.right {
    float: right;
    height: 50px;
    width: 79%;
}
a{
cursor: pointer;
}
.title{
 float: left;
width:500px;
height:10px;
font-size:16px;
}
.center {
    margin-top:50px;
    float:left;
    height: 300px;
    width: 80%;
}
</style>

<script type="text/javascript">  
var USER_ID = '${sessionScope.userId}';

function getOrder(value){
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + '/web/boxWeb/orderListTime.do',
        dataType: "json",
        context: this,
        data: {userId:'${sessionScope.userId}',
               time:value,
               type:1
               },          
        success: function(data) {
            //各产品销量
            var markup = [];
            var marknum = [];
            var checknode = data.model;
            for(var i = 0; i < checknode.length; i++){
                markup[i]=checknode[i].productName ;
                marknum[i] = checknode[i].productNumber;
            }
            // 基于准备好的dom，初始化echarts实例  
            var myChart = echarts.init(document.getElementById('main'));  
            // 指定图表的配置项和数据  
            var option = {   
                tooltip: {},   
                xAxis: {  
                    name: '产品', 
                    data: markup,  
                    axisLabel: {  
                           interval:0,  
                           rotate:40  
                        }  ,
                },  
                yAxis: {
                    name: '销量（个）', 
                },  
                series: [{  
       
                    type: 'bar',  
                    data: marknum,
                    itemStyle:{
                        normal:{        
                            label: {
                                show: true,
                                position: 'top',
                            },
                            color:'#28004d'
                        }
                    },
              
                }]  
            };   
           
            // 使用刚指定的配置项和数据显示图表  
            myChart.setOption(option);  
        }
        
    });
    
}

function getOrder1(value){
    $.ajax({
        type: "GET",
        url: CONTEXT_PATH + '/web/boxWeb/orderListTime.do',
        dataType: "json",
        context: this,
        data: {userId:'${sessionScope.userId}',
               time:value,
               type:2
               },          
        success: function(data) {
     //各产品类目销量0.其他1.安全套2.情趣内衣3.跳蛋4.飞机杯5.精油6.湿巾7.喷剂
    var markup = [];
    var marknum = [];
    var checknode = data.model;
    for(var i = 0; i < checknode.length; i++){
        switch(checknode[i].type){
        case 0:
        markup[i] = "其他" 
        break ;
        case 1:
        markup[i] ="安全套"
        break;
        case 2:
        markup[i] = "情趣内衣"  
        break;
        case 3:
        markup[i] = "跳蛋"
        break;
        case 4:
        markup[i] = "飞机杯"
        break;
        case 5:
        markup[i] = "精油"
        break;
        case 6:
        markup[i] = "湿巾"
        break ;
        case 7:
        markup[i] = "喷剂"
        break ;
        default:
        markup[i] = "未知"
        }
        marknum[i] = checknode[i].productNumber;
    }
    var myChart1 = echarts.init(document.getElementById('main1'));  
    // 指定图表的配置项和数据  
    var option = {  
        tooltip: {},   
        xAxis: {  
            name: '产品', 
            data: markup  
        },  
        yAxis: {
            name: '销量（个）', 
        },  
        series: [{  

            type: 'bar',  
            data: marknum,
 
            itemStyle:{
                normal:{
                    label: {
                        show: true,
                        position: 'top',
                    },
                    color:'#28004d'
                }
            },
      
        }]  
    };   
   
    // 使用刚指定的配置项和数据显示图表  
    myChart1.setOption(option);  
        }
               
    });
    
}

function getOrder2(value){
     $.ajax({
            type: "GET",
            url: CONTEXT_PATH + '/web/boxWeb/orderListTime.do',
            dataType: "json",
            context: this,
            data: {userId:'${sessionScope.userId}',
                   time:value,
                   type:3
                   },          
            success: function(data) {
    var marknum = [];
    var marname = []
   // document.getElementById('main2').innerHTML = ""
    var myChart2 = echarts.init(document.getElementById('main2'));  
    var checknode = data.model;
    for(var i = 0; i < checknode.length; i++){
        marknum[i] = checknode[i].name;
        marname[i] = checknode[i];
    } 
    var option = {  
            legend: {  
                data:marknum,
            },  
            grid: {  
                left: '3%',  
                right: '4%',  
                bottom: '3%',  
                containLabel: false  
            },  
            toolbox: {  
                feature: {  
                    saveAsImage: {}  
                }  
            },  
            xAxis: {  
                name: '产品',
                type: 'category',  
                boundaryGap: false,  
                data: [1,3,5,7,9,11,13,15,17,19,21,23]  
            },  
            yAxis: {  
                name: '销量（个）',
                type: 'value'  
            },  
            series: marname
        };  
    myChart2.setOption(option,true);
}

});
    
}
</script>
</body>
</html>