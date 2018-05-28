package cmcc.mobile.yiqi.vo;

public class MyCheckVo {

	private String title;
	private String projectTitle;
	private String reciver;
	private String initiate;
	private Long createTime;
	private Long endTime;
	// 0:未开始 1：进行中 2：已完成
	Integer state;

	boolean isMyStart;
	
	String nextAssigneeId; 

	private Long checkId;

	public String getNextAssigneeId() {
		return nextAssigneeId;
	}

	public void setNextAssigneeId(String nextAssigneeId) {
		this.nextAssigneeId = nextAssigneeId;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public String getInitiate() {
		return initiate;
	}

	public void setInitiate(String initiate) {
		this.initiate = initiate;
	}

	public Long getCheckId() {
		return checkId;
	}

	public void setCheckId(Long checkId) {
		this.checkId = checkId;
	}

	public boolean isMyStart() {
		return isMyStart;
	}

	public void setMyStart(boolean isMyStart) {
		this.isMyStart = isMyStart;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getReciver() {
		return reciver;
	}

	public void setReciver(String reciver) {
		this.reciver = reciver;
	}

	public Long getEndTime() {
		return endTime;
	}

	public void setEndTime(Long endTime) {
		this.endTime = endTime;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public String getProjectTitle() {
		return projectTitle;
	}

	public void setProjectTitle(String projectTitle) {
		this.projectTitle = projectTitle;
	}

}
