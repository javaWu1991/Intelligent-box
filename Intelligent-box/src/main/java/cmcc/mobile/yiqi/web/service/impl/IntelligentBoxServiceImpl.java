package cmcc.mobile.yiqi.web.service.impl;

import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.alibaba.fastjson.JSONObject;
import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.TOpenBoxLog;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper;
import cmcc.mobile.yiqi.entity.dao.TAppProductMapper;
import cmcc.mobile.yiqi.entity.dao.TOpenBoxLogMapper;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.utils.CommonUtil;
import cmcc.mobile.yiqi.utils.ConfigUtil;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.IntelligentUtil;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomNumUtil;
import cmcc.mobile.yiqi.utils.SocketUtil;
import cmcc.mobile.yiqi.vo.ConsumeVo;
import cmcc.mobile.yiqi.vo.EchartsVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.vo.Product;
import cmcc.mobile.yiqi.vo.ProductVo;
import cmcc.mobile.yiqi.vo.RefundVo;
import cmcc.mobile.yiqi.web.service.IWeixinPayService;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;
import sun.util.logging.resources.logging;
import weixin.popular.api.SnsAPI;

@Service("BoxService")
public class IntelligentBoxServiceImpl implements IntelligentBoxService{
	private static final Logger logger = LoggerFactory.getLogger(WeixinPayServiceImpl.class);
	@Autowired
	private IntelligentBoxMapper intelligentBoxMapper ;
	@Autowired
	private TAppProductMapper tAppProductMapper ;
	@Autowired
	private TOpenBoxLogMapper tOpenBoxLogMapper ;
	@Autowired
	private IWeixinPayService weixinPayService;
	@Override
	public JsonResult uploadImages(MultipartFile mr) {
		 /**
         * 查询banner图是否超过最多限制如果超过删除不上传
         */
        if (intelligentBoxMapper.selectAll(ConfigUtil.imgUrl).size() < 3 && mr.getSize() > 0) {
            String picurl = "";
            try {
                if (!mr.isEmpty()) {
                    picurl = FileUpload.uploadFile(mr, "banner");
                }
            } catch (IOException e) {
                return new JsonResult(false, "文件上传失败！", null);
            }
            BannerImg bannerImg = new BannerImg();
            bannerImg.setCreateTime(System.currentTimeMillis());
            bannerImg.setImgUrl(picurl);
            intelligentBoxMapper.insertSelective(bannerImg);
            return new JsonResult(true, "图片上传成功", bannerImg);
        }
        return new JsonResult(false, "图片上传失败", null);
	}
	/**
	 * 获取banner图
	 */
	@Override
	public JsonResult getImages() {
		 List<String> list = intelligentBoxMapper.selectAll(ConfigUtil.imgUrl);
		return new JsonResult(true,"获取成功",list);
	}
	/**
	 * 添加产品
	 */
	@Override
	public JsonResult addProduct(TAppProduct tAppProduct, MultipartFile mr) {
		 String picurl = "";
         try {
             if (!mr.isEmpty()) {
                 picurl = FileUpload.uploadFile(mr, "product");
             }
         } catch (IOException e) {
             return new JsonResult(false, "文件上传失败！", null);
         }
         tAppProduct.setProductImg(picurl);
         tAppProduct.setStatus(1);
         tAppProduct.setCreateTime(System.currentTimeMillis());
         if(tAppProductMapper.insertSelective(tAppProduct)==1){
        	 return new JsonResult(true,"添加成功",null) ;
         }
         
		return new JsonResult(false,"添加失败",null) ;
	}
	/**
	 * 获取产品列表
	 */
	@Override
	public JsonResult getProductList(String code) {
		Map<String, Object> map = new HashMap<>() ;
		map.put("machineId", code) ;
		map.put("imgUrl", ConfigUtil.imgUrl) ;
		List<TAppProduct> tAppProducts = tAppProductMapper.selectByMachineId(map) ;
		if(tAppProducts.size()==0||tAppProducts==null){
			return new JsonResult(false,"该编码不存在",null) ;
			
		}
		return new JsonResult(true,"获取成功！",tAppProducts) ;
	}
	/**
	 * 更新产品
	 */
	@Override
	public JsonResult updateProductList(TAppProduct tAppProduct, MultipartFile mr) {
		 String picurl = "";
         try {
             if (null !=mr) {
                 picurl = FileUpload.uploadFile(mr, "product");
                 tAppProduct.setProductImg(picurl);
             }
         } catch (IOException e) {
             return new JsonResult(false, "文件上传失败！", null);
         }
         tAppProduct.setUpdateTime(System.currentTimeMillis());
         if(tAppProductMapper.updateByPrimaryKeySelective(tAppProduct)==1){
        	 return new JsonResult(true,"更新成功",null) ;
         }
		return new JsonResult(false,"更新失败",null) ;
	}
	/**
	 * 获取产品详情
	 */
	@Override
	public JsonResult getProductDetail(Long productId) {
		TAppProduct tAppProduct = tAppProductMapper.selectByPrimaryKey(productId) ;
		if(tAppProduct==null){
			return new JsonResult(false, "产品不存在",null);
		}
		return new JsonResult(true, "获取成功！",tAppProduct);
	}
	/**
	 * 一键上架
	 */
	@Override
	public JsonResult upShelves(String code,Integer number,Long productId,long userId,long corpId) {
		//数量如果是0则只是更改下架的产品状态否则则更改下架的产品的同事也要更改缺货的产品数量
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setMachineId(code) ;
		tAppProduct.setStatus(1);
		//查询下架的产品
		List<TAppProduct> taAppProducts = tAppProductMapper.selectByMachine(code) ;
		if(taAppProducts.size()!=0){
			tAppProductMapper.updateByCode(tAppProduct) ;
			insertReplenishment(taAppProducts, userId, corpId, 0, 2);
		}else if(number!=null && productId!=null){
			//查询需要补货的产品
			List<TAppProduct> tAppProducts = new ArrayList<>() ;
			tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
			insertReplenishment(taAppProducts, userId, corpId, number, 1);
			tAppProduct.setProductNumber(number);
			tAppProduct.setId(productId);
			tAppProductMapper.updateByNumber(tAppProduct) ;
		}
		return new JsonResult(true,"上架成功！",null);
	}
	/**
	 * 下架
	 */
	@Override
	public JsonResult downShelves(Long  productId,long userId,long corpId) {
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setId(productId);
		tAppProduct.setStatus(0);
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
		insertReplenishment(tAppProducts, userId, corpId, 0,0);
		return new JsonResult(true,"下架成功",null);
	}
	/**
	 * 下发开门指令
	 * 并本地记录开门时间
	 */
	@SuppressWarnings("static-access")
	@Override
	public JsonResult openDoor(String code, Integer containerNumber,long userId) {
		//下发开门指令
		JSONObject jsonObject = new JSONObject() ;
		jsonObject.put("channel", containerNumber);
		jsonObject.put("devno", code) ;
		jsonObject.put("user_data", RandomNumUtil.genRandomNum()) ;
		JSONObject json = new JSONObject() ;
		json.put("cmd", "open_door") ;
		json.put("data", jsonObject);
		
		SocketUtil.getMessage(json) ;
		//查询货柜产品
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setContainerNumber(containerNumber.toString());
		tAppProduct.setMachineId(code);
		tAppProduct = tAppProductMapper.selectByMachineIdAndContainerNumber(tAppProduct) ;
		TOpenBoxLog tOpenBoxLog = new TOpenBoxLog() ;
		tOpenBoxLog.setProductName(tAppProduct.getProductName());
		tOpenBoxLog.setType(1);
		tOpenBoxLog.setUserId(userId);
		tOpenBoxLog.setStatus(0);
		insertOpenDoorLog(tOpenBoxLog);
		return new JsonResult(true,"开门成功!",null);
	}

	/**
	 * 记录开门log
	 */
	private void insertOpenDoorLog(TOpenBoxLog tOpenBoxLog){
		tOpenBoxLogMapper.insertSelective(tOpenBoxLog) ;
	}
	/**
	 * 单个上架产品
	 */
	@Override
	public JsonResult upBox(Long productId, Integer number,long userId,long corpId) {
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setId(productId); ;
		tAppProduct.setStatus(1);
		tAppProduct.setProductNumber(number);
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
		insertReplenishment(tAppProducts, userId, corpId, number,number==0?0:2);
		return new JsonResult(true,"上架成功",null) ;
	}
	/**
	 * 记录补货log
	 */
	private void insertReplenishment(List<TAppProduct> taAppProducts,long userId,long corpId,int productNumber,int type){
		for(TAppProduct tAppProduct : taAppProducts){
			TProductLog tProductLog = new TProductLog() ;
			tProductLog.setContainerNumber(tAppProduct.getContainerNumber());
			tProductLog.setCorpId(corpId);
			tProductLog.setCreateTime(System.currentTimeMillis());
			tProductLog.setCreateUserId(userId);
			tProductLog.setMachineId(tAppProduct.getMachineId());
			tProductLog.setProductNumber(productNumber);
			tProductLog.setType(type);
			intelligentBoxMapper.addReplenishment(tProductLog) ;
		}
	}
	/**
	 * 管理页面获取产品
	 */
	@Override
	public JsonResult getProductListByCorpId(Long corpId,String productName,Integer status,PageVo pageVo){ 
		Map<String, Object> map = new HashMap<>() ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		map.put("productName", productName) ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		List<TAppProduct> tAppProducts = tAppProductMapper.selectByCorp(map);
		int count = tAppProductMapper.selectByCorpCount(map);
		if(tAppProducts.size()==0||tAppProducts==null){
			return new JsonResult(false,"该编码不存在",null) ;
			
		}
		pageVo.setTotalCountAndPageTotal(count);
		JsonResult jsonResult = new JsonResult(true,"获取成功！",tAppProducts) ;
		jsonResult.setPageVo(pageVo);
		return jsonResult ;
	}
	/**
	 * 更新产品
	 */
	@Override
	public JsonResult updateProduct(TAppProduct tAppProduct,Long userId,Long corpId) {
		int type = 0 ;
		List<TAppProduct> taAppProducts = new ArrayList<>() ;
		tAppProduct.setUpdateTime(System.currentTimeMillis());
		if(tAppProductMapper.updateByPrimaryKeySelective(tAppProduct)==1){
			switch(tAppProduct.getStatus()){
			 case 3 : type=0 ;
			 break ;
			 case 1 : type=2 ;
			 break ;
			 case 4 : type=4 ;
			 break ;
			 case 2 : type=3 ;			 	
			}
		tAppProduct = tAppProductMapper.selectByPrimaryKey(tAppProduct.getId()) ;
		taAppProducts.add(tAppProduct) ;
		insertReplenishment(taAppProducts, userId, corpId, 0, type);
       	return new JsonResult(true,"更新成功",null) ;
        }
		return new JsonResult(false,"更新失败",null) ;
	}
	/**
	 * 支付接口
	 */
	@Override
	public String weixinPayH5(Long productId,String ip,String code) {
		ConsumeVo consumeVo = intelligentBoxMapper.selectByProduct(productId) ;
		Product product = new Product() ;
		product.setAppId(consumeVo.getAppId());
		product.setMchId(consumeVo.getMchId());
		product.setProductId(String.valueOf(productId));
		product.setProductName(consumeVo.getProductName());
		product.setOutTradeNo(RandomNumUtil.genRandomNum());
		product.setTotalFee(consumeVo.getFavorablePrice().toString());
		product.setSpbillCreateIp(ip);
		product.setCode(code);
		String mweb_url = weixinPayService.weixinPayH5(product) ;
		return mweb_url ;
	}
	
	/**
	 * 订单接口
	 */
	@Override
	public JsonResult getOrderList(Long userId) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("userId", userId) ;
		//各产品销量
		List<ProductVo> list = intelligentBoxMapper.getOrderList(map);
		//各产品类目销量
		map.put("category", 1) ;
		List<ProductVo> categoryList = intelligentBoxMapper.getOrderList(map);
		//行为时间段分析(查询出所有订单信息)
		List<ProductVo> actionList = intelligentBoxMapper.getAllOrderList(map) ;
		List<ProductVo> productVos = new ArrayList<>() ;
		productVos.addAll(list) ;
		
		for(ProductVo productVo : productVos){		
			int[] numberList = new int[12] ;
			for(ProductVo productVo1 : actionList){	
				if(productVo.getProductName().equals(productVo1.getProductName())){	
				for(int i =0 ;i<Constants.LIST_TIME.length;i++){
					if(Constants.LIST_TIME[i]==productVo1.getHours()||Constants.LIST_TIME[i]==(productVo1.getHours()+1)){
						if(numberList[i]!=0){
						numberList[i]=Integer.valueOf(productVo1.getProductNumber())+numberList[i] ;
						}else{
							numberList[i] = Integer.valueOf(productVo1.getProductNumber());
						}
					}
				}
					productVo.setNumberList(numberList);
			}
		}			
		}
		List<EchartsVo> echartsVos = new ArrayList<>() ;
		JSONObject object = new JSONObject() ;
		JSONObject obj = new JSONObject() ;
		JSONObject json = new JSONObject() ;
		json.put("show", true) ;
		obj.put("label", json) ;
		object.put("normal", obj) ;
		for( int i = 0 ; i<list.size(); i++){
			ProductVo productVo = list.get(i) ;
			EchartsVo echartsVo = new EchartsVo() ;
			echartsVo.setData(productVo.getNumberList());
			echartsVo.setName(productVo.getProductName());
			echartsVo.setStack("总量"+i);
			echartsVo.setType("line");
			echartsVo.setItemStyle(object);
			echartsVos.add(echartsVo) ;
			
		}
		map.clear();
		map.put("list", list) ;
		map.put("categoryList", categoryList) ;
		map.put("productVos", echartsVos) ;
		return new JsonResult(true,"获取成功！",map) ;
	}
	/**
	 * 按时间查询
	 */
	@Override
	public JsonResult orderListTime(Long userId, String type,String time) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("userId", userId) ;
		map.put("type", type) ;
		List<ProductVo> list = new ArrayList<ProductVo>() ;
		map.put("time", time.equals("0")?null:time) ;
		switch(type){
		//各产品销量
		case "1":
			list = intelligentBoxMapper.getOrderList(map);
			break ;
			//各产品类目销量
		case "2":
			map.put("category", 1) ;
			list = intelligentBoxMapper.getOrderList(map);
			break ;
			//行为时间段分析(查询出所有订单信息)
		case "3":
			 list = intelligentBoxMapper.getOrderList(map) ;
			 List<ProductVo> productVos = intelligentBoxMapper.getAllOrderList(map) ;
			for(ProductVo productVo : list){		
				int[] numberList = new int[12] ;
				for(ProductVo productVo1 : productVos){	
					if(productVo.getProductName().equals(productVo1.getProductName())){	
					for(int i =0 ;i<Constants.LIST_TIME.length;i++){
						if(Constants.LIST_TIME[i]==productVo1.getHours()||Constants.LIST_TIME[i]==(productVo1.getHours()+1)){
							if(numberList[i]!=0){
							numberList[i]=Integer.valueOf(productVo1.getProductNumber())+numberList[i] ;
							}else{
								numberList[i] = Integer.valueOf(productVo1.getProductNumber());
							}
						}
					}
						productVo.setNumberList(numberList);
				}
			}			
			}
			List<EchartsVo> echartsVos = new ArrayList<>() ;
			JSONObject object = new JSONObject() ;
			JSONObject obj = new JSONObject() ;
			JSONObject json = new JSONObject() ;
			json.put("show", true) ;
			obj.put("label", json) ;
			object.put("normal", obj) ;
			for( int i = 0 ; i<list.size(); i++){
				ProductVo productVo = list.get(i) ;
				EchartsVo echartsVo = new EchartsVo() ;
				echartsVo.setData(productVo.getNumberList());
				echartsVo.setName(productVo.getProductName());
				echartsVo.setStack("总量"+i);
				echartsVo.setType("line");
				echartsVo.setItemStyle(object);
				echartsVos.add(echartsVo) ;
				
			}
			return new JsonResult(true,"获取成功！",echartsVos) ;
			default:
				break ;
		}		
		return new JsonResult(true,"获取成功！",list) ;
	}
	/**
	 * 支付订单列表详情
	 */
	@Override
	public JsonResult orderDetail(Long userId, Integer status, String productName, Long startTime, Long endTime,
			PageVo pageVo, Long corpId) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("userId", userId) ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		map.put("productName", productName) ;
		map.put("status", status) ;
		//各产品销量
		List<ProductVo> list = intelligentBoxMapper.getOrderDetail(map);
		//订单数
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<ProductVo> list1 = intelligentBoxMapper.getOrderDetail(map);
		JsonResult result = new JsonResult(true, "获取成功", list);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	/**
	 * 微信退款
	 */
	@Override
	public JsonResult refundAction(Long productId,String orderCode,String money) {
		//查询订单信息以及商户信息
		RefundVo refundVo = intelligentBoxMapper.selectByRefund(productId) ;
		Product product = new Product() ;
		product.setAppId(refundVo.getAppId());
		product.setMchId(refundVo.getMchId());
		product.setOutTradeNo(orderCode);
		product.setTotalFee(money);
		String new_url = weixinPayService.weixinRefund(product) ;
		return new JsonResult(new_url.equals("success")?true:false,new_url,null);
	}	
	
	/**
	 * 微信支付成功的回调
	 */
	@SuppressWarnings("static-access")
	@Override
	public void notify(Map map) {
		//更新订单信息预支付未支付成功
		Product product = new Product() ;
		product.setOutTradeNo(map.get("out_trade_no").toString());
		product.setCreateTime(System.currentTimeMillis());
		product.setStatus(1);
		if(!map.get("result_code").toString().equals("SUCCESS")){
		product.setStatus(0);
		}
		//根据订单号查询预下单的商品
		TAppProduct tAppProduct = intelligentBoxMapper.selectByCode(map.get("result_code").toString()) ;
		if(tAppProduct!=null){
			intelligentBoxMapper.updateOrderByCode(product);
		}
		//并下发打开货柜门的指令
		JSONObject jsonObject = new JSONObject() ;
		jsonObject.put("channel", tAppProduct.getContainerNumber());
		jsonObject.put("devno", tAppProduct.getMachineId()) ;
		JSONObject json = new JSONObject() ;
		json.put("cmd", "door_open") ;
		json.put("data", jsonObject);
		JSONObject object = SocketUtil.getMessage(json) ;
		//记录开门状态
		JSONObject data = new JSONObject() ;
		TOpenBoxLog tBoxLog = new TOpenBoxLog() ;
		tBoxLog.setContainerNumber(Integer.valueOf(tAppProduct.getContainerNumber()));
		tBoxLog.setMachineId(tAppProduct.getMachineId());
		tBoxLog.setCreateTime(System.currentTimeMillis());
		tBoxLog.setProductName(tAppProduct.getProductName());
		tBoxLog.setCorpId(tAppProduct.getCorpId());
		tBoxLog.setType(0);
		if(data.parseObject(object.getString("data")).getInteger("rescode")==0){
			tBoxLog.setStatus(1);
		}else{
			tBoxLog.setStatus(0);
		}
		intelligentBoxMapper.insertOpenDoor(tBoxLog) ;
	}
	
	//注册客户端信息
	@Override
	public void insertMachindeRegister(String devno) {
		if(devno!=null){
			intelligentBoxMapper.insertMachindeRegister(devno);
		}			
	}
	
	//下发设备参数
	@SuppressWarnings("static-access")
	@Override
	public JsonResult configMachine(int hbtime, int led_on, int senstive,String devno) {
		JSONObject jsonObject = new JSONObject() ;
		jsonObject.put("hbtime", hbtime) ;
		jsonObject.put("led_on", led_on) ;
		jsonObject.put("senstive", senstive) ;
		jsonObject.put("company", "AES-123") ;
		jsonObject.put("devno", devno) ;
		JSONObject object = new JSONObject() ;
		object.put("cmd", "config") ;
		object.put("data", jsonObject) ;
		JSONObject json = SocketUtil.getMessage(object) ;
		JSONObject data = new JSONObject() ;
		if(data.parseObject(json.getString("data")).getInteger("rescode")==0){
			intelligentBoxMapper.insertMacineConfig(jsonObject) ;
			return new JsonResult(true,"设置成功",jsonObject);
		}
		return new JsonResult(false,"设置失败",null);
	}
	@Override
	public String weixinPayMobile(Long productId) {
		ConsumeVo consumeVo = intelligentBoxMapper.selectByProduct(productId) ;
		String redirect_uri = "http://www.xajun.com/Intelligent-box/api/H5/getUrl?productId="+productId ;
		logger.info("redirect_uri=========>"+redirect_uri);
		System.out.println(redirect_uri);
		//也可以通过state传递参数 redirect_uri 后面加参数未经过验证
		return SnsAPI.connectOauth2Authorize(consumeVo.getAppId(), redirect_uri, true,null);
	}
	
	/**
	 * 将开门结果入库
	 */
	@Override
	public void updateDoor(JSONObject json) {
		TOpenBoxLog tOpenBoxLog = new TOpenBoxLog() ;
		tOpenBoxLog.setContainerNumber(json.getInteger("channel"));
		tOpenBoxLog.setMachineId(json.getString("devno"));
		tOpenBoxLog.setStatus(json.getInteger("rescode")==0?1:0);
		intelligentBoxMapper.updateDoor(tOpenBoxLog) ;
		
	}

	
	
	
}
