package cmcc.mobile.yiqi.web.service.impl;

import java.math.BigDecimal;
import java.net.URL;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cmcc.mobile.yiqi.entity.TAppProduct;
import cmcc.mobile.yiqi.entity.TRefund;
import cmcc.mobile.yiqi.entity.dao.IntelligentBoxMapper;
import cmcc.mobile.yiqi.entity.dao.TAppProductMapper;
import cmcc.mobile.yiqi.utils.ClientCustomSSL;
import cmcc.mobile.yiqi.utils.CommonUtil;
import cmcc.mobile.yiqi.utils.ConfigUtil;
import cmcc.mobile.yiqi.utils.Constants;
import cmcc.mobile.yiqi.utils.DateUtil;
import cmcc.mobile.yiqi.utils.HttpUtil;
import cmcc.mobile.yiqi.utils.MobileUtil;
import cmcc.mobile.yiqi.utils.PayCommonUtil;
import cmcc.mobile.yiqi.utils.RandomNumUtil;
import cmcc.mobile.yiqi.utils.XMLUtil;
import cmcc.mobile.yiqi.vo.PayVo;
import cmcc.mobile.yiqi.vo.Product;
import com.alipay.demo.trade.utils.ZxingUtils;

import cmcc.mobile.yiqi.web.service.IWeixinPayService;
import javassist.compiler.ast.NewExpr;
import weixin.popular.api.SnsAPI;
@Service
public class WeixinPayServiceImpl implements IWeixinPayService {
	private static final Logger logger = LoggerFactory.getLogger(IntelligentBoxServiceImpl.class);
	
	private static final String notify_url = "http://www.xajun.com/Intelligent-box/api/H5/notify";

//	private static final String server_url = "";
	@Autowired
	private IntelligentBoxMapper intelligentBoxMapper ;
	@Autowired
	private TAppProductMapper tAppProductMapper ;
	@SuppressWarnings("rawtypes")
	@Override
	public String weixinPay2(Product product) {
		logger.info("订单号：{}生成微信支付码",product.getOutTradeNo());
		String  message = Constants.SUCCESS;
		try {
			String imgPath= Constants.QRCODE_PATH+Constants.SF_FILE_SEPARATOR+product.getOutTradeNo()+".png";
			// 账号信息
			String key = ConfigUtil.API_KEY; // key
			String trade_type = "NATIVE";// 交易类型 原生扫码支付
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			ConfigUtil.commonParams(packageParams);
			packageParams.put("product_id", product.getProductId());// 商品ID
			packageParams.put("body", product.getBody());// 商品描述
			packageParams.put("out_trade_no", product.getOutTradeNo());// 商户订单号
			String totalFee = product.getTotalFee();
			totalFee =  CommonUtil.subZeroAndDot(totalFee);
			packageParams.put("total_fee", totalFee);// 总金额
			packageParams.put("spbill_create_ip", product.getSpbillCreateIp());// 发起人IP地址
			packageParams.put("notify_url", notify_url);// 回调地址
			packageParams.put("trade_type", trade_type);// 交易类型
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名

			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String resXml = HttpUtil.postData(ConfigUtil.UNIFIED_ORDER_URL, requestXML);
			Map map = XMLUtil.doXMLParse(resXml);
			String returnCode = (String) map.get("return_code");
			if("SUCCESS".equals(returnCode)){
				String resultCode = (String) map.get("result_code");
				if("SUCCESS".equals(resultCode)){
					logger.info("订单号：{}生成微信支付码成功",product.getOutTradeNo());
					String urlCode = (String) map.get("code_url");
					ConfigUtil.shorturl(urlCode);//转换为短链接
					ZxingUtils.getQRCodeImge(urlCode, 256, imgPath);// 生成二维码
				}else{
					String errCodeDes = (String) map.get("err_code_des");
					logger.info("订单号：{}生成微信支付码(系统)失败:{}",product.getOutTradeNo(),errCodeDes);
					message = Constants.FAIL;
				}
			}else{
				String returnMsg = (String) map.get("return_msg");
				logger.info("(订单号：{}生成微信支付码(通信)失败:{}",product.getOutTradeNo(),returnMsg);
				message = Constants.FAIL;
			}
		} catch (Exception e) {
			logger.error("订单号：{}生成微信支付码失败(系统异常))",product.getOutTradeNo(),e);
			message = Constants.FAIL;
		}
		return message;
	}
	@Override
	public void weixinPay1(Product product) {
		//商户支付回调URL设置指引：进入公众平台-->微信支付-->开发配置-->扫码支付-->修改 加入回调URL
		//注意参数初始化 这只是个Demo
		SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
		//封装通用参数
		ConfigUtil.commonParams(packageParams);
		packageParams.put("product_id", product.getProductId());//真实商品ID
		packageParams.put("time_stamp", PayCommonUtil.getCurrTime());
		//生成签名
		String sign = PayCommonUtil.createSign("UTF-8", packageParams, ConfigUtil.API_KEY);
		//组装二维码信息(注意全角和半角：的区别 狗日的腾讯)
    	StringBuffer qrCode = new StringBuffer();
    	qrCode.append("weixin://wxpay/bizpayurl?");
    	qrCode.append("appid="+ConfigUtil.APP_ID);
    	qrCode.append("&mch_id="+ConfigUtil.MCH_ID);
    	qrCode.append("&nonce_str="+packageParams.get("nonce_str"));
    	qrCode.append("&product_id="+product.getProductId());
    	qrCode.append("&time_stamp="+packageParams.get("time_stamp"));
    	qrCode.append("&sign="+sign);
    	String imgPath= Constants.QRCODE_PATH+Constants.SF_FILE_SEPARATOR+product.getProductId()+".png";
    	//生成二维码
        ZxingUtils.getQRCodeImge(qrCode.toString(), 256, imgPath);
	}
	@SuppressWarnings("rawtypes")
	@Override
	public String weixinRefund(Product product) {
		logger.info("订单号：{}微信退款",product.getOutTradeNo());
		String  message = Constants.SUCCESS;
		try {
			// 账号信息
			String key = ConfigUtil.API_KEY; // key
			String mchId = product.getMchId() ;
			String appId = product.getAppId() ;
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			ConfigUtil.commonParams(packageParams);
			packageParams.put("out_trade_no", product.getOutTradeNo());// 商户订单号
			packageParams.put("out_refund_no", product.getReturnCode());//商户退款单号
			String totalFee = product.getTotalFee();
			totalFee =  CommonUtil.subZeroAndDot(totalFee);
			packageParams.put("total_fee", totalFee);// 总金额
			packageParams.put("refund_fee", totalFee);//退款金额
			packageParams.put("mch_id", mchId);//操作员帐号, 默认为商户号
			packageParams.put("appid", appId) ;
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名
			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String weixinPost = ClientCustomSSL.doRefund(ConfigUtil.REFUND_URL, mchId,requestXML).toString(); 
			Map map = XMLUtil.doXMLParse(weixinPost);
			String returnCode = (String) map.get("return_code");
			if("SUCCESS".equals(returnCode)){
				String resultCode = (String) map.get("result_code");
				if("SUCCESS".equals(resultCode)){
					intelligentBoxMapper.updateOrder(product.getOutTradeNo()) ;
					logger.info("订单号：{}微信退款成功并删除二维码",product.getOutTradeNo());
				}else{
					String errCodeDes  = (String) map.get("err_code_des");
					logger.info("订单号：{}微信退款失败:{}",product.getOutTradeNo(),errCodeDes);
					message = Constants.FAIL;
				}
			}else{
				String returnMsg = (String) map.get("return_msg");
				logger.info("订单号：{}微信退款失败:{}",product.getOutTradeNo(),returnMsg);
				message = Constants.FAIL;
			}
		} catch (Exception e) {
			logger.error("订单号：{}微信支付失败(系统异常)",product.getOutTradeNo(), e);
			message = Constants.FAIL;
		}
		TRefund tRefund = new TRefund() ;
		tRefund.setCreateTime(System.currentTimeMillis());
		tRefund.setOrderCode(product.getOutTradeNo());
		tRefund.setRefundCode(product.getReturnCode());
		tRefund.setStatus(message.equals(Constants.SUCCESS)?1:0);
		intelligentBoxMapper.insetRefund(tRefund) ;		
		return message;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public String weixinCloseorder(Product product) {
		logger.info("订单号：{}微信关闭订单",product.getOutTradeNo());
		String  message = Constants.SUCCESS;
		try {
			String key = ConfigUtil.API_KEY; // key
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			ConfigUtil.commonParams(packageParams);
			packageParams.put("out_trade_no", product.getOutTradeNo());// 商户订单号
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名
			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String resXml = HttpUtil.postData(ConfigUtil.CLOSE_ORDER_URL, requestXML);
			Map map = XMLUtil.doXMLParse(resXml);
			String returnCode = (String) map.get("return_code");
			if("SUCCESS".equals(returnCode)){
				String resultCode =  (String) map.get("result_code");
				if("SUCCESS".equals(resultCode)){
					logger.info("订单号：{}微信关闭订单成功",product.getOutTradeNo());
				}else{
					String errCode =  (String) map.get("err_code");
					String errCodeDes =  (String) map.get("err_code_des");
					if("ORDERNOTEXIST".equals(errCode)||"ORDERCLOSED".equals(errCode)){//订单不存在或者已经关闭
						logger.info("订单号：{}微信关闭订单:{}",product.getOutTradeNo(),errCodeDes);
					}else{
						logger.info("订单号：{}微信关闭订单失败:{}",product.getOutTradeNo(),errCodeDes);
						message = Constants.FAIL;
					}
				}
			}else{
				String returnMsg = (String) map.get("return_msg");
				logger.info("订单号：{}微信关闭订单失败:{}",product.getOutTradeNo(),returnMsg);
				message = Constants.FAIL;
			}
		} catch (Exception e) {
			logger.error("订单号：{}微信关闭订单失败(系统异常)", product.getOutTradeNo(),e);
			message = Constants.FAIL;
		}
		return message;
	}
	/**
	 * 商户可以通过该接口下载历史交易清单。比如掉单、系统错误等导致商户侧和微信侧数据不一致，通过对账单核对后可校正支付状态。
		注意：
		1、微信侧未成功下单的交易不会出现在对账单中。支付成功后撤销的交易会出现在对账单中，跟原支付单订单号一致，bill_type为REVOKED；
		2、微信在次日9点启动生成前一天的对账单，建议商户10点后再获取；
		3、对账单中涉及金额的字段单位为“元”。
		
		4、对账单接口只能下载三个月以内的账单。
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public void saveBill() {
		try {
			String key = ConfigUtil.API_KEY; // key
			//获取两天以前的账单
			//String billDate = DateUtil.getBeforeDayDate("2");
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			ConfigUtil.commonParams(packageParams);//公用部分
			packageParams.put("bill_type", "ALL");//ALL，返回当日所有订单信息，默认值SUCCESS，返回当日成功支付的订单REFUND，返回当日退款订单
			//packageParams.put("tar_type", "GZIP");//压缩账单
			packageParams.put("bill_date", "20161206");//账单日期
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名
			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String resXml = HttpUtil.postData(ConfigUtil.DOWNLOAD_BILL_URL, requestXML);
            if(resXml.startsWith("<xml>")){
            	Map map = XMLUtil.doXMLParse(resXml);
    			String returnMsg = (String) map.get("return_msg");
    			logger.info("微信查询订单失败:{}",returnMsg);
			}else{
				 //入库
			}
		} catch (Exception e) {
			logger.error("微信查询订单异常", e);
		}
		
	}
	@Override
	public String weixinPayMobile(Product product) {
		String totalFee = product.getTotalFee();
		//redirect_uri 需要在微信支付端添加认证网址
		totalFee =  CommonUtil.subZeroAndDot(totalFee);
		String redirect_uri = "" ;
		//也可以通过state传递参数 redirect_uri 后面加参数未经过验证
		return SnsAPI.connectOauth2Authorize(product.getAppId(), redirect_uri, true,null);
	}
	@SuppressWarnings("rawtypes")
	@Override
	public String weixinPayH5(Product product) {
		logger.info("订单号：{}发起H5支付",product.getOutTradeNo());
		//PayVo payVo = new PayVo() ;
		StringBuffer url = new StringBuffer();
		//获取设备编号
		TAppProduct tAppProduct = tAppProductMapper.selectByPrimaryKey(Long.valueOf(product.getProductId())) ;
		try {
			// 账号信息
			String key = ConfigUtil.API_KEY; // key
			String trade_type = "JSAPI";//交易类型 H5 支付 
			SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
			String openId = MobileUtil.getOpenId(product);
			packageParams.put("openid", openId) ;
			packageParams.put("appid", product.getAppId()) ;
			packageParams.put("device_info", "WEB") ;
			packageParams.put("mch_id", product.getMchId()) ;
			packageParams.put("nonce_str", RandomNumUtil.getStringRandom());
			packageParams.put("product_id", product.getProductId());// 商品ID
			packageParams.put("body", "小爱君商城-"+product.getProductName());// 商品描述
			packageParams.put("out_trade_no", product.getOutTradeNo());// 商户订单号
			String totalFee = product.getTotalFee();
			totalFee =  CommonUtil.subZeroAndDot(totalFee);
			packageParams.put("total_fee", totalFee);// 总金额
			//H5支付要求商户在统一下单接口中上传用户真实ip地址 spbill_create_ip
			packageParams.put("spbill_create_ip", product.getSpbillCreateIp());// 发起人IP地址
			packageParams.put("notify_url", notify_url);// 回调地址
			packageParams.put("trade_type", trade_type);// 交易类型
			//H5支付专用 
			JSONObject value = new JSONObject();
			value.put("type", "WAP");
			value.put("wap_url", "http://www.xajun.com");////WAP网站URL地址
			value.put("wap_name", "小爱君商城");//WAP 网站名
			JSONObject scene_info = new JSONObject();
			scene_info.put("h5_info", value);
			packageParams.put("scene_info", scene_info.toString());
			
			String sign = PayCommonUtil.createSign("UTF-8", packageParams, key);
			packageParams.put("sign", sign);// 签名

			String requestXML = PayCommonUtil.getRequestXml(packageParams);
			String resXml = HttpUtil.postData(ConfigUtil.UNIFIED_ORDER_URL, requestXML);
			System.out.println("rizhizhizizziizi----?>"+requestXML);
			System.out.println("logger----->"+resXml);
			Map map = XMLUtil.doXMLParse(resXml);
			System.out.println("map--------->>>"+map);
			String returnCode = (String) map.get("return_code");
			
			if("SUCCESS".equals(returnCode)){
				String resultCode = (String) map.get("result_code");
				if("SUCCESS".equals(resultCode)){
					String prepay_id = (String) map.get("prepay_id");
					String prepay_id2 = "prepay_id=" + prepay_id;
					String packages = prepay_id2;
					SortedMap<Object, Object> finalpackage = new TreeMap<Object, Object>();
					String timestamp = DateUtil.getTimestamp();
					String nonceStr = packageParams.get("nonce_str").toString();
					finalpackage.put("appId",  product.getAppId());
					finalpackage.put("timeStamp", timestamp);
					finalpackage.put("nonceStr", nonceStr);
					finalpackage.put("package", packages);  
					finalpackage.put("signType", "MD5");
					//这里很重要  参数一定要正确 狗日的腾讯 参数到这里就成大写了
					//可能报错信息(支付验证签名失败 get_brand_wcpay_request:fail)
					sign = PayCommonUtil.createSign("UTF-8", finalpackage,ConfigUtil.API_KEY);
					url.append("http://www.xajun.com/xiaoai/payPage.html?");
					url.append("timeStamp="+timestamp+"&nonceStr=" + nonceStr + "&package=" + packages);
					url.append("&signType=MD5" + "&paySign=" + sign+"&appid="+ product.getAppId());
					url.append("&orderNo="+product.getOutTradeNo()+"&totalFee="+totalFee+"&machineId="+tAppProduct.getMachineId());
					logger.info("订单号：{}发起H5支付(系统)成功:{}",product.getOutTradeNo(),200);
				}else{
					String errCodeDes = (String) map.get("err_code_des");
					logger.info("订单号：{}发起H5支付(系统)失败:{}",product.getOutTradeNo(),errCodeDes);
				}
			}else{
				String returnMsg = (String) map.get("return_msg");
				logger.info("(订单号：{}发起H5支付(通信)失败:{}",product.getOutTradeNo(),returnMsg);
			}
			product.setReturnCode(returnCode);
		} catch (Exception e) {
			logger.error("订单号：{}发起H5支付失败(系统异常))",product.getOutTradeNo(),e);
		}
		  BigDecimal num1 = new BigDecimal(product.getTotalFee());
		  BigDecimal num2 = new BigDecimal(100);
		  BigDecimal result = num1.divide(num2) ;
		product.setTotalFee(result.toString());
		product.setCreateTime(System.currentTimeMillis());
		product.setStatus(3);
		intelligentBoxMapper.insertOrder(product);
		return url.toString() ;
	}
}
