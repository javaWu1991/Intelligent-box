package cmcc.mobile.yiqi.entity;

public class TMachine {
	private Long id ;
	private String machineId ;
	private Long corpId ;
	private int status ;
	private String buind ;
	private Long createTime ;
	private String companyName ;
	private String productState ;
	private String roomCode ;
	
	
	
	public String getRoomCode() {
		return roomCode;
	}
	public void setRoomCode(String roomCode) {
		this.roomCode = roomCode;
	}
	public String getProductState() {
		return productState;
	}
	public void setProductState(String productState) {
		this.productState = productState;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public Long getCorpId() {
		return corpId;
	}
	public void setCorpId(Long corpId) {
		this.corpId = corpId;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getBuind() {
		return buind;
	}
	public void setBuind(String buind) {
		this.buind = buind;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	
	

}
