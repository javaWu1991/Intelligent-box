package cmcc.mobile.yiqi.entity;

public class THeartbeat {
	private Long id ;
	private String machineId ;
	private String json ;
	private Long createTime ;
	private Long updateTime ;
	private String version ;
	private int ledState ;
	private int light ;
	private int motorState ;
	private int simRssi ;
	
	
	
	public int getLedState() {
		return ledState;
	}
	public void setLedState(int ledState) {
		this.ledState = ledState;
	}
	public int getLight() {
		return light;
	}
	public void setLight(int light) {
		this.light = light;
	}
	public int getMotorState() {
		return motorState;
	}
	public void setMotorState(int motorState) {
		this.motorState = motorState;
	}
	public int getSimRssi() {
		return simRssi;
	}
	public void setSimRssi(int simRssi) {
		this.simRssi = simRssi;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
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
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	
	

}
