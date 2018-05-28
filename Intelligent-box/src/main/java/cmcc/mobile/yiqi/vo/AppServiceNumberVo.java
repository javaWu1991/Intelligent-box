package cmcc.mobile.yiqi.vo;


public class AppServiceNumberVo {
	private Long CID;
	private Long TIME;
	
	
	private String URL;
	public String getURL() {
		return URL;
	}
	public void setURL(String uRL) {
		URL = uRL;
	}
	public Long getTIME() {
		return TIME;
	}
	public void setTIME(Long tIME) {
		TIME = tIME;
	}
	private String Content;
	private String Notice;
	private String Detail;
	
	private String Picurl;
	private Long Sid;
	
	public Long getSid() {
		return Sid;
	}
	public void setSid(Long sid) {
		Sid = sid;
	}
	private String RECOUNT;
	
	private String RES;
	private String type;
	private int ID;
	private Long Uid;
    private  Integer Status;
	
	
	
	public Integer getStatus() {
		return Status;
	}
	public void setStatus(Integer status) {
		Status = status;
	}
	public Long getUid() {
		return Uid;
	}
	public void setUid(Long uid) {
		Uid = uid;
	}
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public Long getCID() {
		return CID;
	}
	public void setCID(Long cID) {
		CID = cID;
	}
	
	public String getContent() {
		return Content;
	}
	public void setContent(String content) {
		Content = content;
	}
	public String getNotice() {
		return Notice;
	}
	public void setNotice(String notice) {
		Notice = notice;
	}
	public String getDetail() {
		return Detail;
	}
	public void setDetail(String detail) {
		Detail = detail;
	}
	public String getPicurl() {
		return Picurl;
	}
	public void setPicurl(String picurl) {
		Picurl = picurl;
	}

	public String getRECOUNT() {
		return RECOUNT;
	}
	public void setRECOUNT(String rECOUNT) {
		RECOUNT = rECOUNT;
	}
	public String getRES() {
		return RES;
	}
	public void setRES(String rES) {
		RES = rES;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
