package cmcc.mobile.yiqi.api.controller;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;

import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.THeartbeat;
import cmcc.mobile.yiqi.utils.CheckResult;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.utils.XMLUtil;
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
	 * 根据版本号获取升级包
	 */
	@SuppressWarnings("static-access")
	@ResponseBody
	@RequestMapping("/updateCheck")
	public CheckResult getBuind(@RequestBody String body){
		JSONObject jsonObject = new JSONObject() ;
		String version = jsonObject.parseObject(body).getString("version") ;
		String devno = jsonObject.parseObject(body).getString("devno") ;
		if(version==null){
			return new CheckResult(1,"参数缺失",null,null,0) ;
		}
		return intelligentBoxService.getBuind(version,devno) ;
	}
	/**
	 * 获取产品列表
	 */
	@ResponseBody
	@RequestMapping("/getProductList")
	public JsonResult getProductList(String code,String type){
		if(code==null){
			return new JsonResult(false,"参数缺失",null) ;
		}
		return intelligentBoxService.getProductList(code,type) ;
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
		//HttpSession session = request.getSession();
		if(code==null){
			return new JsonResult(false,"参数缺失",null) ;
		}
//		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
//		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
//		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.upShelves(code,number,productId,0,0) ;
	//	}
		// return new JsonResult(false,"请先登录",null) ;
	}
	/**
	 * 单个上架
	 */
	@ResponseBody
	@RequestMapping("/upBox")
	public JsonResult upBox(Long productId,Integer number,HttpServletRequest request){
		//HttpSession session = request.getSession();
		if(productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
//		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
//		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
//		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.upBox(productId,number,0,0) ;
//		}
//		 return new JsonResult(false,"请先登录",null) ;
		
			
		
	}

	/**
	 * 下架
	 */
	@ResponseBody
	@RequestMapping("/downShelves")
	public JsonResult downShelves(Long productId,HttpServletRequest request){
		//HttpSession session = request.getSession();
		if(productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
//		if(session.getAttribute("userId")!=null&&session.getAttribute("companyId")!=null){
//		long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
//		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		return intelligentBoxService.downShelves(productId,0,0) ;
//		}
//		return new JsonResult(false,"请先登录",null) ;
	}
	/**
	 * 开门
	 */
	@ResponseBody
	@RequestMapping("/openDoor")
	public JsonResult openDoor(String code ,Long productId,HttpServletRequest request){
		if(code==null && productId==null){
			 return new JsonResult(false,"参数缺失",null) ;
		}
		THeartbeat tHeartbeat = intelligentBoxService.selectTHeartbeat(productId);
		if(tHeartbeat==null||System.currentTimeMillis()-tHeartbeat.getUpdateTime()>40000){
			return new JsonResult(false,"设备未上线，请尝试重新上电",null) ;
		}
		return intelligentBoxService.openDoor(code,productId,null) ;

		
	}
	/**
	 * 支付接口
	 */
	@ResponseBody
	@RequestMapping("/shopping")
	public JsonResult consume(HttpServletRequest request,Long productId){
		//mweb_url为拉起微信支付收银台的中间页面，可通过访问该url来拉起微信客户端，完成支付,mweb_url的有效期为5分钟。 
		//支付之前去查询打开货柜的锁扣状态
		THeartbeat tHeartbeat = intelligentBoxService.selectTHeartbeat(productId);
		if(tHeartbeat==null||System.currentTimeMillis()-tHeartbeat.getUpdateTime()>40000){
			return new JsonResult(false,"设备未上线，请尝试重新上电",null) ;
		}
		//查询产品状态
		String mweb_url =  intelligentBoxService.weixinPayMobile(productId) ;
		if(mweb_url.equals("缺货")){
			return new JsonResult(false,"暂时缺货",null);
		}
		if(StringUtils.isNotBlank(mweb_url)){
			
			return new JsonResult(true,"预下单成功！",mweb_url) ;
		}else{
			//自定义错误页面
			return new JsonResult(false,"预下单失败！",null) ;
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
		System.out.println("回调成功！");
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
	            	final Map map = XMLUtil.doXMLParse(result);
	                //将XML格式转化成MAP格式数据
	                //后续具体自己实现
	            	Thread thread = new Thread(new Runnable() {
	        	        public void run() {
	        	        	intelligentBoxService.notify(map);
	        	        }
	        	    });
	            	thread.start();
	       
		            //通知微信支付系统接收到信息
	    	        return "<xml><return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]></return_msg></xml>";
	            }

	        } catch (Exception e) {
	            System.out.println(e.getMessage());
	        }
	        //如果失败返回错误，微信会再次发送支付信息
	        return "fail";
	}
	
	
	/**
	 * 支付接口
	 * @throws IOException 
	 */
	@ResponseBody
	@RequestMapping("/getUrl")
	public void  getUrl(HttpServletRequest request,HttpServletResponse response,Long productId) throws IOException{
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
	       String code = request.getParameter("code") ;
		String url =  intelligentBoxService.weixinPayH5(productId,ip,code);
		if(url!=null){
			response.sendRedirect(url) ;
		}else{
			response.sendRedirect("www.baidu.com");;
		}
		
	}
	
	/**
	 * 生成设备序列号
	 */
	@ResponseBody
	@RequestMapping("/getMachineId")
	public JsonResult getMachineId(HttpServletRequest request){
		return new JsonResult(true,"生成成功！",RandomUtil.createID()) ;
	}
}

