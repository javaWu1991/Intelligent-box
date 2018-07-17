package cmcc.mobile.yiqi.utils;

public class CheckResult {
	private int rescode ;
	private String resmsg ;
	private String url ;
	private String newver ;
	private int check ;
	
	public CheckResult(int rescode, String resmsg, String url,String newver,int check) {
		this.rescode = rescode;
		this.resmsg = resmsg;
		this.url = url;
		this.newver = newver;
		this.check = check;
	}
	public int getRescode() {
		return rescode;
	}
	public void setRescode(int rescode) {
		this.rescode = rescode;
	}
	public String getResmsg() {
		return resmsg;
	}
	public void setResmsg(String resmsg) {
		this.resmsg = resmsg;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getNewver() {
		return newver;
	}
	public void setNewver(String newver) {
		this.newver = newver;
	}
	public int getCheck() {
		return check;
	}
	public void setCheck(int check) {
		this.check = check;
	}
	
	
}
