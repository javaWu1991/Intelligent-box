package cmcc.mobile.yiqi.web.service.impl;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.alibaba.fastjson.JSONObject;
import cmcc.mobile.yiqi.entity.BannerImg;
import cmcc.mobile.yiqi.entity.TAppCompany;
import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.THeartbeat;
import cmcc.mobile.yiqi.entity.TIntelligentBuind;
import cmcc.mobile.yiqi.entity.TMachine;
import cmcc.mobile.yiqi.entity.TOpenBoxLog;
import cmcc.mobile.yiqi.entity.TProductLog;
import cmcc.mobile.yiqi.entity.TRegister;
import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper;
import cmcc.mobile.yiqi.entity.dao.TAppCompanyMapper;
import cmcc.mobile.yiqi.entity.dao.TAppProductMapper;
import cmcc.mobile.yiqi.entity.dao.TOpenBoxLogMapper;
import cmcc.mobile.yiqi.base.Constants;
import cmcc.mobile.yiqi.utils.CRC16Util;
import cmcc.mobile.yiqi.utils.CheckResult;
import cmcc.mobile.yiqi.utils.ConfigUtil;
import cmcc.mobile.yiqi.utils.FileUpload;
import cmcc.mobile.yiqi.utils.JsonResult;
import cmcc.mobile.yiqi.utils.RandomNumUtil;
import cmcc.mobile.yiqi.utils.RandomUtil;
import cmcc.mobile.yiqi.utils.SocketUtil;
import cmcc.mobile.yiqi.vo.ConsumeVo;
import cmcc.mobile.yiqi.vo.EchartsVo;
import cmcc.mobile.yiqi.vo.ExcleVo;
import cmcc.mobile.yiqi.vo.PageVo;
import cmcc.mobile.yiqi.vo.Product;
import cmcc.mobile.yiqi.vo.ProductVo;
import cmcc.mobile.yiqi.vo.RefundVo;
import cmcc.mobile.yiqi.web.service.IWeixinPayService;
import cmcc.mobile.yiqi.web.service.IntelligentBoxService;
import weixin.popular.api.SnsAPI;

@Service("BoxService") 
public class IntelligentBoxServiceImpl implements IntelligentBoxService{
	private static final Logger logger = LoggerFactory.getLogger(IntelligentBoxServiceImpl.class);
	@Autowired
	private IntelligentBoxMapper intelligentBoxMapper ;
	@Autowired
	private TAppProductMapper tAppProductMapper ;
	@Autowired
	private TOpenBoxLogMapper tOpenBoxLogMapper ;
	@Autowired
	private TAppCompanyMapper tAppCompanyMapper ;
	@Autowired
	private IWeixinPayService weixinPayService; 
	@Override
	public JsonResult uploadImages(MultipartFile mr,String path) {
		 /**
         * 查询banner图是否超过最多限制如果超过删除不上传
         */
        if (intelligentBoxMapper.selectAll(ConfigUtil.imgUrl).size() < 3 && mr.getSize() > 0) {
            String picurl = "";
            try {
                if (!mr.isEmpty()) {
                    picurl = FileUpload.uploadFile(mr, path);
                }
            } catch (IOException e) {
                return new JsonResult(false, "文件上传失败！", null);
            }
            BannerImg bannerImg = new BannerImg();
            bannerImg.setCreateTime(System.currentTimeMillis());
            bannerImg.setImgUrl(picurl);
            bannerImg.setType("1");
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
		//先去查询该货柜是否已经有产品有产品则不允许添加
		TAppProduct tProduct = tAppProductMapper.selectByMachineIdAndContainerNumber(tAppProduct) ;
		if(tProduct!=null){
			return new JsonResult(false,"该设备的货柜已经有商品",null) ;
		}
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
	public JsonResult getProductList(String code,String type) {
		Map<String, Object> map = new HashMap<>() ;
		map.put("machineId", code) ;
		map.put("imgUrl", ConfigUtil.imgUrl) ;
		map.put("type", type) ;
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
		//数量如果是0则只是更改下架的产品状态否则则更改下架的产品的同时也要更改缺货的产品数量
		TAppProduct tAppProduct = new TAppProduct() ;
		tAppProduct.setMachineId(code) ;
		tAppProduct.setStatus(1);
		//查询下架的产品
		List<TAppProduct> taAppProducts = tAppProductMapper.selectByMachine(code) ;
		if(taAppProducts.size()!=0){
			tAppProduct.setProductNumber(1);
			tAppProductMapper.updateByCode(tAppProduct) ;
			insertReplenishment(taAppProducts, userId, corpId, 0, 2);
		}else if(number!=null && productId!=null){
			//查询需要补货的产品
			List<TAppProduct> tAppProducts = new ArrayList<>() ;
			tAppProducts.add(tAppProductMapper.selectByPrimaryKey(productId)) ;
			if(tAppProducts.size()!=0){
			insertReplenishment(taAppProducts, userId, tAppProducts.get(0).getCorpId(), number, 1);
			tAppProduct.setProductNumber(number);
			tAppProduct.setId(productId);
			tAppProductMapper.updateByNumber(tAppProduct) ;
			}
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
		tAppProduct.setProductNumber(0);
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProduct = tAppProductMapper.selectByPrimaryKey(productId) ;
		tAppProducts.add(tAppProduct) ;
		insertReplenishment(tAppProducts, userId, tAppProduct.getCorpId(), 0,0);
		return new JsonResult(true,"下架成功",null);
	}
	/**
	 * 下发开门指令
	 * 并本地记录开门时间
	 */
	@Override
	public JsonResult openDoor(String code, Long productId,Long userId) {
		TAppProduct tAppProduct = tAppProductMapper.selectByPrimaryKey(productId) ;
		//下发开门指令
		JSONObject jsonObject = new JSONObject() ;
		jsonObject.put("channel", Integer.valueOf(tAppProduct.getContainerNumber()));
		jsonObject.put("devno", code) ;
		jsonObject.put("user_data", RandomNumUtil.genRandomNum()) ;
		JSONObject json = new JSONObject() ;
		json.put("cmd", "open_door") ;
		json.put("data", jsonObject);
		
		SocketUtil.getMessage(json) ;
		//查询货柜产品
		TOpenBoxLog tOpenBoxLog = new TOpenBoxLog() ;
		tOpenBoxLog.setProductName(tAppProduct.getProductName());
		tOpenBoxLog.setType(1);
		tOpenBoxLog.setUserId(userId);
		tOpenBoxLog.setStatus(0);
		tOpenBoxLog.setCreateTime(System.currentTimeMillis());
		tOpenBoxLog.setContainerNumber(Integer.valueOf(tAppProduct.getContainerNumber()));
		tOpenBoxLog.setMachineId(tAppProduct.getMachineId());	
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
		if(number==null){
			tAppProduct.setProductNumber(1);
		}else{
		tAppProduct.setProductNumber(number);
		}
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		List<TAppProduct> tAppProducts = new ArrayList<>() ;
		tAppProduct = tAppProductMapper.selectByPrimaryKey(productId) ;
		tAppProducts.add(tAppProduct) ;
		insertReplenishment(tAppProducts, userId, tAppProduct.getCorpId(), number==null?0:number,number==null?0:2);
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
	public JsonResult getProductListByCorpId(Long corpId,String productName, Long machineId,Integer status,PageVo pageVo){ 
		Map<String, Object> map = new HashMap<>() ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		map.put("productName", productName) ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("machineId", machineId) ;
		List<TAppProduct> tAppProducts = tAppProductMapper.selectByCorp(map);
		List<TAppProduct> tList = tAppProductMapper.selectByCorpCount(map);
		if(tAppProducts.size()==0||tAppProducts==null){
			return new JsonResult(false,"该编码不存在",null) ;
			
		}
		pageVo.setTotalCountAndPageTotal(tList.size());
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
		BigDecimal a1 = new BigDecimal(Double.toString(consumeVo.getFavorablePrice()));  
		BigDecimal b1 = new BigDecimal(Double.toString(100));   
		BigDecimal result = a1.multiply(b1);// 相乘结果
		product.setTotalFee(result.toString());
		product.setSpbillCreateIp(ip);
		product.setCode(code);
		String url = weixinPayService.weixinPayH5(product) ;
		return url ;
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
		BigDecimal a1 = new BigDecimal(money);  
		BigDecimal b1 = new BigDecimal(Double.toString(100));   
		BigDecimal result = a1.multiply(b1);// 相乘结果
		product.setTotalFee(result.toString());
		product.setReturnCode(RandomNumUtil.genRandomNum());
		String new_url = weixinPayService.weixinRefund(product) ;
		return new JsonResult(new_url.equals("success")?true:false,new_url,null);
	}	
	
	/**
	 * 微信支付成功的回调
	 */
	@Override
	public void notify(Map map) {
		//更新订单信息预支付未支付成功
		Product product = new Product() ;
		product.setOutTradeNo(map.get("out_trade_no").toString());
		product.setCreateTime(System.currentTimeMillis());
		product.setStatus(0);
		//根据订单号查询预下单的商品
		TAppProduct tAppProduct = tAppProductMapper.selectByCode(map.get("out_trade_no").toString()) ;
		//如果是锁扣打开的柜门更改产品状态为缺货
		if(!tAppProduct.getContainerNumber().equals("1")){
		tAppProduct.setStatus(0);
		tAppProduct.setProductNumber(0);
		tAppProduct.setUpdateTime(System.currentTimeMillis());
		}else{
			tAppProduct.setProductNumber(tAppProduct.getProductNumber()-1);
			if(tAppProduct.getProductNumber()==0){
				tAppProduct.setStatus(0);
			}
		}
		tAppProduct.setUpdateTime(System.currentTimeMillis());
		tAppProductMapper.updateByPrimaryKeySelective(tAppProduct) ;
		if(tAppProduct.getType()!=0){
		JSONObject jsonObject = new JSONObject() ;
		jsonObject.put("channel", Integer.valueOf(tAppProduct.getContainerNumber()));
		jsonObject.put("devno", tAppProduct.getMachineId()) ;
		jsonObject.put("user_data", RandomNumUtil.genRandomNum()) ;
		JSONObject json = new JSONObject() ;
		json.put("cmd", "open_door") ;
		json.put("data", jsonObject);		
		SocketUtil.getMessage(json) ;
		TOpenBoxLog tOpenBoxLog = new TOpenBoxLog() ;
		tOpenBoxLog.setProductName(tAppProduct.getProductName());
		tOpenBoxLog.setType(0);
		tOpenBoxLog.setUserId(null);
		tOpenBoxLog.setStatus(0);
		tOpenBoxLog.setCreateTime(System.currentTimeMillis());
		tOpenBoxLog.setMachineId(tAppProduct.getMachineId());
		tOpenBoxLog.setContainerNumber(Integer.valueOf(tAppProduct.getContainerNumber()));
		insertOpenDoorLog(tOpenBoxLog);
		if(tAppProduct!=null){
			intelligentBoxMapper.updateOrderByCode(product);
		}
		}
	}
	
	//注册客户端信息
	@Override
	public void insertMachindeRegister(JSONObject json) {
		
		if(json!=null){
			String devno = json.getString("devno") ;
			TRegister tRegister = intelligentBoxMapper.selectRegister(devno) ;
			if(tRegister==null){
				String buind = json.getString("buind") ;
				TRegister register = new TRegister() ;
				register.setMachineId(devno);
				register.setBuind(buind);
				register.setStatus(0);
				register.setRegisterTime(System.currentTimeMillis());
				register.setUpdateTime(System.currentTimeMillis());
				intelligentBoxMapper.insertMachindeRegister(register);
			}else{
			tRegister.setUpdateTime(System.currentTimeMillis());
			intelligentBoxMapper.updateRegister(tRegister) ;	
			}
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
//		JSONObject json = SocketUtil.getMessage(object) ;
//		JSONObject data = new JSONObject() ;
//		if(data.parseObject(json.getString("data")).getInteger("rescode")==0){
//			intelligentBoxMapper.insertMacineConfig(jsonObject) ;
//			return new JsonResult(true,"设置成功",jsonObject);
//		}
		return new JsonResult(false,"设置失败",null);
	}
	@Override
	public String weixinPayMobile(Long productId) {
		ConsumeVo consumeVo = intelligentBoxMapper.selectByProduct(productId) ;
		if(consumeVo==null){
			return "缺货" ;
		}
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
	/**
	 * 心跳入库唯一序列号只有一条记录
	 * 更新和插入想结合
	 */
	@Override
	public void insertHeartbeat(JSONObject json) {
		logger.info("心跳参数："+json.toJSONString());
		/**
		 * 先去查询是否有心跳记录
		 */
		String machineId = json.getString("devno") ;
		String version = json.getString("version") ;
		int ledState = json.getIntValue("led_state") ;
		int light = json.getIntValue("light") ;
		int motorState = json.getIntValue("motor_state") ;
		int simRssi = json.getIntValue("sim_rssi") ;
		THeartbeat tHeartbeat = intelligentBoxMapper.selectHeartbeat(machineId) ;
		THeartbeat heartbeat = new THeartbeat() ;
		//没有记录怎插入,有就更新
		if(tHeartbeat==null){
			heartbeat.setCreateTime(System.currentTimeMillis());
			heartbeat.setJson(json.toJSONString());
			heartbeat.setMachineId(machineId);
			heartbeat.setUpdateTime(System.currentTimeMillis());
			heartbeat.setVersion(version);
			heartbeat.setLedState(ledState);
			heartbeat.setLight(light);
			heartbeat.setMotorState(motorState);
			heartbeat.setSimRssi(simRssi);
			intelligentBoxMapper.insertHeartbeat(heartbeat) ;
		}else{
			heartbeat.setJson(json.toJSONString());
			heartbeat.setMachineId(machineId);
			heartbeat.setUpdateTime(System.currentTimeMillis());
			heartbeat.setVersion(version);
			heartbeat.setLedState(ledState);
			heartbeat.setLight(light);
			heartbeat.setMotorState(motorState);
			heartbeat.setSimRssi(simRssi);
			intelligentBoxMapper.updateHeartbeat(heartbeat) ;
			logger.info("接收到的参数："+heartbeat);
		}
		//查询是否需要升级
		TIntelligentBuind tIntelligentBuind = intelligentBoxMapper.selectBuind(version) ;
		if(tIntelligentBuind!=null){
			JSONObject jsonObject = new JSONObject() ;
			JSONObject object = new JSONObject() ;
			object.put("rescode", 0) ;
			object.put("resmsg", "ok");
			object.put("devno", machineId) ;
			jsonObject.put("cmd", "upgrade") ;
			jsonObject.put("data", object);		
			SocketUtil.getMessage(object) ;
		}
	}
	/**
	 * 查询心跳
	 */
	@Override
	public THeartbeat selectTHeartbeat(Long productId) {
		
		return intelligentBoxMapper.selectHeartbeatByProductId(productId);
	}
	/**
	 * 新建设备
	 */
	@Override
	public JsonResult addMachine(Long corpId,String buind) {
		TMachine tMachine = new TMachine() ;
		tMachine.setCorpId(corpId);
		tMachine.setMachineId(RandomUtil.createID());
		tMachine.setStatus(0);
		tMachine.setBuind(buind);
		tMachine.setCreateTime(System.currentTimeMillis());
		intelligentBoxMapper.insertMachine(tMachine);
		return new JsonResult(true,"添加成功！",null);
	}
	@Override
	public JsonResult getMachineRegister(Integer status, Long startTime, Long endTime,PageVo pageVo, Long corpId) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		//分页
		List<TRegister> list = intelligentBoxMapper.getMachineRegister(map);
		//全部
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<TRegister> list1 = intelligentBoxMapper.getMachineRegister(map);
		JsonResult result = new JsonResult(true, "获取成功", list);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	@Override
	public JsonResult getMachineHeartbeat(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		//分页
		List<THeartbeat> list = intelligentBoxMapper.getMachineHeartbeat(map);
		//全部
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<THeartbeat> list1 = intelligentBoxMapper.getMachineHeartbeat(map);
		JsonResult result = new JsonResult(true, "获取成功", list);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	@Override
	public JsonResult getMachineOpenDoor(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		//分页
		List<TOpenBoxLog> list = intelligentBoxMapper.getMachineOpenDoor(map);
		//全部
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<TOpenBoxLog> list1 = intelligentBoxMapper.getMachineOpenDoor(map);
		JsonResult result = new JsonResult(true, "获取成功", list);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	/**
	 * 获取设备
	 */
	@Override
	public JsonResult getMachineList(Integer status, Long startTime, Long endTime, PageVo pageVo, Long corpId,String type) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		map.put("status", status) ;
		//分页
		List<TMachine> list = intelligentBoxMapper.getMachineList(map);
		//查询设备货物状态
		for(TMachine tMachine :list){
			int count = tAppProductMapper.selectByProductStatus(tMachine.getMachineId()) ;
			//查询设备上电状态
			THeartbeat tHeartbeat = intelligentBoxMapper.selectHeartbeat(tMachine.getMachineId()) ;
			if(System.currentTimeMillis()-tHeartbeat.getUpdateTime()>40000){
				tMachine.setStatus(2);
			}
			if(count>0){
				tMachine.setProductState("缺货");
			}else{
				tMachine.setProductState("有货");
			}
		}
		//全部
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<TMachine> list1 = intelligentBoxMapper.getMachineList(map);
		JsonResult result = new JsonResult(true, "获取成功", type==null?list:list1);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	@Override
	public JsonResult getCompanyList() {
		List<TAppCompany> tAppCompany = new ArrayList<>() ;
		tAppCompany = tAppCompanyMapper.selectCompanyAll() ;
		return new JsonResult(true,"获取成功！",tAppCompany);
	}
	/**
	 * 设备批量绑定企业
	 */
	@Override
	public JsonResult bindingCompany(String[] machineId,String[] buind, Long corpId,String roomCode) {
		Map<String, Object> map = new HashMap<>() ;
		map.put("machineId", machineId) ;
		map.put("corpId", corpId) ;
		map.put("createTime", System.currentTimeMillis()) ;
		map.put("roomCode", roomCode) ;
		intelligentBoxMapper.insetButh(map) ;
		//并更新绑定状态
		intelligentBoxMapper.updateRegisterButh(map) ;
		//查询默认产品生成产品表
		List<TAppProduct> list = tAppProductMapper.selectDefaultProduct() ;
		List<TAppProduct> tAppProducts = new ArrayList<TAppProduct>() ;
		for(TAppProduct tAppProduct:list){
			for(int i=0;i<machineId.length;i++){
				tAppProduct.setMachineId(machineId[i]);
				tAppProduct.setStatus(1);
				tAppProduct.setCorpId(corpId);
				tAppProduct.setCreateTime(System.currentTimeMillis());
				tAppProduct.setUpdateTime(System.currentTimeMillis());
				tAppProducts.add(tAppProduct) ;
			}
		}
		//批量插入默认生成的产品
		tAppProductMapper.insertButhProduct(tAppProducts) ;
		return new JsonResult(true,"绑定成功！",null);
	}
	@Override
	public JsonResult uploadBuind(MultipartFile mr,String buind,String desc) {
        String buindUrl = "";
        int check =0 ;
        try {
			check = CRC16Util.crc16(mr.getBytes());
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
        try {
            if (!mr.isEmpty()) {
            	buindUrl = FileUpload.uploadFile(mr, "buind");
            }
        } catch (IOException e) {
            return new JsonResult(false, "文件上传失败！", null);
        }
        TIntelligentBuind tIntelligentBuind = new TIntelligentBuind() ;
        //查询上一个版本号
        TIntelligentBuind tBuind = intelligentBoxMapper.selectByBuind();
        tIntelligentBuind.setBuind(tBuind.getNewBuind());
        tIntelligentBuind.setBuindUrl(ConfigUtil.imgUrl+buindUrl);
        tIntelligentBuind.setNewBuind(buind);
        tIntelligentBuind.setStatus(0);
        tIntelligentBuind.setCheck(check);
        tIntelligentBuind.setDesc(desc);
        tIntelligentBuind.setCreateTime(System.currentTimeMillis());
        intelligentBoxMapper.insertTIntelligent(tIntelligentBuind) ;
        return new JsonResult(true, "上传成功", tIntelligentBuind);
	}
	@Override
	public CheckResult getBuind(String buind,String devno) {
		TIntelligentBuind tIntelligentBuind = intelligentBoxMapper.selectBuind(buind) ;
		if(tIntelligentBuind==null){
			return new CheckResult(2,"无需升级",null,null,0) ;
		}
		return new CheckResult(0,"ok",tIntelligentBuind.getBuindUrl(),tIntelligentBuind.getNewBuind(),tIntelligentBuind.getCheck()) ;
	}
	@Override
	public JsonResult getBuindList(String buind, PageVo pageVo) {
		Map<String, Object> map = new HashMap<String,Object>() ;
		map.put("startRow", pageVo.getStartRow()) ;
		map.put("endRow", pageVo.getEndRow()) ;
		map.put("buind", buind) ;
		//分页
		List<TIntelligentBuind> list = intelligentBoxMapper.getBuindList(map);
		//全部
		map.put("startRow", null) ;
		map.put("endRow", null) ;
		List<TIntelligentBuind> list1 = intelligentBoxMapper.getBuindList(map);
		JsonResult result = new JsonResult(true, "获取成功", list);
		pageVo.setTotalCountAndPageTotal(list1.size());
		result.setPageVo(pageVo);
		return result;
	}
	@Override
	public JsonResult deleteBinding(String machineId) {
		//更新设备状态为删除
		intelligentBoxMapper.updateMachine(machineId) ;
		//更新注册状态未未绑定
		intelligentBoxMapper.updateRegisterByMachineId(machineId);
		//更新产品状态未删除
		TAppProduct tAppProduct = new TAppProduct();
		tAppProduct.setMachineId(machineId);
		tAppProduct.setStatus(4);
		tAppProduct.setUpdateTime(System.currentTimeMillis());
		tAppProductMapper.updateByMachine(tAppProduct);
		return new JsonResult(true,"解绑成功",null);
	}
	//通过设备编码查询企业id
	@Override
	public Long selectCorpId(String parameter) {
		Long corpId = intelligentBoxMapper.selectCorpId(parameter) ;
		return corpId ;
	}
	//添加默认产品
	@Override
	public JsonResult addDefaultProduct(TAppProduct tAppProduct, MultipartFile mr) {
		//先去查询默认产品是否有5种，少于5种允许添加大于五种不允许添加
				int count = tAppProductMapper.selectByDefaultProduct();
				if(count>=5){
					return new JsonResult(false,"添加默认产品已达上限不允许添加",null) ;
				}
				//查询添加的货柜是否已有产品有则不允许添加
				int result = tAppProductMapper.selectByDefaultProductAndContainerNumber(tAppProduct.getContainerNumber()) ;
				if(result>=1){
					return new JsonResult(false,"添加的货柜产品已有产品请勿重复添加",null) ;
				}
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
		         if(tAppProductMapper.insertDefaultProduct(tAppProduct)==1){
		        	 return new JsonResult(true,"添加成功",null) ;
		         }
		         
				return new JsonResult(false,"添加失败",null) ;
	}
	
	//获取默认产品
	@Override
	public JsonResult getDefaultProductList() {
		List<TAppProduct> list = tAppProductMapper.selectDefaultProduct() ;
		return new JsonResult(true,"获取成功",list);
	}
	//编辑默认产品
	@Override
	public JsonResult updateDefaultProduct(TAppProduct tAppProduct,MultipartFile mr) {
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
         if(tAppProductMapper.updateDefaultProduct(tAppProduct)==1){
        	 return new JsonResult(true,"更新成功",null) ;
         }
		return new JsonResult(false,"更新失败",null) ;
	}
	
	/**
	 * 修改房间号
	 */
	@Override
	public JsonResult updateMachine(TMachine tMachine) {
		intelligentBoxMapper.updateMachineId(tMachine);
		return new JsonResult(true,"修改成功",null);
	}
	/**
	 * 查询缺货情况
	 * 只能查询最近的3个
	 */
	@Override
	public JsonResult getProductStatus(Long corpId) {
		List<TAppProduct> tAppProduct = tAppProductMapper.selectProductStatus(corpId) ;
		return new JsonResult(true,"获取成功！",tAppProduct);
	}
	/**
	 * 导出订单数据
	 */
	@Override
	public  List<ExcleVo>  excleOrder(Long userId, Integer status, String productName, Long startTime, Long endTime, Long corpId) {
		Map<String, Object> map = new HashMap<String, Object>() ;
		map.put("userId", userId) ;
		map.put("status", status) ;
		map.put("productName", productName);
		map.put("startTime", startTime) ;
		map.put("endTime", endTime) ;
		map.put("corpId", corpId) ;
		List<ExcleVo> excleVos = intelligentBoxMapper.getExcleVo(map);
		return excleVos ;
		
	}
	@Override
	public Workbook exportExcle(List<ExcleVo> excleVos) {
		 // 创建xls文件
        Workbook workBook = new SXSSFWorkbook();
        // 创建工作簿
        Sheet sheet = workBook.createSheet("订单数据");
        //设置格式
        CellStyle styleleft = workBook.createCellStyle();styleleft.setWrapText(true);
		styleleft.setAlignment(HSSFCellStyle.ALIGN_LEFT); // 创建一个居左格式
		
		CellStyle style = workBook.createCellStyle();
		style.setWrapText(true);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//上下居中
		Font dfont = workBook.createFont();
		dfont.setFontHeightInPoints((short) 12);//设置字体大小
		
		style.setFont(dfont);
		
		CellStyle etitle = workBook.createCellStyle();etitle.setWrapText(true);
		etitle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个标题格式
		Font font = workBook.createFont();
		font.setFontHeightInPoints(Constants.detail_size);//设置字体大小
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);;//粗体显示
		etitle.setFont(font);

		CellStyle ptt = workBook.createCellStyle();ptt.setWrapText(true);
		ptt.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个标题格式
		Font pfont = workBook.createFont();
		pfont.setFontHeightInPoints(Constants.detail_size);//设置字体大小
		pfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
		ptt.setFont(pfont);
        // 设置列宽
        sheet.setColumnWidth(0, 50 * 100);
        sheet.setColumnWidth(1, 50 * 100);
        sheet.setColumnWidth(2, 50 * 100);
        sheet.setColumnWidth(3, 50 * 100);
        sheet.setColumnWidth(4, 50 * 100);
      //总表
      		int l=-1;
      		int i=-1;
      		Row row = sheet.createRow(++l);
      		row.setHeight(Constants.title_height);
      		Cell cell = row.createCell(++i);
      		cell.setCellValue("订单数据统计");
      		cell.setCellStyle(etitle);
      		sheet.addMergedRegion(new CellRangeAddress(0,0,0,4));
      		i=-1;
      			row = sheet.createRow(++l);
      			cell = row.createCell(++i);
      			cell.setCellValue("序号");
      			cell.setCellStyle(style);
      			
      			cell = row.createCell(++i);	
      			cell.setCellValue("酒店名称");
      			cell.setCellStyle(style);
      			
      			cell = row.createCell(++i);	
      			cell.setCellValue("数量");
      			cell.setCellStyle(style);
      			
      			cell = row.createCell(++i);		
      			cell.setCellValue("金额");
      			cell.setCellStyle(style);
      			
      			cell = row.createCell(++i);		
      			cell.setCellValue("类型");
      			cell.setCellStyle(style);
      			cell.setCellStyle(style);
      			for (int z = 0 ; z<excleVos.size();z++) {
      				i=-1;
      				ExcleVo excleVo = excleVos.get(z) ;
      					row = sheet.createRow(++l);
      					cell = row.createCell(++i);
      					cell.setCellValue(z+1);
      					cell.setCellStyle(style);
      		       		
      					cell = row.createCell(++i);
      					cell.setCellValue(excleVo.getCompanyName());
      					cell.setCellStyle(style);
      		       		
      					cell = row.createCell(++i);
      					cell.setCellValue(excleVo.getNumber());
      					cell.setCellStyle(style);
      					
      					cell = row.createCell(++i);
      					cell.setCellValue(excleVo.getSalePrice());
      					cell.setCellStyle(style);
      		       		
      					cell = row.createCell(++i);
      					cell.setCellValue(excleVo.getStatus()==0?"销售额(付款-退款)":"退款");
      					cell.setCellStyle(style);      					
      		       			    		
      			}
      			//列数
      			i=-1;
      			row = sheet.createRow(++l);
      		    sheet.setColumnWidth(++i, 3500);
      		    sheet.setColumnWidth(++i, 3500);
      		    sheet.setColumnWidth(++i, 3500);
      		    sheet.setColumnWidth(++i, 3500);
      		    sheet.setColumnWidth(++i, 3500);     		
      		 return workBook ;

	}

	
	
	
}
