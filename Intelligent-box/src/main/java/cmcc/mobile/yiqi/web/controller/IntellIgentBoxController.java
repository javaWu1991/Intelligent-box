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
	public JsonResult getProductList(long cid,String productName,Integer status){
		return intelligentBoxService.getProductListByCorpId(cid,productName,status) ;
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
}
