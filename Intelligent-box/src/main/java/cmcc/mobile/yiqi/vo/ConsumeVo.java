package cmcc.mobile.yiqi.vo;

import cmcc.mobile.yiqi.entity.TAppProduct;

public class ConsumeVo extends TAppProduct{
	private String appId ;
	
	private String mchId ;

	private String order_code ;

	private double money ;
	
	
	public String getOrder_code() {
		return order_code;
	}

	public void setOrder_code(String order_code) {
		this.order_code = order_code;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
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
	
	
	
}
