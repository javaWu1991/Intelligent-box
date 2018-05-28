package cmcc.mobile.yiqi.vo;
import java.io.Serializable;
/**
 * 产品订单信息
 * 创建者 吴奔江
 * 创建时间	2017年7月27日
 */
//@Data                
//@NoArgsConstructor     
//@AllArgsConstructor
public class Product implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long id ;
	private String productId;// 商品ID
	private String subject;//订单名称 
	private String body;// 商品描述
	private String totalFee;// 总金额(单位是分)
	private String outTradeNo;// 订单号(唯一)
	private String spbillCreateIp;// 发起人IP地址
	private String attach;// 附件数据主要用于商户携带订单的自定义数据
	private Short payType;// 支付类型(1:支付宝 2:微信 3:银联)
	private Short payWay;// 支付方式 (1：PC,平板 2：手机)
	private String frontUrl;// 前台回调地址  非扫码支付使用
	private String appId ;//公众号Id
	private String mchId ;//商户号
	private String productName ;//商品名称
	private String returnCode ;//状态码
	private Integer status ;//状态
	private Long createTime ;//创建时间
	private String code ;//
	
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Product() {
		super();
	}
	public Product(String productId, String subject, String body,
			String totalFee, String outTradeNo, String spbillCreateIp,
			String attach, Short payType, Short payWay, String frontUrl, String appId, String mchId,String productName) {
		super();
		this.productId = productId;
		this.subject = subject;
		this.body = body;
		this.totalFee = totalFee;
		this.outTradeNo = outTradeNo;
		this.spbillCreateIp = spbillCreateIp;
		this.attach = attach;
		this.payType = payType;
		this.payWay = payWay;
		this.frontUrl = frontUrl;
		this.appId = appId;
		this.mchId = mchId;
		this.productName = productName ;
	}
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public String getReturnCode() {
		return returnCode;
	}
	public void setReturnCode(String returnCode) {
		this.returnCode = returnCode;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getMchId() {
		return mchId;
	}
	public void setMchId(String mchId) {
		this.mchId = mchId;
	}
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getTotalFee() {
		return totalFee;
	}
	public void setTotalFee(String totalFee) {
		this.totalFee = totalFee;
	}
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}
	public String getSpbillCreateIp() {
		return spbillCreateIp;
	}
	public void setSpbillCreateIp(String spbillCreateIp) {
		this.spbillCreateIp = spbillCreateIp;
	}
	public String getAttach() {
		return attach;
	}
	public void setAttach(String attach) {
		this.attach = attach;
	}
	public Short getPayType() {
		return payType;
	}
	public void setPayType(Short payType) {
		this.payType = payType;
	}
	public Short getPayWay() {
		return payWay;
	}
	public void setPayWay(Short payWay) {
		this.payWay = payWay;
	}
	public String getFrontUrl() {
		return frontUrl;
	}
	public void setFrontUrl(String frontUrl) {
		this.frontUrl = frontUrl;
	}
}
