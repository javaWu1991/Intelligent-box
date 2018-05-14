package cmcc.mobile.yiqi.api.controller;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.XMLUtil;
import cmcc.mobile.yiqi.vo.Product;
import cmcc.mobile.yiqi.web.service.IWeixinPayService;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;

@Controller
@RequestMapping("/H5")
public class IntelligentBoxController extends ApiController{

	@Autowired
	private IntelligentBoxService intelligentBoxService ;
	/**
	 * 获取banner图
	 */
	@ResponseBody
	@RequestMapping("/getImages")
	public JsonResult getImages(){
		return intelligentBoxService.getImages() ;
	}
	

	/**
	 * 获取产品列表
	 */
	@ResponseBody
	@RequestMapping("/getProductList")
	public JsonResult getProductList(String code){
		if(code==null){
			return new JsonResult(false,"参数缺失",null) ;
		}
		return intelligentBoxService.getProductList(code) ;
	}
	/**
	 * 产品详情
	 */
	@ResponseBody
	@RequestMapping("/getProductDetail")
	public JsonResult getProductDetail(Long productId) {
		if(productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
		return intelligentBoxService.getProductDetail(productId) ;
	}
	/**
	 * 一键上架
	 * 下架的变成上架
	 * 缺货的按照补货的数量进行上架
	 */
	@ResponseBody
	@RequestMapping("/upShelves")
	public JsonResult upShelves(String code,Integer number,Long productId,HttpServletRequest request){
		HttpSession session = request.getSession();
		if(code==null){
			return new JsonResult(false,"参数缺失",null) ;
		}
		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.upShelves(code,number,productId,userId,corpId) ;
		}
		 return new JsonResult(false,"请先登录",null) ;
	}
	/**
	 * 单个上架
	 */
	@ResponseBody
	@RequestMapping("/upBox")
	public JsonResult upBox(Long productId,Integer number,HttpServletRequest request){
		HttpSession session = request.getSession();
		if(productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.upBox(productId,number,userId,corpId) ;
		}
		 return new JsonResult(false,"请先登录",null) ;
		
			
		
	}

	/**
	 * 下架
	 */
	@ResponseBody
	@RequestMapping("/downShelves")
	public JsonResult downShelves(Long productId,HttpServletRequest request){
		HttpSession session = request.getSession();
		if(productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.downShelves(productId,userId,corpId) ;
		}
		return new JsonResult(false,"请先登录",null) ;
	}
	/**
	 * 开门
	 */
	@ResponseBody
	@RequestMapping("/openDoor")
	public JsonResult openDoor(String code ,String containerNumber,HttpServletRequest request){
		HttpSession session = request.getSession();
		if(code==null && containerNumber==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		return intelligentBoxService.openDoor(code,containerNumber,userId) ;
		}
		return new JsonResult(false,"请先登录",null) ;
		
	}
	/**
	 * 支付接口
	 */
	@ResponseBody
	@RequestMapping("/shopping")
	public JsonResult consume(HttpServletRequest request,double money,Long productId){
		//mweb_url为拉起微信支付收银台的中间页面，可通过访问该url来拉起微信客户端，完成支付,mweb_url的有效期为5分钟。
		 String ip = request.getHeader("x-forwarded-for");  
	       if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	           ip = request.getHeader("Proxy-Client-IP");  
	       }  
	       if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	           ip = request.getHeader("WL-Proxy-Client-IP");  
	       }  
	       if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
	           ip = request.getRemoteAddr();  
	       }  
		String mweb_url =  intelligentBoxService.weixinPayH5(money,productId,ip);
		if(StringUtils.isNotBlank(mweb_url)){
			return new JsonResult(true,"预下单成功！",mweb_url) ;
		}else{
			//自定义错误页面
			return new JsonResult(false,"预下单失败！","www.baidu.com") ;
		}
		
	}
	/**
	 * 微信支付成功异步回调地址用于打开柜门
	 * <appid><![CDATA[wx2421b1c4370ec43b]]></appid>
    <attach><![CDATA[支付测试]]></attach>
  	<bank_type><![CDATA[CFT]]></bank_type>
  	<fee_type><![CDATA[CNY]]></fee_type>
  	<is_subscribe><![CDATA[Y]]></is_subscribe>
  	<mch_id><![CDATA[10000100]]></mch_id>
  	<nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
  	<openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>
  	<out_trade_no><![CDATA[1409811653]]></out_trade_no>
  	<result_code><![CDATA[SUCCESS]]></result_code>
  	<return_code><![CDATA[SUCCESS]]></return_code>
  	<sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
  	<sub_mch_id><![CDATA[10000100]]></sub_mch_id>
  	<time_end><![CDATA[20140903131540]]></time_end>
  	<total_fee>1</total_fee>
  	<trade_type><![CDATA[JSAPI]]></trade_type>
  	<transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
	 */
	@ResponseBody
	@RequestMapping("notify")
	public String notify(HttpServletRequest request){
		  try {
	            InputStream inStream = request.getInputStream();
	            int _buffer_size = 1024;
	            if (inStream != null) {
	                ByteArrayOutputStream outStream = new ByteArrayOutputStream();
	                byte[] tempBytes = new byte[_buffer_size];
	                int count = -1;
	                while ((count = inStream.read(tempBytes, 0, _buffer_size)) != -1) {
	                    outStream.write(tempBytes, 0, count);
	                }
	                tempBytes = null;
	                outStream.flush();
	                //将流转换成字符串
	                String result = new String(outStream.toByteArray(), "UTF-8");
	                //将字符串解析成XML
	            	Map map = XMLUtil.doXMLParse(result);
	                //将XML格式转化成MAP格式数据
	                //后续具体自己实现
	            	intelligentBoxService.notify(map);
		            //通知微信支付系统接收到信息
	    	        return "<xml><return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]></return_msg></xml>";
	            }

	        } catch (Exception e) {
	            System.out.println(e.getMessage());
	        }
	        //如果失败返回错误，微信会再次发送支付信息
	        return "fail";
	}
	
	
}

