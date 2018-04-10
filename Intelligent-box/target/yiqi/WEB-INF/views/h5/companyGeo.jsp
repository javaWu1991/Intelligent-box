<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>企业位置</title>
<meta name="keywords" content="">
<meta name="description" content="">
<meta name="author" content="hy">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
<style>
html, body { padding: 0; margin: 0; }
html, body, #map { height: 100%; }
#company-info { display: none; }
.company-info { font-size: 14px; line-height: 1.5; color: #333; }
</style>
</head>
<body>
<div id="map"></div>
<div id="company-info">
    <div class="company-info">
    地址：<c:out value="${company.adress}"/><br />
    联系人：<c:out value="${company.contacts}"/><br />
    联系方式：<c:out value="${company.contactsMobile}"/>
    </div>
</div>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=BxmYo69b8MhlHdm4IzemPHCrdyluaBHg"></script>
<script type="text/javascript">
function company() {
    // 百度地图API功能
    var autoLocation = false;
    var map = new BMap.Map("map");
    map.enableScrollWheelZoom();
    var lng = '<c:out value="${company.longitude}"/>';
    var lat = '<c:out value="${company.latitude}"/>';
    var company = {
        name: '<c:out value="${company.name}"/>',
        scale: '<c:out value="${company.scale}"/>',
        address: '<c:out value="${company.adress}"/>',
        contacts: '<c:out value="${company.contacts}"/>',
        contactsMobile: '<c:out value="${company.contactsMobile}"/>',
        lng: lng,
        lat: lat
    }

    var point = '杭州';
    if(lng != '' && lat != '') {
        point = new BMap.Point(lng, lat);
    } else {
        autoLocation = true;
    }

    map.addEventListener('load', function() {
        var content = document.getElementById('company-info').innerHTML;
        var infoWindow = new BMap.InfoWindow('公司信息', {
            width: 200,
            height: 100,
            title: '<c:out value="${company.name}"/>'
        });
        map.addOverlay(infoWindow);
        infoWindow.setContent(content);

        if (autoLocation) {
            var city = new BMap.LocalCity();
            city.get(function(result) {
                var point = result.center;
                map.setCenter(result.name);
                map.openInfoWindow(infoWindow, point);
            });
        } else {
            var marker = new BMap.Marker(point); // 创建标注
            map.addOverlay(marker);
            marker.addEventListener('click', function() {
                this.openInfoWindow(infoWindow); //开启信息窗口
            });
        }
    });
    map.centerAndZoom(point, 14);
}

function demo() {
    var point = '杭州';
    var map = new BMap.Map("map");
    map.enableScrollWheelZoom();
    map.centerAndZoom(point, 13);

    var points = [{
        name: '中移杭州研发中心（海创）',
        lng: 120.024629,
        lat: 30.286284
    }, {
        name: '中移杭州研发中心（新座）',
        lng: 120.116722,
        lat: 30.274411
    }];
    map.addEventListener('load', function() {
        var hc = points[0];
        var hcPoint = new BMap.Point(hc.lng, hc.lat);
        var hcMarker = new BMap.Marker(hcPoint);
        map.addOverlay(hcMarker);
        var hcLabel = new BMap.Label(hc.name, {
            offset:new BMap.Size(20,-10)
        });
        hcLabel.addEventListener('click', function() {
            window.location.href = "${pageContext.request.contextPath}/api/company/chart?id=1";
        });
        hcMarker.setLabel(hcLabel);


        var xz = points[1];
        var xzPoint = new BMap.Point(xz.lng, xz.lat);
        var xzMarker = new BMap.Marker(xzPoint);
        map.addOverlay(xzMarker);
        var xzLabel = new BMap.Label(xz.name, {
            offset:new BMap.Size(20,-10)
        });
        xzMarker.setLabel(xzLabel);
        xzLabel.addEventListener('click', function() {
            window.location.href = "${pageContext.request.contextPath}/api/company/chart?id=2";
        });

        map.setViewport([hcPoint, xzPoint]);
    });
}
demo();
</script>
</body>
</html>