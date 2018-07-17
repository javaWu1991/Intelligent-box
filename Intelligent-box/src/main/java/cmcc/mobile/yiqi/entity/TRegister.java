package cmcc.mobile.yiqi.entity;

public class TRegister {
	private Long id ;
	private String machineId ;
	private Long registerTime ;
	private Long updateTime ;
	private int status ;
	private String buind ;
	
	
	
	public String getBuind() {
		return buind;
	}
	public void setBuind(String buind) {
		this.buind = buind;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public Long getRegisterTime() {
		return registerTime;
	}
	public void setRegisterTime(Long registerTime) {
		this.registerTime = registerTime;
	}
	
	
	

}
