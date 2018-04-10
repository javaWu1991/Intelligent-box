package cmcc.mobile.yiqi.api.controller;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import cmcc.mobile.yiqi.utils.JsonResult;
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
	public String consume(HttpServletRequest request,double money,Long productId){
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
			return "redirect:"+mweb_url;
		}else{
			return "redirect:https://blog.52itstyle.com";//自定义错误页面
		}
		
	}
}

