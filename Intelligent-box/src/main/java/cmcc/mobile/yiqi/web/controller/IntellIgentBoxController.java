package cmcc.mobile.yiqi.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import cmcc.mobile.yiqi.base.BaseController;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;

/**
 * 后台管理界面部分接口
 * @author wubenjaing
 *
 */
@Controller
@RequestMapping("/web/boxWeb")
public class IntellIgentBoxController extends BaseController{
	@Autowired
	private IntelligentBoxService intelligentBoxService ;
	
	/**
	 * 上传banner轮播图
	 */
	@ResponseBody
	@RequestMapping("/uploadImages")
	public JsonResult uploadImages(MultipartFile mr){
		
		return intelligentBoxService.uploadImages(mr) ;
	}
	/**
	 * 添加产品
	 */
	@ResponseBody
	@RequestMapping("/addProduct")
	public JsonResult addProduct(TAppProduct tAppProduct,MultipartFile mr,HttpServletRequest request){
		HttpSession session = request.getSession() ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		tAppProduct.setCorpId(corpId);
		return intelligentBoxService.addProduct(tAppProduct,mr) ;
	}
	/**
	 * 获取产品列表
	 */
	@ResponseBody
	@RequestMapping("/getProductList")
	public JsonResult getProductList(Long cid,String productName,Integer status,PageVo pageVo){
		return intelligentBoxService.getProductListByCorpId(cid,productName,status,pageVo) ;
	}
	/**
	 * 更新产品图片
	 */
	@ResponseBody
	@RequestMapping("/updateProductList")
	public JsonResult updateProductList(TAppProduct tAppProduct,MultipartFile mr){
		return intelligentBoxService.updateProductList(tAppProduct,mr ) ;
	}
	/**
	 * 更新产品
	 */
	@ResponseBody
	@RequestMapping("/updateProduct")
	public JsonResult updateProduct(TAppProduct tAppProduct,HttpServletRequest request){
		HttpSession session = request.getSession() ;
		Long userId = Long.valueOf(session.getAttribute("userId").toString() );
		Long corpId = Long.valueOf(session.getAttribute("companyId").toString() );
		return intelligentBoxService.updateProduct(tAppProduct,userId,corpId) ;
	}
	/**
	 * 产品列表页面
	 */
	@RequestMapping("/productList")
	public ModelAndView areaadmin(String cid) {
		ModelAndView view = new ModelAndView("system/product");
		return view;
	}
	
	/**
	 * 订单信息页面
	 */
	@RequestMapping("/report")
	public ModelAndView report() {
		ModelAndView view = new ModelAndView("system/welcome");
		return view;
	}
	/**
	 * 获取全部订单信息
	 */
	@RequestMapping("/orderList")
	@ResponseBody
	public JsonResult orderList(HttpServletRequest request){
		HttpSession session = request.getSession() ;
		if(session.getAttribute("userId")==null){
			return new JsonResult(false,"非法请求",null) ;
		}
		Long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		return intelligentBoxService.getOrderList(userId) ;
	}
	/**
	 * 按时间查询订单信息
	 */
	@RequestMapping("/orderListTime")
	@ResponseBody
	public JsonResult orderListTime(HttpServletRequest request){
		HttpSession session = request.getSession() ;
		if(session.getAttribute("userId")==null){
			return new JsonResult(false,"非法请求",null) ;
		}
		Long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		String type = request.getParameter("type").toString() ;
		String time = request.getParameter("time").toString() ;
		return intelligentBoxService.orderListTime(userId,type,time) ;
	}
	/**
	 * 订单信息路由
	 */
	@RequestMapping("/order")
	@ResponseBody
	public ModelAndView order(){
		ModelAndView view = new ModelAndView("system/order");
		return view;
	}
	/**
	 * 订单信息
	 */
	@RequestMapping("/orderDetail")
	@ResponseBody
	public JsonResult orderDetail(HttpServletRequest request,Integer status,String productName,Long startTime,Long endTime,PageVo pageVo,Long corpId){
		HttpSession session = request.getSession() ;
		if(session.getAttribute("userId")==null){
			return new JsonResult(false,"非法请求",null) ;
		}
		Long userId = Long.valueOf(session.getAttribute("userId").toString()) ;
		return intelligentBoxService.orderDetail(userId,status,productName,startTime,endTime,pageVo,corpId) ;
	}
	/**
	 * 微信退款申请
	 */
	@RequestMapping("/refundAction")
	@ResponseBody
	public JsonResult refundAction(Long productId,String orderCode,String money){
		if(productId==null){
			return new JsonResult(false,"参数错误！",null) ;
		}
		return intelligentBoxService.refundAction(productId,orderCode,money);
		
	}
}
