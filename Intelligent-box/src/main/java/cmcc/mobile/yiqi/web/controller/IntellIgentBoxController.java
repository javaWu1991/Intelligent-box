package cmcc.mobile.yiqi.web.controller;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.lang.StringUtils;
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
		
		return intelligentBoxService.uploadImages(mr,"banner") ;
	}
	/**
	 * 上传升级包
	 */
	@ResponseBody
	@RequestMapping("/uploadBuind")
	public JsonResult uploadBuind(MultipartFile mr,String version,String desc){
		version = StringUtils.substringBefore(mr.getOriginalFilename(), ".bin");
		
		return intelligentBoxService.uploadBuind(mr,version,desc) ;
	}
	/**
	 * 获取升级包列表
	 */
	@ResponseBody
	@RequestMapping("/getBuindList")
	public JsonResult getBuindList(String buind,PageVo pageVo){
		return intelligentBoxService.getBuindList(buind,pageVo) ;
	}
	/**
	 * 添加产品
	 */
	@ResponseBody
	@RequestMapping("/addProduct")
	public JsonResult addProduct(TAppProduct tAppProduct,MultipartFile mr,HttpServletRequest request){
		HttpSession session = request.getSession() ;
		long corpId = Long.valueOf(session.getAttribute("companyId").toString()) ;
		if(tAppProduct.getMachineId()==null){
			return new JsonResult(false,"没有绑定的设备请联系管理员",null) ;
		}
		tAppProduct.setCorpId(corpId);
		return intelligentBoxService.addProduct(tAppProduct,mr) ;
	}
	/**
	 * 获取产品列表
	 */
	@ResponseBody
	@RequestMapping("/getProductList")
	public JsonResult getProductList(Long cid,String productName,Long machineId,Integer status,PageVo pageVo){
		return intelligentBoxService.getProductListByCorpId(cid,productName,machineId,status,pageVo) ;
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
	public JsonResult refundAction(Long productId,String orderCode,String price){
		if(productId==null){
			return new JsonResult(false,"参数错误！",null) ;
		}
		return intelligentBoxService.refundAction(productId,orderCode,price);
		
	}
	
	/**
	 * 设置货柜参数
	 */
	@RequestMapping("/configMachine")
	@ResponseBody
	public JsonResult configMachine(int hbtime,int led_on,int senstive,String devno){
		return intelligentBoxService.configMachine(hbtime,led_on,senstive,devno) ;
	}
	
	/**
	 * 新建设备
	 * 设备序列号系统自动生成
	 * 	 * 该接口已弃用
	 */
	@RequestMapping("/addMachine")
	@ResponseBody
	public JsonResult addMachine(Long corpId,String buind){
		return intelligentBoxService.addMachine(corpId,buind) ;
	}
	/**
	 * 获取已经绑定的设备
	 */
	@RequestMapping("/getMachineList")
	@ResponseBody
	public JsonResult getMachineList(HttpServletRequest request,Integer status,Long startTime,Long endTime,PageVo pageVo,Long corpId){
		String type = request.getParameter("type") ;
		return intelligentBoxService.getMachineList(status,startTime,endTime,pageVo,corpId,type) ;
	}
	/**
	 * 设备注册信息
	 */
	@RequestMapping("/getMachineRegister")
	@ResponseBody
	public JsonResult getMachineRegister(HttpServletRequest request,Integer status,Long startTime,Long endTime,PageVo pageVo,Long corpId){
		return intelligentBoxService.getMachineRegister(status,startTime,endTime,pageVo,corpId) ;
	}
	/**
	 * 设备心跳信息
	 */
	@RequestMapping("/getMachineHeartbeat")
	@ResponseBody
	public JsonResult getMachineHeartbeat(HttpServletRequest request,Integer status,Long startTime,Long endTime,PageVo pageVo,Long corpId){
		return intelligentBoxService.getMachineHeartbeat(status,startTime,endTime,pageVo,corpId) ;
	}
	
	/**
	 * 设备开门信息
	 */
	@RequestMapping("/getMachineOpenDoor")
	@ResponseBody
	public JsonResult getMachineOpenDoor(HttpServletRequest request,Integer status,Long startTime,Long endTime,PageVo pageVo,Long corpId){
		return intelligentBoxService.getMachineOpenDoor(status,startTime,endTime,pageVo,corpId) ;
	}
	
	/**
	 * 设备信息路由
	 */
	@RequestMapping("/machine")
	@ResponseBody
	public ModelAndView machine(){
		ModelAndView view = new ModelAndView("system/machine");
		return view;
	}
	/**
	 * 设备注册信息路由
	 */
	@RequestMapping("/machineRegister")
	@ResponseBody
	public ModelAndView machineRegister(){
		ModelAndView view = new ModelAndView("system/machineRegister");
		return view;
	}
	/**
	 * 设备心跳信息路由
	 */
	@RequestMapping("/machineHeartbeat")
	@ResponseBody
	public ModelAndView machineHeartbeat(){
		ModelAndView view = new ModelAndView("system/machineHeartbeat");
		return view;
	}
	/**
	 * 设备开门信息路由
	 */
	@RequestMapping("/openDoor")
	@ResponseBody
	public ModelAndView machineOpenDoor(){
		ModelAndView view = new ModelAndView("system/openDoor");
		return view;
	}
	/**
	 * 获取公司
	 */
	@RequestMapping("/getCompanyList")
	@ResponseBody
	public JsonResult getCompanyList(HttpServletRequest request){
		return intelligentBoxService.getCompanyList() ;
	}
	/**
	 * 设备批量绑定企业
	 */
	@RequestMapping("/bindingCompany")
	@ResponseBody
	public JsonResult bindingCompany(String[] machineId,String[] buind,HttpServletRequest request){
		Long corpId = Long.valueOf(request.getParameter("corpId").toString());
		String roomCode = request.getParameter("roomCode");
		return intelligentBoxService.bindingCompany(machineId,buind,corpId,roomCode) ;
	}
	/**
	 * 解绑设备
	 */
	@RequestMapping("/deleteBinding")
	@ResponseBody
	public JsonResult deleteBinding(String machineId,HttpServletRequest request){
		return intelligentBoxService.deleteBinding(machineId) ;
	}
	/**
	 * 升级包路由
	 */
	@RequestMapping("/machineUpdate")
	@ResponseBody
	public ModelAndView machineUpdate(){
		ModelAndView view = new ModelAndView("system/machineUpdate");
		return view;
	}
	
	/**
	 * 默认产品组路由
	 */
	@RequestMapping("/defaultProduct")
	@ResponseBody
	public ModelAndView defaultProduct(){
		ModelAndView view = new ModelAndView("system/defaultProduct");
		return view;
	}
	
	/**
	 * 添加产品
	 */
	@ResponseBody
	@RequestMapping("/addDefaultProduct")
	public JsonResult addDefaultProduct(TAppProduct tAppProduct,MultipartFile mr,HttpServletRequest request){
		return intelligentBoxService.addDefaultProduct(tAppProduct,mr) ;
	}
	
	/**
	 * 获取产品列表
	 */
	@ResponseBody
	@RequestMapping("/getDefaultProductList")
	public JsonResult getDefaultProductList(){
		return intelligentBoxService.getDefaultProductList() ;
	}
	
	/**
	 * 编辑产品
	 */
	@ResponseBody
	@RequestMapping("/updateDefaultProduct")
	public JsonResult updateDefaultProduct(TAppProduct tAppProduct,MultipartFile mr){
		return intelligentBoxService.updateDefaultProduct(tAppProduct,mr) ;
	}
	/**
	 * 富文本上传图片
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/upload")
	public JsonResult upload(MultipartFile file){
		return intelligentBoxService.uploadImages(file,"image") ;
	}
	
}
